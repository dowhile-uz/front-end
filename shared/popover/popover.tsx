import React from "react";

export type PopoverState<T> = {
	anchorEl: T | null;
	open: boolean;
	handleClick: (e: React.MouseEvent<T>) => void;
	handleClose: (e: unknown) => void;
};

export type PopoverProps<T> = {
	trigger: (state: PopoverState<T>) => React.ReactNode;
	popover: (state: PopoverState<T>) => React.ReactNode;
};

export function Popover<T extends HTMLElement = HTMLElement>({
	trigger,
	popover,
}: PopoverProps<T>) {
	const [anchorEl, setAnchorEl] = React.useState<T | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<T>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const state: PopoverState<T> = {
		anchorEl,
		open,
		handleClick,
		handleClose,
	};

	return (
		<>
			{trigger(state)}
			{popover(state)}
		</>
	);
}
