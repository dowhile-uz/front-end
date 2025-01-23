import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../assets/style.css";

import { Box, CssBaseline, Stack, alpha } from "@mui/material";
import { Link } from "@shared/link";
import { AppTheme } from "@shared/theme";
import AppNavbar from "./app-navbar";
import Header from "./header";
import SideMenu from "./side-menu";

export default function LayoutDefault({
	children,
}: { children: React.ReactNode }) {
	return (
		<AppTheme>
			<CssBaseline enableColorScheme />
			<Box sx={{ display: "flex" }}>
				<SideMenu />
				<AppNavbar />
				{/* Main content */}
				<Box
					component="main"
					sx={(theme) => ({
						flexGrow: 1,
						backgroundColor: theme.vars
							? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
							: alpha(theme.palette.background.default, 1),
						overflow: "auto",
					})}
				>
					<Stack
						spacing={2}
						sx={{
							alignItems: "center",
							mx: 3,
							pb: 5,
							mt: { xs: 8, md: 0 },
						}}
					>
						<Header />
						{children}
					</Stack>
				</Box>
			</Box>
			{/* <Sidebar> */}
			{/* 	<Link href="/"> Welcome </Link> */}
			{/* 	<Link href="/todo"> Todo </Link> */}
			{/* 	<Link href="/star-wars"> Data Fetching </Link> */}
			{/* </Sidebar> */}
		</AppTheme>
	);
}
