import type { Editor } from "@tiptap/core";

export interface Group {
	name: string;
	title: string;
	commands: Command[];
}

export interface Command {
	name: string;
	label: string;
	description: string;
	aliases?: string[];
	icon: React.ReactNode;
	action: (editor: Editor) => void;
	shouldBeHidden?: (editor: Editor) => boolean;
}

export interface MenuListProps {
	editor: Editor;
	items: Group[];
	command: (command: Command) => void;
}
