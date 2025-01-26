import { LinkOutlined } from "@mui-symbols-material/w400";
import { Popover as MuiPopover } from "@mui/material";
import { Popover } from "@shared/popover";
import { ToolbarButton } from "@shared/toolbar-button";
import { LinkEditorPanel } from "../panels/link-editor-panel";

export type EditLinkPopoverProps = {
	onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
	return (
		<Popover
			trigger={({ open, handleClick }) => (
				<ToolbarButton
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
					onClick={handleClick}
					// active={activeItem?.id !== "paragraph" && !!activeItem?.type}
				>
					<LinkOutlined />
				</ToolbarButton>
			)}
			popover={({ anchorEl, open, handleClose }) => (
				<MuiPopover
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					sx={{
						zIndex: 10000,
					}}
				>
					<LinkEditorPanel onSetLink={onSetLink} />
				</MuiPopover>
			)}
		/>
	);
};
