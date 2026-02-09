const {
	app,
	BrowserWindow,
	shell,
	ipcMain,
	protocol,
	net,
} = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const steam = require("./steam");

const isDev = !app.isPackaged;
const isWindows = process.platform === "win32";
const isMacOS = process.platform === "darwin";

app.setName("EmuDevz");

// Match electron-builder appId for correct icon association
if (process.platform === "win32") {
	app.setAppUserModelId("io.r-labs.emudevz");
}

// Enable Steam integrations
steam.registerIpc(ipcMain);
steam.enableOverlay();

// Set up custom app:// protocol
protocol.registerSchemesAsPrivileged([
	{
		scheme: "app",
		privileges: {
			standard: true,
			secure: true,
			corsEnabled: true,
			supportFetchAPI: true,
			stream: true,
			allowServiceWorkers: true,
		},
	},
]);

function createWindow() {
	const iconBase = isDev
		? path.join(__dirname, "..", "public", "icons")
		: path.join(app.getAppPath(), "build", "icons");
	const iconPath = path.join(iconBase, "icon-512x512.png");

	// Main window
	const win = new BrowserWindow({
		title: "EmuDevz",
		width: 1280,
		height: 800,
		fullscreen: !isWindows,
		resizable: true,
		center: true,
		autoHideMenuBar: true,
		icon: iconPath,
		backgroundColor: "#000000",
		show: !isWindows,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
			spellcheck: false,
		},
	});

	// Disable native menu bar (Alt)
	if (!isDev) win.setMenu(null);

	// Dev: open dev server URL | Prod: serve via app:// protocol
	if (isDev) {
		const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:3000";
		win.loadURL(devUrl);
	} else {
		win.loadURL("app://-/index.html");
	}

	// Keyboard zoom shortcuts on Windows/Linux:
	// - Ctrl++ or Ctrl+NumpadAdd: Zoom in
	// - Ctrl-- or Ctrl+NumpadSubtract: Zoom out
	// - Ctrl+0: Reset zoom
	win.webContents.on("before-input-event", (event, input) => {
		if (input.type === "keyDown" && input.alt && input.code === "F4") {
			// (force-close on Alt+F4 even if the renderer captures keys)
			event.preventDefault();
			win.close();
			return;
		}

		// Disable back/forward navigation
		if (
			input.type === "keyDown" &&
			(input.key === "BrowserBack" || input.key === "BrowserForward")
		) {
			event.preventDefault();
			return;
		}
		if (
			input.type === "mouseDown" &&
			(input.key === "BrowserBack" || input.key === "BrowserForward")
		) {
			event.preventDefault();
			return;
		}

		if (input.type !== "keyDown") return;

		// Fullscreen toggle
		// Windows/Linux: F11
		// macOS: Ctrl+Cmd+F
		if (
			(!isMacOS && input.code === "F11") ||
			(isMacOS && input.control && input.meta && input.code === "KeyF")
		) {
			// HACK: W11 has a bug where fullscreen electron apps that use the Steam overlay create ghost alt-tab entries
			if (!isWindows) win.setFullScreen(!win.isFullScreen());
			event.preventDefault();
			return;
		}

		const ctrlOrCmd = input.control || input.meta;
		if (!ctrlOrCmd) return;

		const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
		const step = 0.1;

		// Zoom in
		if (
			!input.alt &&
			(input.code === "NumpadAdd" ||
				input.key === "+" ||
				input.key === "=" ||
				input.code === "Digit3" ||
				input.code === "Numpad3")
		) {
			const current = win.webContents.getZoomFactor();
			win.webContents.setZoomFactor(clamp(current + step, 0.5, 3));
			event.preventDefault();
			return;
		}
		// Zoom out
		if (
			!input.alt &&
			(input.code === "NumpadSubtract" ||
				input.key === "-" ||
				input.key === "_" ||
				input.code === "Digit1" ||
				input.code === "Numpad1")
		) {
			const current = win.webContents.getZoomFactor();
			win.webContents.setZoomFactor(clamp(current - step, 0.5, 3));
			event.preventDefault();
			return;
		}
		// Reset zoom
		if (
			!input.alt &&
			(input.key === "0" || input.code === "Digit0" || input.code === "Numpad0")
		) {
			win.webContents.setZoomFactor(1);
			event.preventDefault();
			return;
		}
	});

	// Open external links in the default browser
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (/^https?:\/\//.test(url)) {
			shell.openExternal(url);
			return { action: "deny" };
		}
		return { action: "allow" };
	});

	return win;
}

app.whenReady().then(() => {
	// Map app:// protocol to files inside app.asar/build
	if (!isDev) {
		const buildDir = path.join(app.getAppPath(), "build");

		protocol.handle("app", (request) => {
			const urlObj = new URL(request.url);
			let pathname = urlObj.pathname || "/";
			if (pathname === "/") pathname = "/index.html";

			const decoded = decodeURIComponent(pathname);
			const abs = path.resolve(buildDir, "." + decoded);
			const rel = path.relative(buildDir, abs);
			const safe = rel && !rel.startsWith("..") && !path.isAbsolute(rel);

			const filePath = safe ? abs : path.join(buildDir, "index.html");

			return net.fetch(pathToFileURL(filePath).toString());
		});
	}

	const win = createWindow();
	if (isWindows) {
		win.maximize();
		win.show();
	}
});

// Open window on start
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
	app.quit();
});

// DevTools button
ipcMain.handle("open-devtools", () => {
	const win = BrowserWindow.getFocusedWindow();
	if (win) win.webContents.openDevTools({ mode: "detach" });
});
