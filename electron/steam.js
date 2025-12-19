const steamworks = require("steamworks.js");

const APP_ID = 4260720;

let _client = null;

function init() {
	if (_client) return _client;

	try {
		_client = steamworks.init(APP_ID);
		return _client;
	} catch (err) {
		_client = null;
		return null;
	}
}

function enableOverlay() {
	try {
		steamworks.electronEnableSteamOverlay();
	} catch (err) {
		console.warn(err, "⚠️ Failed to enable Steam overlay");
	}
}

function registerIpc(ipcMain) {
	init();

	ipcMain.handle("steam:unlock-achievement", (_event, achievementId) => {
		const client = _client ?? init();
		if (!client) {
			console.warn(
				"⚠️ Cannot unlock achievement: ",
				achievementId,
				" -> ",
				"client not initialized"
			);
			return { ok: false };
		}

		try {
			const ok = client.achievement.activate(achievementId);
			return { ok };
		} catch (err) {
			const reason = err?.message || e?.toString() || "?";
			console.warn(
				"⚠️ Cannot unlock achievement: ",
				achievementId,
				" -> ",
				reason
			);
			return { ok: false, error: reason };
		}
	});
}

module.exports = {
	init,
	enableOverlay,
	registerIpc,
};
