import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import React from "react";
import { ColorSchemeProvider } from "./color-scheme-provider";
import { type ColorSchemes, colorSchemes } from "./color-schemes";
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

export default function AppTheme(props: AppThemeProps) {
	const { children, themeComponents } = props;
	const [colorScheme, setColorScheme] =
		React.useState<ColorSchemes>("gruvbox-dark-hard");

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
			value={{ value: colorScheme, setValue: setColorScheme }}
		>
			<ThemeProvider theme={theme} disableTransitionOnChange>
				{children}
			</ThemeProvider>
		</ColorSchemeProvider>
	);
}
