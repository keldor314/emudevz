import { dlc } from "../../utils";

const SFX_DIR = "sfx/";

class SFX {
	constructor() {
		this._volume = 1;
	}

	setVolume(value) {
		this._volume = value;
	}

	play(soundName) {
		if (!dlc.installed()) return;

		const audio = new Audio(SFX_DIR + soundName + ".mp3");
		audio.volume = this._volume;
		audio.play().catch(() => {});
	}
}

export default new SFX();
