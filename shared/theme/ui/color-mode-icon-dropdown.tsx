import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import { Drawer, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton, { type IconButtonOwnProps } from "@mui/material/IconButton";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LogoTwoLines } from "@shared/logo";
import React from "react";
import { useColorScheme } from "./color-scheme-provider";
import { colorSchemes } from "./color-schemes";

export default function ColorModeIconDropdown(props: IconButtonOwnProps) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const { colorScheme: activeColorScheme, setColorScheme } = useColorScheme();

	return (
		<React.Fragment>
			<IconButton
				data-screenshot="toggle-mode"
				onClick={handleClick}
				disableRipple
				size="small"
				aria-controls={open ? "color-scheme-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				{...props}
			>
				<DarkModeIcon />
			</IconButton>
			<Drawer open={open} anchor="right" onClose={handleClose}>
				{Object.entries(colorSchemes).map(([key, { theme }]) => (
					<ThemeProvider theme={theme} key={key}>
						<Box
							onClick={() => setColorScheme(key)}
							sx={{
								borderRadius: 2,
								padding: 2,
								margin: 2,
								backgroundColor: "background.default",
							}}
						>
							<Typography sx={{ color: "text.primary", mb: 2 }}>
								{key}
							</Typography>
							<LogoTwoLines />
						</Box>
					</ThemeProvider>
				))}
			</Drawer>
		</React.Fragment>
	);
}
