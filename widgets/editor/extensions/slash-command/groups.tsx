import {
	CodeBlocksOutlined,
	FormatH1Outlined,
	FormatH2Outlined,
	FormatH3Outlined,
	FormatListBulletedAddOutlined,
	FormatListBulletedOutlined,
	FormatListNumberedOutlined,
	FormatQuoteOutlined,
	ImageOutlined,
	RemoveOutlined,
	TableOutlined,
	TocOutlined,
	ViewColumn2Outlined,
} from "@mui-symbols-material/w400";
import type { Group } from "./types";

export const GROUPS: Group[] = [
	{
		name: "format",
		title: "Format",
		commands: [
			{
				name: "heading1",
				label: "Heading 1",
				icon: <FormatH1Outlined />,
				description: "High priority section title",
				aliases: ["h1"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 1 }).run();
				},
			},
			{
				name: "heading2",
				label: "Heading 2",
				icon: <FormatH2Outlined />,
				description: "Medium priority section title",
				aliases: ["h2"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 2 }).run();
				},
			},
			{
				name: "heading3",
				label: "Heading 3",
				icon: <FormatH3Outlined />,
				description: "Low priority section title",
				aliases: ["h3"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 3 }).run();
				},
			},
			{
				name: "bulletList",
				label: "Bullet List",
				icon: <FormatListBulletedOutlined />,
				description: "Unordered list of items",
				aliases: ["ul"],
				action: (editor) => {
					editor.chain().focus().toggleBulletList().run();
				},
			},
			{
				name: "numberedList",
				label: "Numbered List",
				icon: <FormatListNumberedOutlined />,
				description: "Ordered list of items",
				aliases: ["ol"],
				action: (editor) => {
					editor.chain().focus().toggleOrderedList().run();
				},
			},
			{
				name: "taskList",
				label: "Task List",
				icon: <FormatListBulletedAddOutlined />,
				description: "Task list with todo items",
				aliases: ["todo"],
				action: (editor) => {
					editor.chain().focus().toggleTaskList().run();
				},
			},
			// {
			//   name: 'toggleList',
			//   label: 'Toggle List',
			//   iconName: 'ListCollapse',
			//   description: 'Toggles can show and hide content',
			//   aliases: ['toggle'],
			//   action: editor => {
			//     editor.chain().focus().setDetails().run()
			//   },
			// },
			{
				name: "blockquote",
				label: "Blockquote",
				icon: <FormatQuoteOutlined />,
				description: "Element for quoting",
				action: (editor) => {
					editor.chain().focus().setBlockquote().run();
				},
			},
			{
				name: "codeBlock",
				label: "Code Block",
				icon: <CodeBlocksOutlined />,
				description: "Code block with syntax highlighting",
				shouldBeHidden: (editor) => editor.isActive("columns"),
				action: (editor) => {
					editor.chain().focus().setCodeBlock().run();
				},
			},
		],
	},
	{
		name: "insert",
		title: "Insert",
		commands: [
			{
				name: "table",
				label: "Table",
				icon: <TableOutlined />,
				description: "Insert a table",
				shouldBeHidden: (editor) => editor.isActive("columns"),
				action: (editor) => {
					editor
						.chain()
						.focus()
						.insertTable({ rows: 3, cols: 3, withHeaderRow: false })
						.run();
				},
			},
			{
				name: "image",
				label: "Image",
				icon: <ImageOutlined />,
				description: "Insert an image",
				aliases: ["img"],
				action: (editor) => {
					editor.chain().focus().setImageUpload().run();
				},
			},
			{
				name: "columns",
				label: "Columns",
				icon: <ViewColumn2Outlined />,
				description: "Add two column content",
				aliases: ["cols"],
				shouldBeHidden: (editor) => editor.isActive("columns"),
				action: (editor) => {
					editor
						.chain()
						.focus()
						.setColumns()
						.focus(editor.state.selection.head - 1)
						.run();
				},
			},
			{
				name: "horizontalRule",
				label: "Horizontal Rule",
				icon: <RemoveOutlined />,
				description: "Insert a horizontal divider",
				aliases: ["hr"],
				action: (editor) => {
					editor.chain().focus().setHorizontalRule().run();
				},
			},
			{
				name: "toc",
				label: "Table of Contents",
				icon: <TocOutlined />,
				aliases: ["outline"],
				description: "Insert a table of contents",
				shouldBeHidden: (editor) => editor.isActive("columns"),
				action: (editor) => {
					editor.chain().focus().insertTableOfContents().run();
				},
			},
		],
	},
];

export default GROUPS;
