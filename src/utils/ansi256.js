export function ansi256ToHex(n) {
	n = Math.max(0, Math.min(255, Number(n) || 0));

	// 0-15: basic colors
	const basic = [
		"#000000",
		"#800000",
		"#008000",
		"#808000",
		"#000080",
		"#800080",
		"#008080",
		"#c0c0c0",
		"#808080",
		"#ff0000",
		"#00ff00",
		"#ffff00",
		"#0000ff",
		"#ff00ff",
		"#00ffff",
		"#ffffff",
	];
	if (n < 16) return basic[n];

	// 16-231: 6x6x6 color cube
	if (n >= 16 && n <= 231) {
		const i = n - 16;
		const r = Math.floor(i / 36);
		const g = Math.floor((i % 36) / 6);
		const b = i % 6;
		const map = [0, 95, 135, 175, 215, 255];
		const toHex = (v) => v.toString(16).padStart(2, "0");
		return `#${toHex(map[r])}${toHex(map[g])}${toHex(map[b])}`;
	}

	// 232-255: grayscale ramp
	const v = 8 + 10 * (n - 232);
	const toHex = (x) => x.toString(16).padStart(2, "0");
	return `#${toHex(v)}${toHex(v)}${toHex(v)}`;
}
