import { DeleteOutlined, EditOutlined } from "@mui-symbols-material/w400";
import { Card, Divider, Link, Paper, dividerClasses } from "@mui/material";
import { ToolbarButton } from "@shared/toolbar-button";

export type LinkPreviewPanelProps = {
	url: string;
	onEdit: () => void;
	onClear: () => void;
};

export const LinkPreviewPanel = ({
	onClear,
	onEdit,
	url,
}: LinkPreviewPanelProps) => {
	const sanitizedLink = url?.startsWith("javascript:") ? "" : url;
	return (
		<Paper
			variant="outlined"
			sx={{
				display: 'flex',
				alignItems: 'center',
				bgcolor: 'background.paper',
				color: 'text.secondary',
				gap: 1,
				paddingTop: 1,
				paddingBottom: 1,
				paddingLeft: 2,
				paddingRight: 2,
				[`& .${dividerClasses.root}`]: {
					mx: 0.5,
				},
			}}>
			<Link
				href={sanitizedLink}
				target="_blank"
				rel="noopener noreferrer"
			>
				{url}
			</Link>
			<Divider orientation="vertical" flexItem />
			<ToolbarButton title="EdirLink" onClick={onEdit}>
				<EditOutlined />
			</ToolbarButton>
			<ToolbarButton title="Remove link" onClick={onClear}>
				<DeleteOutlined />
			</ToolbarButton>
		</Paper>
	);
};
