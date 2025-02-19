import React from "react";
import type { ColorScheme } from "./color-schemes";

const context = React.createContext<{
	value: ColorScheme;
	setValue(colorScheme: ColorScheme): void;
}>({ value: "gruvbox-dark-hard", setValue: () => {} });

export const ColorSchemeProvider = context.Provider;

export const useColorScheme = () => {
	const v = React.useContext(context);
	if (v == null) {
		throw "ColorSchemeProvider is not provided";
	}

	return {
		colorScheme: v.value,
		setColorScheme: v.setValue,
	};
};
