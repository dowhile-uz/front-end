import type { Editor } from "@tiptap/react";

import {
	AddOutlined,
	ContentCopyOutlined,
	ContentPasteOutlined,
	DeleteOutlined,
	DragIndicatorOutlined,
	FormatClearOutlined,
} from "@mui-symbols-material/w400";
import {
	Divider,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Paper,
} from "@mui/material";
import { Popover } from "@shared/popover";
import { ToolbarButton } from "@shared/toolbar-button";
import { PluginKey } from "@tiptap/pm/state";
import React from "react";
import { DragHandleComponent } from "../../extensions/drag-handle";
import useContentItemActions from "../../hooks/use-content-item-actions";
import { useData } from "../../hooks/use-data";

export type ContentItemMenuProps = {
	editor: Editor;
};

const pluginKey = new PluginKey("ContentItemMenu");

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const data = useData();
	const actions = useContentItemActions(
		editor,
		data.currentNode,
		data.currentNodePos,
	);

	React.useEffect(() => {
		if (menuOpen) {
			editor.commands.setMeta("lockDragHandle", true);
		} else {
			editor.commands.setMeta("lockDragHandle", false);
		}
	}, [editor, menuOpen]);

	return (
		<DragHandleComponent
			pluginKey={pluginKey}
			editor={editor}
			onNodeChange={data.handleNodeChange}
			tippyOptions={{
				offset: [-2, 16],
				zIndex: 99,
			}}
		>
			<Paper
				variant="outlined"
				sx={{ display: "flex", transform: "translateY(-5px)" }}
			>
				<ToolbarButton size="small" onClick={actions.handleAdd}>
					<AddOutlined />
				</ToolbarButton>
				<Popover
					trigger={({ handleClick }) => (
						<ToolbarButton
							size="small"
							onClick={(e) => {
								handleClick(e);
								setMenuOpen(true);
							}}
						>
							<DragIndicatorOutlined />
						</ToolbarButton>
					)}
					popover={({ anchorEl, open, handleClose }) => (
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={() => {
								handleClose(null);
								setMenuOpen(false);
							}}
						>
							<MenuItem
								onClick={() => {
									actions.resetTextFormatting();
									handleClose(null);
								}}
							>
								<ListItemIcon>
									<FormatClearOutlined />
								</ListItemIcon>
								<ListItemText>Clear formatting</ListItemText>
							</MenuItem>
							<MenuItem
								onClick={() => {
									actions.copyNodeToClipboard();
									handleClose(null);
								}}
							>
								<ListItemIcon>
									<ContentPasteOutlined />
								</ListItemIcon>
								<ListItemText>Copy to clipboard</ListItemText>
							</MenuItem>
							<MenuItem
								onClick={() => {
									actions.duplicateNode();
									handleClose(null);
								}}
							>
								<ListItemIcon>
									<ContentCopyOutlined />
								</ListItemIcon>
								<ListItemText>Duplicate</ListItemText>
							</MenuItem>
							<Divider />
							<MenuItem
								onClick={() => {
									actions.deleteNode();
									handleClose(null);
								}}
							>
								<ListItemIcon>
									<DeleteOutlined />
								</ListItemIcon>
								<ListItemText>Delete</ListItemText>
							</MenuItem>
						</Menu>
					)}
				/>
			</Paper>
		</DragHandleComponent>
	);
};
