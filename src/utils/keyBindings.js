import { DEFAULT_KEY_BINDINGS } from "../models/savedata";
import store from "../store";

export const getKeyBinding = (bindingName) => {
	const keyBindings = store.getState().savedata?.keyBindings || {};
	return keyBindings[bindingName] ?? DEFAULT_KEY_BINDINGS[bindingName];
};

export const checkKeyBinding = (event, bindingName) => {
	const keyBinding = getKeyBinding(bindingName);

	if (!keyBinding || typeof keyBinding !== "string") return false;

	const parts = keyBinding.toUpperCase().split("+");
	const key = parts.pop();
	const modifiers = new Set(parts);
	const eventKey = (event.key || "").toUpperCase();
	const matchesKey = eventKey === key;
	const matchesCtrl =
		(event.ctrlKey || event.metaKey) === modifiers.has("CTRL");
	const matchesAlt = event.altKey === modifiers.has("ALT");
	const matchesShift = event.shiftKey === modifiers.has("SHIFT");

	return matchesKey && matchesCtrl && matchesAlt && matchesShift;
};
