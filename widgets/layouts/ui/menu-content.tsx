import { LogoutOutlined, StylusOutlined } from "@mui-symbols-material/w400";
// import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
// import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
// import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
// import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import type React from "react";

export const MenuContent: React.FC = () => {
	return (
		<Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
			<List dense>
				<MenuLink icon={<StylusOutlined />} href="/editor" label="Daftar" />
			</List>
			<List dense>
				<MenuLink icon={<LogoutOutlined />} href="/logout" label="Chiqish" />
			</List>
		</Stack>
	);
};

export const MenuLink: React.FC<{
	selected?: boolean;
	icon: React.ReactNode;
	label: string;
	href: string;
}> = ({ icon, selected, label, href }) => {
	return (
		<ListItem
			disablePadding
			sx={{ display: "block" }}
			component="a"
			href={href}
		>
			<ListItemButton selected={selected}>
				<ListItemIcon>{icon}</ListItemIcon>
				<ListItemText primary={label} />
			</ListItemButton>
		</ListItem>
	);
};
