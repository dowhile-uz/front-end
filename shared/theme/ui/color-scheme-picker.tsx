import { CloseOutlined, StyleOutlined } from "@mui-symbols-material/w400";
import { Drawer, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton, { type IconButtonOwnProps } from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import { LogoTwoLines } from "@shared/logo";
import React from "react";
import { useColorScheme } from "./color-scheme-provider";
import { type ColorScheme, colorSchemes } from "./color-schemes";

export default function ColorSchemePicker(props: IconButtonOwnProps) {
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
				<StyleOutlined />
			</IconButton>
			<Drawer open={open} anchor="right" onClose={handleClose}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					p={2}
					gap={2}
				>
					<Typography variant="h5">Ko‘rinishni o‘zgartirish</Typography>
					<IconButton onClick={handleClose}>
						<CloseOutlined />
					</IconButton>
				</Stack>
				{Object.entries(colorSchemes).map(([key, { theme }]) => (
					<ThemeProvider theme={theme} key={key}>
						<Box
							onClick={() => setColorScheme(key as ColorScheme)}
							sx={{
								borderRadius: 2,
								padding: 2,
								margin: 2,
								backgroundColor: "background.default",
								borderWidth: 2,
								borderStyle: "solid",
								borderColor: key === activeColorScheme ? "#00aa00" : undefined,
								cursor: "pointer",
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
