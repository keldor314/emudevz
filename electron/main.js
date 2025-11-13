const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("node:path");

const isDev = !app.isPackaged;

app.setName("EmuDevz");

function createWindow() {
	const iconBase = isDev
		? path.join(__dirname, "..", "public", "icons")
		: path.join(process.resourcesPath, "app.asar.unpacked", "build", "icons");
	const iconPath = path.join(iconBase, "icon-512x512.png");

	const win = new BrowserWindow({
		title: "EmuDevz",
		width: 1280,
		height: 800,
		fullscreen: true,
		resizable: false,
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

	if (process.platform === "win32") {
		// (match electron-builder appId for correct icon association)
		app.setAppUserModelId("io.r-labs.emudevz");
	}

	// Dev: open dev server | Prod: static build
	if (isDev) {
		const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:3000";
		win.loadURL(devUrl);
	} else {
		const indexPath = path.join(
			process.resourcesPath,
			"app.asar.unpacked",
			"build",
			"index.html"
		);
		win.loadFile(indexPath);
	}

	// Force fullscreen
	win.on("leave-full-screen", () => {
		win.setFullScreen(true);
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

app.whenReady().then(createWindow);

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
