import toast from "react-hot-toast";

const STYLE = {
	userSelect: "none",
	background: "var(--toast-background, #333333)",
	color: "var(--toast-text, #ffffff)",
};

const DEFAULT_DURATION = 3000;

export default {
	normal(message, options = { duration: DEFAULT_DURATION }) {
		toast(message, {
			style: STYLE,
			...options,
		});
	},
	success(message, options = { duration: DEFAULT_DURATION }) {
		toast.success(message, {
			style: STYLE,
			...options,
		});
	},
	error(message, options = { duration: DEFAULT_DURATION }) {
		toast.error(message, {
			style: STYLE,
			...options,
		});
	},
};
