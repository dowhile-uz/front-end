// import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import type { Editor } from "@tiptap/react";
import { Icon } from "../extra/icon";
import { Toolbar } from "../extra/toolbar";

import { AddOutlined, ContentCopyOutlined, ContentPasteOutlined, DeleteOutlined, DragIndicatorOutlined, FormatClearOutlined } from "@mui-symbols-material/w400";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, Paper } from "@mui/material";
import { Popover } from "@shared/popover";
import { ToolbarButton } from "@shared/toolbar-button";
import { useEffect, useState } from "react";
import useContentItemActions from "../../hooks/use-content-item-actions";
import { useData } from "../../hooks/use-data";
import { DropdownButton } from "../extra/dropdown";
import { Surface } from "../extra/surface";

export type ContentItemMenuProps = {
	editor: Editor;
};

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const data = useData();
	const actions = useContentItemActions(
		editor,
		data.currentNode,
		data.currentNodePos,
	);

	useEffect(() => {
		if (menuOpen) {
			editor.commands.setMeta("lockDragHandle", true);
		} else {
			editor.commands.setMeta("lockDragHandle", false);
		}
	}, [editor, menuOpen]);

	// <DragHandle
	//   pluginKey="ContentItemMenu"
	//   editor={editor}
	//   onNodeChange={data.handleNodeChange}
	//   tippyOptions={{
	//     offset: [-2, 16],
	//     zIndex: 99,
	//   }}
	// >
	return (
		<Paper>
			<ToolbarButton onClick={actions.handleAdd}>
				<AddOutlined />
			</ToolbarButton>
			<Popover
				trigger={
					({ handleClick }) => <ToolbarButton onClick={(e) => {
						handleClick(e)
						setMenuOpen(true)
					}}>
						<DragIndicatorOutlined />
					</ToolbarButton>
				}
				popover={
					({ anchorEl, open, handleClose }) => <Menu
						anchorEl={anchorEl}
						open={open}
						onClose={() => {
							handleClose(null)
							setMenuOpen(false)
						}}
					>
						<MenuItem onClick={actions.resetTextFormatting}>
							<ListItemIcon>
								<FormatClearOutlined />
							</ListItemIcon>
							<ListItemText>
								Clear formatting
							</ListItemText>
						</MenuItem>
						<MenuItem onClick={actions.copyNodeToClipboard}>
							<ListItemIcon>
								<ContentPasteOutlined />
							</ListItemIcon>
							<ListItemText>
								Copy to clipboard
							</ListItemText>
						</MenuItem>
						<MenuItem onClick={actions.duplicateNode}>
							<ListItemIcon>
								<ContentCopyOutlined />
							</ListItemIcon>
							<ListItemText>
								Duplicate
							</ListItemText>
						</MenuItem>
						<Divider />
						<MenuItem onClick={actions.deleteNode}>
							<ListItemIcon>
								<DeleteOutlined />
							</ListItemIcon>
							<ListItemText>
								Delete
							</ListItemText>
						</MenuItem>
					</Menu>
				}
			/>
		</Paper>
		// </DragHandle >
	);
};
