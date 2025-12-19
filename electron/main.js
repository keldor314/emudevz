const { app, BrowserWindow, shell, ipcMain, protocol } = require("electron");
const path = require("node:path");
const steam = require("./steam");

const isDev = !app.isPackaged;

app.setName("EmuDevz");

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
		: path.join(process.resourcesPath, "app.asar.unpacked", "build", "icons");
	const iconPath = path.join(iconBase, "icon-512x512.png");

	// Main window
	const win = new BrowserWindow({
		title: "EmuDevz",
		width: 1280,
		height: 800,
		fullscreen: true,
		resizable: true,
		center: true,
		autoHideMenuBar: true,
		icon: iconPath,
		backgroundColor: "#000000",
		show: true,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
	});

	// Disable native menu bar (Alt)
	if (!isDev) win.setMenu(null);

	if (process.platform === "win32") {
		// (match electron-builder appId for correct icon association)
		app.setAppUserModelId("io.r-labs.emudevz");
	}

	// Dev: open dev server URL | Prod: serve via app:// protocol
	if (isDev) {
		const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:3000";
		win.loadURL(devUrl);
	} else {
		win.loadURL("app://-/index.html");
	}

	// Keyboard zoom shortcuts on Windows/Linux:
	// - Ctrl+Shift++ or Ctrl+NumpadAdd: Zoom in
	// - Ctrl+- or Ctrl+NumpadSubtract: Zoom out
	// - Ctrl+0: Reset zoom
	win.webContents.on("before-input-event", (event, input) => {
		if (input.type === "keyDown" && input.alt && input.code === "F4") {
			// (force-close on Alt+F4 even if the renderer captures keys)
			event.preventDefault();
			win.close();
			return;
		}

		if (input.type !== "keyDown") return;
		const ctrlOrCmd = input.control || input.meta;
		if (!ctrlOrCmd) return;

		const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
		const step = 0.1;

		// Zoom in
		if (
			input.code === "NumpadAdd" ||
			input.code === "Digit3" ||
			input.code === "Numpad3"
		) {
			const current = win.webContents.getZoomFactor();
			win.webContents.setZoomFactor(clamp(current + step, 0.5, 3));
			event.preventDefault();
			return;
		}
		// Zoom out
		if (
			input.code === "NumpadSubtract" ||
			input.code === "Digit1" ||
			input.code === "Numpad1"
		) {
			const current = win.webContents.getZoomFactor();
			win.webContents.setZoomFactor(clamp(current - step, 0.5, 3));
			event.preventDefault();
			return;
		}
		// Reset zoom
		if (input.code === "Digit0" || input.code === "Numpad0") {
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
}

app.whenReady().then(() => {
	// Map app:// protocol to unpacked build directory
	if (!isDev) {
		const buildDir = path.join(
			process.resourcesPath,
			"app.asar.unpacked",
			"build"
		);
		const resolvePath = (requestUrl) => {
			try {
				const urlObj = new URL(requestUrl);
				let pathname = urlObj.pathname || "/";
				if (pathname === "/") pathname = "/index.html";

				const fsPath = path.normalize(
					path.join(buildDir, decodeURIComponent(pathname))
				);

				if (!fsPath.startsWith(buildDir))
					return path.join(buildDir, "index.html");

				return fsPath;
			} catch {
				return path.join(buildDir, "index.html");
			}
		};

		protocol.registerFileProtocol("app", (request, callback) => {
			const filePath = resolvePath(request.url);
			callback({ path: filePath });
		});
	}

	createWindow();
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
	if (win) {
		win.webContents.openDevTools({ mode: "detach" });
	}
});

steam.registerIpc(ipcMain);
