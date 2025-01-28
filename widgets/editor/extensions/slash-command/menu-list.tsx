import React from "react";

import {
	Divider,
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList as MuiMenuList,
	Paper,
} from "@mui/material";
import type { Command, MenuListProps } from "./types";

export const MenuList: React.FC<MenuListProps> = (props) => {
	const listRef = React.useRef<HTMLUListElement | null>(null);

	React.useEffect(() => {
		let currentIndex = -1;

		const handler = (event: KeyboardEvent) => {
			if (!listRef.current) return;

			const children = listRef.current.querySelectorAll(
				".slash-command-menu-list-command",
			) as NodeListOf<HTMLLIElement>;

			if (event.key == "ArrowDown") {
				if (currentIndex + 1 == children.length) {
					currentIndex = 0;
				} else {
					currentIndex++;
				}
			} else if (event.key == "ArrowUp") {
				if (currentIndex - 1 < 0) {
					currentIndex = children.length - 1;
				} else {
					currentIndex--;
				}
			}

			if (!children[currentIndex]) return;

			children[currentIndex].focus();
		};
		document.body.addEventListener("keydown", handler);

		return () => document.body.removeEventListener("keydown", handler);
	}, []);

	const selectItem = React.useCallback(
		(groupIndex: number, commandIndex: number) => {
			const command = props.items[groupIndex].commands[commandIndex];
			props.command(command);
		},
		[props],
	);

	if (props.items.length == 0) {
		return null;
	}

	return (
		<Paper
			sx={{
				width: "100%",
				maxWidth: 360,
				bgcolor: "background.paper",
				position: "relative",
				overflow: "auto",
				maxHeight: 300,
			}}
		>
			<MuiMenuList ref={listRef}>
				{props.items.map((group, groupIndex: number) => (
					<React.Fragment key={group.title}>
						{groupIndex != 0 && <Divider />}
						<MenuItem disabled>
							<ListItemText primary={group.title} />
						</MenuItem>

						{group.commands.map((command: Command, commandIndex: number) => (
							<MenuItem
								key={`${group.title}-${command.label}`}
								className="slash-command-menu-list-command"
								onClick={() => selectItem(groupIndex, commandIndex)}
							>
								<ListItemIcon sx={{ mr: 1 }}>{command.icon}</ListItemIcon>
								<ListItemText primary={command.label} />
							</MenuItem>
						))}
					</React.Fragment>
				))}
			</MuiMenuList>
		</Paper>
	);
};

MenuList.displayName = "MenuList";

export default MenuList;
