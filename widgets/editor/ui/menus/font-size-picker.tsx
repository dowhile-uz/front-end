import { Button, ListItemText, Menu, MenuItem } from "@mui/material";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useCallback } from "react";
import React from "react";
import { DropdownButton, DropdownCategoryTitle } from "../extra/dropdown";
import { Icon } from "../extra/icon";
import { Surface } from "../extra/surface";
import { Toolbar } from "../extra/toolbar";

const FONT_SIZES = [
	{ label: "Smaller", value: "12px" },
	{ label: "Small", value: "14px" },
	{ label: "Medium", value: "" },
	{ label: "Large", value: "18px" },
	{ label: "Extra Large", value: "24px" },
];

export type FontSizePickerProps = {
	onChange: (value: string) => void; // eslint-disable-line no-unused-vars
	value: string;
};

export const FontSizePicker = ({ onChange, value }: FontSizePickerProps) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const currentValue = FONT_SIZES.find((size) => size.value === value);
	const currentSizeLabel = currentValue?.label.split(" ")[0] || "Medium";

	const selectSize = useCallback(
		(size: string) => () => onChange(size),
		[onChange],
	);

	return (
		<>
			<Button
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			// active={!!currentValue?.value}
			>
				{currentSizeLabel}
			</Button>
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
				{FONT_SIZES.map((size) => (
					<MenuItem
						key={size.value}
						onClick={selectSize(size.value)}
						selected={value == size.value}
					>
						<ListItemText>
							<span style={{ fontSize: size.value }}>{size.label}</span>
						</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	)

	return (
		<Dropdown.Root>
			<Dropdown.Trigger asChild>
				<Toolbar.Button active={!!currentValue?.value}>
					{currentSizeLabel}
					<Icon name="ChevronDown" className="w-2 h-2" />
				</Toolbar.Button>
			</Dropdown.Trigger>
			<Dropdown.Content asChild>
				<Surface className="flex flex-col gap-1 px-2 py-4">
				</Surface>
			</Dropdown.Content>
		</Dropdown.Root>
	);
};
