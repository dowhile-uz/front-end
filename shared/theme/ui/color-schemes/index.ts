// @ts-nocheck

import { createTheme } from "@mui/material";
import { getColors } from "./get-colors";

export const colorSchemes = Object.fromEntries(
	Object.entries({
		"gruvbox-dark-hard": await import("./gruvbox-dark-hard.json5"),
		monokai: await import("./monokai.json5"),
		"flexoki-light": await import("./flexoki-light.json5"),
		"dark-modern": await import("./dark-modern.json5"),
	}).map(([key, value]) => {
		const colorSchemes = getColors(value);
		return [key, { colorSchemes, theme: createTheme({ colorSchemes }) }];
	}),
);

export type ColorSchemes = keyof typeof colorSchemes;
