import { UndoOutlined } from "@mui-symbols-material/w400";
import { Box, Card, IconButton, Paper, TextField, Tooltip } from "@mui/material";
import { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { themeColors } from "../../utils/constants";
import { ColorButton } from "./color-button";

export type ColorPickerProps = {
	color?: string;
	onChange?: (color: string) => void;
	onClear?: () => void;
};

export const ColorPicker = ({ color, onChange, onClear }: ColorPickerProps) => {
	const [colorInputValue, setColorInputValue] = useState(color || "");

	const handleColorUpdate = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setColorInputValue(event.target.value);
		},
		[],
	);

	const handleColorChange = useCallback(() => {
		const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(colorInputValue);

		if (!isCorrectColor) {
			if (onChange) {
				onChange("");
			}

			return;
		}

		if (onChange) {
			onChange(colorInputValue);
		}
	}, [colorInputValue, onChange]);

	return (
		<Paper variant="outlined" sx={{ padding: 2 }}>
			<HexColorPicker
				style={{ width: "100%" }}
				color={color || ""}
				onChange={onChange}
			/>
			<TextField
				sx={{ my: 2, width: "100%" }}
				placeholder="#000000"
				value={colorInputValue}
				onChange={handleColorUpdate}
				onBlur={handleColorChange}
			/>
			<Box sx={{ display: "flex", gap: 1 }}>
				{themeColors.map((currentColor) => (
					<ColorButton
						active={currentColor === color}
						color={currentColor}
						key={currentColor}
						onColorChange={onChange}
					/>
				))}
				<Tooltip title="Reset color to default">
					<IconButton onClick={onClear} size="small">
						<UndoOutlined />
					</IconButton>
				</Tooltip>
			</Box>
		</Paper>
	);
};
