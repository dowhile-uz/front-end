import { Button, ListItemText, Menu, MenuItem } from "@mui/material";
import { Popover } from "@shared/popover";
import React from "react";

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
	const currentValue = FONT_SIZES.find((size) => size.value === value);
	const currentSizeLabel = currentValue?.label.split(" ")[0] || "Medium";

	const selectSize = React.useCallback(
		(size: string) => () => onChange(size),
		[onChange],
	);

	return (
		<Popover
			trigger={({ open, handleClick }) => <Button
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			// active={!!currentValue?.value}
			>
				{currentSizeLabel}
			</Button>}
			popover={({ anchorEl, open, handleClose }) => <Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
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
			</Menu>}
		/>
	)
};
