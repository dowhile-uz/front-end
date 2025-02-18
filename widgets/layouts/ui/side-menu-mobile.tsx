import { useUser } from "@entities/user";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MenuContent } from "./menu-content";

interface SideMenuMobileProps {
	open: boolean | undefined;
	toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({
	open,
	toggleDrawer,
}: SideMenuMobileProps) {
	const user = useUser();

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={toggleDrawer(false)}
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				[`& .${drawerClasses.paper}`]: {
					backgroundImage: "none",
					backgroundColor: "background.paper",
				},
			}}
		>
			<Stack
				sx={{
					maxWidth: "70dvw",
					height: "100%",
				}}
			>
				{!user.isLoading && user.data && (
					<>
						<Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
							<Stack
								direction="row"
								sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}
							>
								<Avatar
									sizes="small"
									alt={user.data.name}
									src={user.data.avatar_url}
									sx={{ width: 24, height: 24 }}
								/>
								<Typography component="p" variant="h6">
									{user.data.name}
								</Typography>
							</Stack>
						</Stack>
						<Divider />
					</>
				)}
				<Stack sx={{ flexGrow: 1 }}>
					<MenuContent />
				</Stack>
				<Divider />
				{!user.isLoading && user.data && (
					<Stack sx={{ p: 2 }}>
						<Button
							href="/logout"
							variant="outlined"
							fullWidth
							startIcon={<LogoutRoundedIcon />}
						>
							Logout
						</Button>
					</Stack>
				)}
			</Stack>
		</Drawer>
	);
}
