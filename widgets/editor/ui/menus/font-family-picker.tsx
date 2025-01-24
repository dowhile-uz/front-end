import { Button, ListItemText, Menu, MenuItem } from "@mui/material";
import { useCallback } from "react";
import React from "react";

const FONT_FAMILY_GROUPS = [
	{
		label: "Sans Serif",
		options: [
			{ label: "Inter", value: "" },
			{ label: "Arial", value: "Arial" },
			{ label: "Helvetica", value: "Helvetica" },
		],
	},
	{
		label: "Serif",
		options: [
			{ label: "Times New Roman", value: "Times" },
			{ label: "Garamond", value: "Garamond" },
			{ label: "Georgia", value: "Georgia" },
		],
	},
	{
		label: "Monospace",
		options: [
			{ label: "Courier", value: "Courier" },
			{ label: "Courier New", value: "Courier New" },
		],
	},
];

const FONT_FAMILIES = FONT_FAMILY_GROUPS.flatMap((group) => [
	group.options,
]).flat();

export type FontFamilyPickerProps = {
	onChange: (value: string) => void; // eslint-disable-line no-unused-vars
	value: string;
};

export const FontFamilyPicker = ({
	onChange,
	value,
}: FontFamilyPickerProps) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const currentValue = FONT_FAMILIES.find((size) => size.value === value);
	const currentFontLabel = currentValue?.label.split(" ")[0] || "Inter";

	const selectFont = useCallback(
		(font: string) => () => onChange(font),
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
				{currentFontLabel}
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
				{FONT_FAMILY_GROUPS.map((group) => (
					<>
						<MenuItem
							disabled={true}
						>
							<ListItemText>
								{group.label}
							</ListItemText>
						</MenuItem>
						{
							group.options.map((font) => (
								<MenuItem
									key={font.value}
									onClick={
										selectFont(font.value)
									}
									selected={value == font.value}
								>
									<ListItemText>
										<span style={{ fontFamily: font.value }}>{font.label}</span>
									</ListItemText>
								</MenuItem>
							))
						}
					</>
				))}
			</Menu>
		</>
	)
};
