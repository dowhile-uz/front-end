import {
	Box,
	Button,
	Card,
	Checkbox,
	FormControlLabel,
	Paper,
	TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

export type LinkEditorPanelProps = {
	initialUrl?: string;
	initialOpenInNewTab?: boolean;
	onSetLink: (url: string, openInNewTab?: boolean) => void;
};

export const useLinkEditorState = ({
	initialUrl,
	initialOpenInNewTab,
	onSetLink,
}: LinkEditorPanelProps) => {
	const [url, setUrl] = useState(initialUrl || "");
	const [openInNewTab, setOpenInNewTab] = useState(
		initialOpenInNewTab || false,
	);

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(event.target.value);
	}, []);

	const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

	const handleSubmit = useCallback(() => {
		if (isValidUrl) {
			onSetLink(url, openInNewTab);
		}
	}, [url, isValidUrl, openInNewTab, onSetLink]);

	return {
		url,
		setUrl,
		openInNewTab,
		setOpenInNewTab,
		onChange,
		handleSubmit,
		isValidUrl,
	};
};

export const LinkEditorPanel = ({
	onSetLink,
	initialOpenInNewTab,
	initialUrl,
}: LinkEditorPanelProps) => {
	const state = useLinkEditorState({
		onSetLink,
		initialOpenInNewTab,
		initialUrl,
	});

	const isInvalidURL = state.url.length > 0 && !state.isValidUrl;

	return (
		<Paper
			variant="outlined"
			sx={{
				display: "flex",
				flexDirection: "column",
				bgcolor: "background.paper",
				color: "text.secondary",
				gap: 1,
				padding: 2,
				paddingBottom: 1,
			}}
		>
			<Box sx={{ display: "flex", alignItems: "flex-start" }}>
				<TextField
					error={isInvalidURL}
					label="Enter URL"
					variant="outlined"
					size="small"
					value={state.url}
					onChange={(event) => state.setUrl(event.target.value)}
					helperText={isInvalidURL ? "Invalid URL" : " "}
				/>
				<Button onClick={state.handleSubmit}>Set Link</Button>
			</Box>
			<FormControlLabel
				control={
					<Checkbox
						checked={state.openInNewTab}
						onChange={() => state.setOpenInNewTab(!state.openInNewTab)}
					/>
				}
				label="Open in new tab"
			/>
		</Paper>
	);
};
