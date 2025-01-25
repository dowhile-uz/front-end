import { Button, ListItemText, Menu, MenuItem } from "@mui/material";
import { Popover } from "@shared/popover";
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
	const currentValue = FONT_FAMILIES.find((size) => size.value === value);
	const currentFontLabel = currentValue?.label.split(" ")[0] || "Inter";

	const selectFont = React.useCallback(
		(font: string) => () => onChange(font),
		[onChange],
	);

	return <Popover
		trigger={
			({ open, handleClick }) =>
				<Button
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleClick}
				// active={!!currentValue?.value}
				>
					{currentFontLabel}
				</Button>
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
					{FONT_FAMILY_GROUPS.map((group) => (
						<>
							<MenuItem
								disabled={true}
								key={`group-${group.label}`}
							>
								<ListItemText>
									{group.label}
								</ListItemText>
							</MenuItem>
							{
								group.options.map((font) => (
									<MenuItem
										key={`option-${font.value}`}
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
		}
	/>
};
