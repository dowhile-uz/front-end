import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import React from "react";
import { dataDisplayCustomizations } from "./customizations/data-display";
import { feedbackCustomizations } from "./customizations/feedback";
import { inputsCustomizations } from "./customizations/inputs";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, shadows, shape, typography } from "./theme-primitives";

interface AppThemeProps {
	children: React.ReactNode;
	themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
	const { children, themeComponents } = props;
	const theme = React.useMemo(
		() =>
			createTheme({
				// For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
				cssVariables: {
					colorSchemeSelector: "data-mui-color-scheme",
					cssVarPrefix: "template",
				},
				colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
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
		[themeComponents],
	);

	return (
		<ThemeProvider theme={theme} disableTransitionOnChange>
			{children}
		</ThemeProvider>
	);
}
