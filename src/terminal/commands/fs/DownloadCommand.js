import JSZip from "jszip";
import $path from "path-browserify-esm";
import filesystem from "../../../filesystem";
import { filepicker } from "../../../utils";
import FilesystemCommand from "./FilesystemCommand";

const FILE_NAME = "download.zip";
const read = (path) => filesystem.read(path, { any: true });

export default class DownloadCommand extends FilesystemCommand {
	static get name() {
		return "download";
	}

	async _execute() {
		const targets = this._fileArgs.map((arg) => {
			const path = this._resolve(arg, false, false);
			const stat = filesystem.stat(path);
			return { path, stat };
		});
		if (targets.length === 0) return;

		const isSingleFile = targets.length === 1;
		const isSingleDirectory = isSingleFile && targets[0].stat.isDirectory;
		const shouldZip = !isSingleFile || isSingleDirectory;

		if (!shouldZip) {
			const { path } = targets[0];
			const content = read(path);
			const fileName = $path.parse(path).base;
			filepicker.saveAs(content, fileName);
			return;
		}

		const zip = new JSZip();

		const entryPaths = [];
		for (let target of targets) {
			if (target.stat.isDirectory) {
				const files = filesystem.lsr(target.path);
				for (let it of files) entryPaths.push(it.filePath);
			} else {
				entryPaths.push(target.path);
			}
		}

		let baseDir = this._shell.workingDirectory;
		const hasOutside = (baseDirectory) =>
			entryPaths.some((it) =>
				$path.relative(baseDirectory, it).startsWith("..")
			);
		while (baseDir !== "/" && hasOutside(baseDir))
			baseDir = $path.dirname(baseDir);

		this._addEntries(zip, entryPaths, baseDir);

		const zipped = await zip.generateAsync({ type: "uint8array" });
		const zipName = isSingleDirectory
			? `${$path.parse(targets[0].path).base}.zip`
			: FILE_NAME;
		filepicker.saveAs(zipped, zipName);
	}

	_addEntries(zip, paths, baseDir) {
		for (let path of paths) {
			const zipPath = $path.relative(baseDir, path);
			const content = read(path);
			zip.file(
				zipPath,
				typeof content === "string" ? content : new Uint8Array(content)
			);
		}
	}
}
