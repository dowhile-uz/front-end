import { Box, IconButton } from "@mui/material";
import React from "react";

export type ColorButtonProps = {
	color?: string;
	active?: boolean;
	onColorChange?: (color: string) => void; // eslint-disable-line no-unused-vars
};

export const ColorButton = React.memo(
	({ color, onColorChange }: ColorButtonProps) => {
		const handleClick = React.useCallback(() => {
			if (onColorChange) {
				onColorChange(color || "");
			}
		}, [onColorChange, color]);

		return (
			<IconButton
				size="small"
				onClick={handleClick}
				sx={{ p: 1 }}
			>
				<Box
					sx={{ backgroundColor: color, color: color, height: "100%", width: "100%", borderRadius: 1 }}
				/>
			</IconButton>
		);
	},
);

ColorButton.displayName = "ColorButton";
