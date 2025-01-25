import { FormatParagraphOutlined } from "@mui-symbols-material/w400";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Popover } from "@shared/popover";
import { ToolbarButton } from "@shared/toolbar-button";
import React from "react";

export type ContentTypePickerOption = {
	label: string;
	id: string;
	type: "option";
	disabled: () => boolean;
	isActive: () => boolean;
	onClick: () => void;
	icon: React.ReactNode;
};

export type ContentTypePickerCategory = {
	label: string;
	id: string;
	type: "category";
};

export type ContentPickerOptions = Array<
	ContentTypePickerOption | ContentTypePickerCategory
>;

export type ContentTypePickerProps = {
	options: ContentPickerOptions;
};

const isOption = (
	option: ContentTypePickerOption | ContentTypePickerCategory,
): option is ContentTypePickerOption => option.type === "option";
const isCategory = (
	option: ContentTypePickerOption | ContentTypePickerCategory,
): option is ContentTypePickerCategory => option.type === "category";

export const ContentTypePicker = ({ options }: ContentTypePickerProps) => {
	const activeItem = React.useMemo(
		() =>
			options.find((option) => option.type === "option" && option.isActive()),
		[options],
	);

	return <Popover
		trigger={
			({ open, handleClick }) =>
				<ToolbarButton
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
				// active={activeItem?.id !== "paragraph" && !!activeItem?.type}
				>
					{(activeItem?.type === "option" && activeItem.icon) || <FormatParagraphOutlined />}
					{/* <Icon name="ChevronDown" className="w-2 h-2" /> */}
				</ToolbarButton>
		}
		popover={
			({ anchorEl, open, handleClose }) =>
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					sx={{ zIndex: 10000 }}
				>
					{options.map((option) => {
						if (isOption(option)) {
							return (
								<MenuItem
									key={option.id}
									onClick={(e) => {
										option.onClick()
										handleClose(e)
									}}
									selected={option.isActive()}
								>
									<ListItemIcon>
										{option.icon}
									</ListItemIcon>

									<ListItemText>
										{option.label}
									</ListItemText>
								</MenuItem>
							);
						}
						if (isCategory(option)) {
							return (
								<MenuItem
									key={option.id}
									disabled={true}
								>
									<ListItemText>
										{option.label}
									</ListItemText>
								</MenuItem>
							);
						}
					})}
				</Menu>
		}
	/>
};
