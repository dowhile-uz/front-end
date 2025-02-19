import {
	BookmarksOutlined,
	DictionaryOutlined,
	DrawOutlined,
	GroupOutlined,
	GroupsOutlined,
	InfoOutlined,
	LabelOutlined,
	LibraryBooksOutlined,
	LogoutOutlined,
	MailOutlined,
	PersonOutlined,
	ReceiptLongOutlined,
	SettingsOutlined,
	SpellcheckOutlined,
	StylusOutlined,
} from "@mui-symbols-material/w400";
import { Divider } from "@mui/material";
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
				<MenuLink icon={<ReceiptLongOutlined />} href="/" label="Bosh sahifa" />
				<MenuLink icon={<InfoOutlined />} href="/about" label="Loyiha haqida" />
				<Divider sx={{ my: 2 }} />
				<MenuLabel label="Izlanish bo‘limi" />
				<MenuLink
					icon={<LibraryBooksOutlined />}
					href="/tutorials"
					label="Darsliklar"
				/>
				<MenuLink icon={<LabelOutlined />} href="/topics" label="Mavzular" />
				<MenuLink
					icon={<GroupsOutlined />}
					href="/work-groups"
					label="O‘quv guruhlari"
				/>
				<MenuLink
					icon={<GroupOutlined />}
					href="/users"
					label="Barcha foydalanuvchilar"
				/>
			</List>
			<List dense>
				<MenuLabel label="Yaratish bo‘limi" />
				<MenuLink
					icon={<SpellcheckOutlined />}
					href="/spell-check"
					label="Imlo tekshiruvi"
				/>
				<MenuLink
					icon={<DictionaryOutlined />}
					href="/dictionary"
					label="Lug‘at"
				/>
				<MenuLink icon={<DrawOutlined />} href="/draw" label="Chizmalar" />
				<MenuLink icon={<StylusOutlined />} href="/editor" label="Daftar" />
				<Divider sx={{ my: 2 }} />
				<MenuLabel label="Shaxsiy bo‘lim" />
				<MenuLink icon={<MailOutlined />} href="/messages" label="Xabarnoma" />
				<MenuLink
					icon={<BookmarksOutlined />}
					href="/bookmarks"
					label="Yoqtirganlarim"
				/>
				<MenuLink
					icon={<PersonOutlined />}
					href="/profile"
					label="Mening sahifam"
				/>
				<MenuLink
					icon={<SettingsOutlined />}
					href="/settings"
					label="Sozlamalar"
				/>
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
			sx={{ display: "block", color: "text.primary" }}
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

export const MenuLabel: React.FC<{
	label: string;
}> = ({ label }) => {
	return (
		<ListItem disablePadding sx={{ display: "block" }}>
			<ListItemButton>
				<ListItemText primary={label} sx={{ opacity: 0.7 }} />
			</ListItemButton>
		</ListItem>
	);
};
