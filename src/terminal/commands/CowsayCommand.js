import { dlc } from "../../utils";
import Command from "./Command";

export default class CowsayCommand extends Command {
	static get name() {
		return "cowsay";
	}

	static get isBlocked() {
		return !dlc.installed();
	}

	static get isHidden() {
		return !dlc.installed();
	}

	async execute() {
		const message = this._args.join(" ") || "???";
		const MAX_WIDTH = 40;

		const rawLines = message.split("\n");
		const wrappedLines = [];

		for (const rawLine of rawLines) {
			if (rawLine.length <= MAX_WIDTH) {
				wrappedLines.push(rawLine);
			} else {
				const words = rawLine.split(/\s+/);
				let currentLine = "";

				for (const word of words) {
					if (word.length > MAX_WIDTH) {
						if (currentLine) {
							wrappedLines.push(currentLine.trim());
							currentLine = "";
						}
						for (let i = 0; i < word.length; i += MAX_WIDTH) {
							const chunk = word.slice(i, i + MAX_WIDTH);
							wrappedLines.push(chunk);
						}
					} else {
						const testLine = currentLine ? currentLine + " " + word : word;
						if (testLine.length <= MAX_WIDTH) {
							currentLine = testLine;
						} else {
							if (currentLine) wrappedLines.push(currentLine.trim());
							currentLine = word;
						}
					}
				}
				if (currentLine) wrappedLines.push(currentLine.trim());
			}
		}

		const maxWidth = Math.max(...wrappedLines.map((line) => line.length), 0);
		const boxWidth = Math.max(maxWidth, 0);

		let output = " " + "_".repeat(boxWidth + 2) + "\n";

		if (wrappedLines.length === 1) {
			output += `< ${wrappedLines[0]} >\n`;
		} else {
			for (let i = 0; i < wrappedLines.length; i++) {
				const line = wrappedLines[i];
				const padding = boxWidth - line.length;
				if (i === 0) {
					output += `/ ${line}${" ".repeat(padding)} \\\n`;
				} else if (i === wrappedLines.length - 1) {
					output += `\\ ${line}${" ".repeat(padding)} /\n`;
				} else {
					output += `| ${line}${" ".repeat(padding)} |\n`;
				}
			}
		}

		output += " " + "-".repeat(boxWidth + 2) + "\n";
		output += "        \\   ^__^\n";
		output += "         \\  (oo)\\_______\n";
		output += "            (__)\\       )\\/\\\n";
		output += "                ||----w |\n";
		output += "                ||     ||";

		await this._terminal.writeln(output);
	}
}
