// @ts-nocheck

import { createTheme } from "@mui/material";
import { getColors } from "./get-colors";

const colorSchemesRaw = {
	"gruvbox-dark-hard": await import("./gruvbox-dark-hard.json5"),
	monokai: await import("./monokai.json5"),
	"flexoki-light": await import("./flexoki-light.json5"),
	"dark-modern": await import("./dark-modern.json5"),
};

export const colorSchemes = Object.fromEntries(
	Object.entries(colorSchemesRaw).map(([key, value]) => {
		const colorSchemes = getColors(value);
		return [key, { colorSchemes, theme: createTheme({ colorSchemes }) }];
	}),
);

export type ColorScheme = keyof typeof colorSchemesRaw;
