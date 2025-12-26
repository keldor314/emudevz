import { dlc } from "../../utils";

const SFX_DIR = "sfx/";
const DEBOUNCE_MS = 100;

class SFX {
	constructor() {
		this._volume = 0.5;
		this._lastPlayTime = 0;
	}

	setVolume(value) {
		this._volume = value;
	}

	play(soundName) {
		if (!dlc.installed()) return;

		const now = Date.now();
		if (now - this._lastPlayTime < DEBOUNCE_MS) return;

		this._lastPlayTime = now;

		const audio = new Audio(SFX_DIR + soundName + ".mp3");
		audio.volume = this._volume;
		audio.play().catch(() => {});
	}
}

export default new SFX();
