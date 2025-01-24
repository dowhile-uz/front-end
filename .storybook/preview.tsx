import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/material-icons";
import type { Decorator, Preview } from "@storybook/react";

import { AppTheme } from "../shared/theme";

import { CssBaseline } from "@mui/material";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";

export const decorators: Decorator[] = [
	withThemeFromJSXProvider({
		GlobalStyles: CssBaseline,
		Provider: AppTheme,
		themes: {
			light: {},
			dark: {},
		},

		defaultTheme: "light",
	}),
];

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export const globalTypes = {
	theme: {
		name: "Theme",
		title: "Theme",
		description: "Theme for your components",
		defaultValue: "light",
		toolbar: {
			icon: "paintbrush",
			dynamicTitle: true,
			items: [
				{ value: "light", left: "☀️", title: "Light mode" },
				{ value: "dark", left: "🌙", title: "Dark mode" },
			],
		},
	},
};

export default preview;
