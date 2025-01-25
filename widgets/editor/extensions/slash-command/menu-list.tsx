import React, { useCallback, useEffect, useRef, useState } from "react";

import { Divider, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
// import { CommandButton } from "./command-button";
import type { Command, MenuListProps } from "./types";

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
	const scrollContainer = useRef<HTMLDivElement>(null);
	const activeItem = useRef<HTMLButtonElement>(null);
	const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
	const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

	// Anytime the groups change, i.e. the user types to narrow it down, we want to
	// reset the current selection to the first menu item
	useEffect(() => {
		setSelectedGroupIndex(0);
		setSelectedCommandIndex(0);
	}, [props.items]);

	const selectItem = useCallback(
		(groupIndex: number, commandIndex: number) => {
			const command = props.items[groupIndex].commands[commandIndex];
			props.command(command);
		},
		[props],
	);

	React.useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
			if (event.key === "ArrowDown") {
				if (!props.items.length) {
					return false;
				}

				const commands = props.items[selectedGroupIndex].commands;

				let newCommandIndex = selectedCommandIndex + 1;
				let newGroupIndex = selectedGroupIndex;

				if (commands.length - 1 < newCommandIndex) {
					newCommandIndex = 0;
					newGroupIndex = selectedGroupIndex + 1;
				}

				if (props.items.length - 1 < newGroupIndex) {
					newGroupIndex = 0;
				}

				setSelectedCommandIndex(newCommandIndex);
				setSelectedGroupIndex(newGroupIndex);

				return true;
			}

			if (event.key === "ArrowUp") {
				if (!props.items.length) {
					return false;
				}

				let newCommandIndex = selectedCommandIndex - 1;
				let newGroupIndex = selectedGroupIndex;

				if (newCommandIndex < 0) {
					newGroupIndex = selectedGroupIndex - 1;
					newCommandIndex =
						props.items[newGroupIndex]?.commands.length - 1 || 0;
				}

				if (newGroupIndex < 0) {
					newGroupIndex = props.items.length - 1;
					newCommandIndex = props.items[newGroupIndex].commands.length - 1;
				}

				setSelectedCommandIndex(newCommandIndex);
				setSelectedGroupIndex(newGroupIndex);

				return true;
			}

			if (event.key === "Enter") {
				if (
					!props.items.length ||
					selectedGroupIndex === -1 ||
					selectedCommandIndex === -1
				) {
					return false;
				}

				selectItem(selectedGroupIndex, selectedCommandIndex);

				return true;
			}

			return false;
		},
	}));

	useEffect(() => {
		if (activeItem.current && scrollContainer.current) {
			const offsetTop = activeItem.current.offsetTop;
			const offsetHeight = activeItem.current.offsetHeight;

			scrollContainer.current.scrollTop = offsetTop - offsetHeight;
		}
	}, [selectedCommandIndex, selectedGroupIndex]);

	const createCommandClickHandler = useCallback(
		(groupIndex: number, commandIndex: number) => {
			return () => {
				selectItem(groupIndex, commandIndex);
			};
		},
		[selectItem],
	);

	if (!props.items.length) {
		return null;
	}

	return (
		<List
			sx={{
				width: '100%',
				maxWidth: 360,
				bgcolor: 'background.paper',
				position: 'relative',
				overflow: 'auto',
				maxHeight: 300,
				'& ul': { padding: 0 },
			}}
			subheader={<li />}
		>
			{props.items.map((group, groupIndex: number) => (
				<>
					{groupIndex != 0 && <Divider key={`${group.title}-divider`} />}
					<li area-label={group.title} key={`${group.title}-wrapper`}>
						<ul>
							<ListSubheader>
								{group.title}
							</ListSubheader>
							{group.commands.map((command: Command, commandIndex: number) => (
								<ListItemButton
									key={`${command.label}`}
									// ref={
									// 	selectedGroupIndex === groupIndex &&
									// 		selectedCommandIndex === commandIndex
									// 		? activeItem
									// 		: null
									// }
									onClick={createCommandClickHandler(groupIndex, commandIndex)}
									selected={
										selectedGroupIndex === groupIndex &&
										selectedCommandIndex === commandIndex
									}
								>
									<ListItemIcon sx={{ mr: 1 }}>
										{command.icon}
									</ListItemIcon>
									<ListItemText primary={command.label} />
								</ListItemButton>
							))}
						</ul>
					</li>
				</>
			))}
		</List>
	);
});

MenuList.displayName = "MenuList";

export default MenuList;
