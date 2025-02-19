import { useUser } from "@entities/user";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { LogoOneLine } from "@shared/logo";
import { MenuContent } from "./menu-content";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
	width: drawerWidth,
	flexShrink: 0,
	boxSizing: "border-box",
	mt: 10,
	[`& .${drawerClasses.paper}`]: {
		width: drawerWidth,
		boxSizing: "border-box",
	},
});

export default function SideMenu() {
	const user = useUser();

	return (
		<Drawer
			variant="permanent"
			sx={{
				display: { xs: "none", md: "block" },
				[`& .${drawerClasses.paper}`]: {
					backgroundColor: "background.paper",
				},
			}}
		>
			<Box
				sx={{
					display: "flex",
					mt: "calc(var(--template-frame-height, 0px) + 4px)",
					p: 3,
				}}
			>
				<LogoOneLine sx={{ height: "32px" }} component="a" href="/" />
			</Box>
			<Divider />
			<Box
				sx={{
					overflow: "auto",
					height: "100%",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<MenuContent />
			</Box>
			<Stack
				direction="row"
				sx={{
					p: 2,
					gap: 1,
					alignItems: "center",
					borderTop: "1px solid",
					borderColor: "divider",
				}}
			>
				{!user.isLoading && user.isError && (
					<Button
						component="a"
						href="/api/v1/github-auth/redirect"
						tabIndex={-1}
						startIcon={<FaGithub />}
						sx={{
							width: "100%",
						}}
					>
						GitHub orqali kirish
					</Button>
				)}

				{!user.isLoading && user.data && (
					<>
						<Avatar
							sizes="small"
							alt={user.data.name}
							src={user.data.avatar_url}
							sx={{ width: 36, height: 36 }}
						/>
						<Box sx={{ mr: "auto" }}>
							<Typography
								variant="body2"
								sx={{ fontWeight: 500, lineHeight: "16px" }}
							>
								{user.data.name}
							</Typography>
							<Typography variant="caption" sx={{ color: "text.secondary" }}>
								{user.data.username}
							</Typography>
						</Box>
					</>
				)}
			</Stack>
		</Drawer>
	);
}
