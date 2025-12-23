export default {
	getInvertedPngPath(path) {
		if (typeof path !== "string") return path;
		if (!path.endsWith(".png")) return path;
		if (path.includes(".inverted.")) return path;

		const lastDotIndex = path.lastIndexOf(".");
		if (lastDotIndex <= 0) return path;

		return `${path.slice(0, lastDotIndex)}.inverted${path.slice(lastDotIndex)}`;
	},
};
