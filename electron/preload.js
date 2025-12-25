const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	isElectron: true,
	openDevTools: () => ipcRenderer.invoke("open-devtools"),
});

contextBridge.exposeInMainWorld("steam", {
	unlockAchievement: (achievementId) =>
		ipcRenderer.invoke("steam:unlock-achievement", achievementId),
	isDlcInstalled: () => ipcRenderer.invoke("steam:is-dlc-installed"),
	openDlcStore: () => ipcRenderer.invoke("steam:open-dlc-store"),
});
