import decorator from "./decorator";

export default {
	markError(ref, code, from, to) {
		this.clear(ref, code);
		if (to > from && code.length >= to) this.decorate(ref, from, to);
	},

	...decorator("cm-error", "mark", "var(--editor-error, #e8433180)"),
};
