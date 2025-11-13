const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	isElectron: true,
	openDevTools: () => ipcRenderer.invoke("open-devtools"),
});
