import ChatCommand from "./ChatCommand";
import ClearCommand from "./ClearCommand";
import CowsayCommand from "./CowsayCommand";
import HelpCommand from "./HelpCommand";
import ReplCommand from "./ReplCommand";
import RootCommand from "./RootCommand";
import fsCommands from "./fs";
import TestCommand from "./test/TestCommand";

export default [
	ChatCommand,
	ClearCommand,
	HelpCommand,
	ReplCommand,
	TestCommand,
	...fsCommands,
	RootCommand,
	CowsayCommand,
];
