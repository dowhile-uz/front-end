import { type Shadows, alpha, createTheme } from "@mui/material/styles";

declare module "@mui/material/Paper" {
	interface PaperPropsVariantOverrides {
		highlighted: true;
	}
}
declare module "@mui/material/styles/createPalette" {
	interface ColorRange {
		50: string;
		100: string;
		200: string;
		300: string;
		400: string;
		500: string;
		600: string;
		700: string;
		800: string;
		900: string;
	}

	interface PaletteColor extends ColorRange {}

	interface Palette {
		baseShadow: string;
		logo: {
			primary: string;
			secondary: string;
		};
	}
}

const defaultTheme = createTheme();

export const typography = {
	fontFamily: "Inter, sans-serif",
	h1: {
		fontSize: defaultTheme.typography.pxToRem(48),
		fontWeight: 600,
		lineHeight: 1.2,
		letterSpacing: -0.5,
	},
	h2: {
		fontSize: defaultTheme.typography.pxToRem(36),
		fontWeight: 600,
		lineHeight: 1.2,
	},
	h3: {
		fontSize: defaultTheme.typography.pxToRem(30),
		lineHeight: 1.2,
	},
	h4: {
		fontSize: defaultTheme.typography.pxToRem(24),
		fontWeight: 600,
		lineHeight: 1.5,
	},
	h5: {
		fontSize: defaultTheme.typography.pxToRem(20),
		fontWeight: 600,
	},
	h6: {
		fontSize: defaultTheme.typography.pxToRem(18),
		fontWeight: 600,
	},
	subtitle1: {
		fontSize: defaultTheme.typography.pxToRem(18),
	},
	subtitle2: {
		fontSize: defaultTheme.typography.pxToRem(14),
		fontWeight: 500,
	},
	body1: {
		fontSize: defaultTheme.typography.pxToRem(14),
	},
	body2: {
		fontSize: defaultTheme.typography.pxToRem(14),
		fontWeight: 400,
	},
	caption: {
		fontSize: defaultTheme.typography.pxToRem(12),
		fontWeight: 400,
	},
};

export const shape = {
	borderRadius: 8,
};

// @ts-ignore
const defaultShadows: Shadows = [
	"none",
	"var(--template-palette-baseShadow)",
	...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
