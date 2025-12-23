import { oneDark } from "@codemirror/theme-one-dark";
import { basicDark } from "cm6-theme-basic-dark";
import { basicLight } from "cm6-theme-basic-light";
import { gruvboxDark } from "cm6-theme-gruvbox-dark";
import { gruvboxLight } from "cm6-theme-gruvbox-light";
import { materialDark } from "cm6-theme-material-dark";
import { nord } from "cm6-theme-nord";
import { solarizedDark } from "cm6-theme-solarized-dark";
import { solarizedLight } from "cm6-theme-solarized-light";

export default {
	getById(id) {
		switch (id) {
			case "basicLight":
				return basicLight;
			case "basicDark":
				return basicDark;
			case "solarizedLight":
				return solarizedLight;
			case "solarizedDark":
				return solarizedDark;
			case "materialDark":
				return materialDark;
			case "nord":
				return nord;
			case "gruvboxLight":
				return gruvboxLight;
			case "gruvboxDark":
				return gruvboxDark;
			case "oneDark":
			default:
				return oneDark;
		}
	},
};
