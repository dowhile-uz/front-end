import { FormatParagraphOutlined } from "@mui-symbols-material/w400";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React from "react";
import { ToolbarButton } from './toolbar-button'

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
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const activeItem = React.useMemo(
		() =>
			options.find((option) => option.type === "option" && option.isActive()),
		[options],
	);

	return (
		<>
			<ToolbarButton
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			// active={activeItem?.id !== "paragraph" && !!activeItem?.type}
			>
				{(activeItem?.type === "option" && activeItem.icon) || <FormatParagraphOutlined />}
				{/* <Icon name="ChevronDown" className="w-2 h-2" /> */}
			</ToolbarButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				sx={{ zIndex: 10000 }}
			>
				{options.map((option) => {
					if (isOption(option)) {
						return (
							<MenuItem
								key={option.id}
								onClick={() => {
									option.onClick()
									handleClose()
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
		</>
	)
};
