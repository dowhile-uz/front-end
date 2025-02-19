import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import React from "react";
import { ColorSchemeProvider } from "./color-scheme-provider";
import { type ColorScheme, colorSchemes } from "./color-schemes";
import { dataDisplayCustomizations } from "./customizations/data-display";
import { feedbackCustomizations } from "./customizations/feedback";
import { inputsCustomizations } from "./customizations/inputs";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { shadows, shape, typography } from "./theme-primitives";

interface AppThemeProps {
	children: React.ReactNode;
	themeComponents?: ThemeOptions["components"];
}

const initialColorScheme = (() => {
	const colorScheme = localStorage.getItem("color-scheme");
	if (Object.keys(colorSchemes).includes(colorScheme ?? "")) {
		return colorScheme as ColorScheme;
	}

	return "gruvbox-dark-hard";
})();

export default function AppTheme(props: AppThemeProps) {
	const { children, themeComponents } = props;
	const [colorScheme, setColorScheme] =
		React.useState<ColorScheme>(initialColorScheme);

	const updateColorScheme = (colorScheme: ColorScheme) => {
		localStorage.setItem("color-scheme", colorScheme);
		setColorScheme(colorScheme);
	};

	const theme = React.useMemo(
		() =>
			createTheme({
				// For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
				cssVariables: {
					colorSchemeSelector: "data-mui-color-scheme",
					cssVarPrefix: "template",
				},
				colorSchemes: colorSchemes[colorScheme]?.colorSchemes,
				typography,
				shadows,
				shape,
				components: {
					...inputsCustomizations,
					...dataDisplayCustomizations,
					...feedbackCustomizations,
					...navigationCustomizations,
					...surfacesCustomizations,
					...themeComponents,
				},
			}),
		[themeComponents, colorScheme],
	);

	return (
		<ColorSchemeProvider
			value={{ value: colorScheme, setValue: updateColorScheme }}
		>
			<ThemeProvider theme={theme} disableTransitionOnChange>
				{children}
			</ThemeProvider>
		</ColorSchemeProvider>
	);
}
