import type { CssVarsThemeOptions } from "@mui/material";

type Theme = { [key: string]: Theme | string } | undefined | string;

class ColorScheme {
	constructor(private scheme: Theme) {}

	find(...paths: string[]): string | undefined {
		return paths
			.map((path) => {
				const paths = [];

				const match = path.matchAll(/(([a-zA-Z0-9]+)|"([a-zA-Z0-9.]+)")/g);

				for (let m = match.next(); !m.done; m = match.next()) {
					paths.push(m.value[2] ?? (m.value[3] as string));
				}

				return paths;
			})
			.map((paths) =>
				paths.reduce(
					(obj, path) => (typeof obj === "object" ? obj[path] : undefined),
					this.scheme,
				),
			)
			.filter((str) => typeof str === "string")
			.reduce<string | undefined>((acc, color) => acc ?? color, undefined);
	}
}

export const getColors = (
	colorScheme: object,
): CssVarsThemeOptions["colorSchemes"] => {
	const c = new ColorScheme(colorScheme as Theme);

	return {
		light: {
			palette: {
				// primary: {
				// light: brand[200],
				// main: brand[400],
				// main: c.find('colors."input.foreground"'),
				// dark: brand[700],
				// contrastText: brand[50],
				// },
				// info: {
				//   light: brand[100],
				//   main: brand[300],
				//   dark: brand[600],
				//   contrastText: gray[50],
				// },
				// warning: {
				//   light: orange[300],
				//   main: orange[400],
				//   dark: orange[800],
				// },
				// error: {
				//   light: red[300],
				//   main: red[400],
				//   dark: red[800],
				// },
				// success: {
				//   light: green[300],
				//   main: green[400],
				//   dark: green[800],
				// },
				// grey: {
				//   ...gray,
				// },
				// divider: alpha(gray[300], 0.4),
				logo: {
					primary: c.find(
						'colors."errorForeground"',
						'colors."terminal.ansiRed"',
					),
					secondary: c.find('colors."editor.foreground"'),
				},
				background: {
					default: c.find('colors."sideBar.background"'),
					paper: c.find('colors."sideBar.background"'),
				},
				text: {
					primary: c.find('colors."editor.foreground"'),
					secondary: c.find('colors."input.foreground"'),
					//   warning: orange[400],
				},
				// action: {
				//   hover: alpha(gray[200], 0.2),
				//   selected: `${alpha(gray[200], 0.3)}`,
				// },
				// baseShadow:
				//   "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
			},
		},
	} as CssVarsThemeOptions["colorSchemes"];
};
