#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PRODUCT_NAME = "EmuDevz";

const platform = process.argv[2];

if (!platform) {
	console.error("Usage: node ./scripts/copy-steam-binaries.js <win|linux|mac>");
	process.exit(1);
}

const rootDir = path.resolve(__dirname, "..");
const sdkRoot = path.join(rootDir, "scripts", "sdk_bin");

const targets = {
	win: {
		from: path.join(sdkRoot, "win64"),
		to: path.join(rootDir, "release", "win-unpacked"),
	},
	linux: {
		from: path.join(sdkRoot, "linux64"),
		to: path.join(rootDir, "release", "linux-unpacked"),
	},
	mac: {
		from: path.join(sdkRoot, "osx"),
		to: path.join(
			rootDir,
			"release",
			"mac-arm64",
			`${PRODUCT_NAME}.app`,
			"Contents",
			"MacOS"
		),
	},
};

const target = targets[platform];

if (!target) {
	console.error(
		`Unknown platform '${platform}'. Expected one of: ${Object.keys(
			targets
		).join(", ")}`
	);
	process.exit(1);
}

if (!fs.existsSync(target.from)) {
	console.error(`Steam SDK source directory not found: ${target.from}`);
	process.exit(1);
}

if (!fs.existsSync(target.to)) {
	console.error(
		`Electron output directory not found (have you built already?): ${target.to}`
	);
	process.exit(1);
}

function copyFiles(srcDir, destDir) {
	fs.mkdirSync(destDir, { recursive: true });
	const entries = fs.readdirSync(srcDir, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isFile()) continue;
		const srcFile = path.join(srcDir, entry.name);
		const destFile = path.join(destDir, entry.name);
		fs.copyFileSync(srcFile, destFile);
	}
}

copyFiles(target.from, target.to);

console.log(
	`Copied Steam binaries for '${platform}' from '${target.from}' to '${target.to}'`
);
