import { Typography } from "@mui/material";
import { mergeAttributes } from "@tiptap/core";
import TiptapHeading from "@tiptap/extension-heading";
import type { Level } from "@tiptap/extension-heading";
import {
	NodeViewContent,
	NodeViewWrapper,
	ReactNodeViewRenderer,
} from "@tiptap/react";

export const Heading = TiptapHeading.extend({
	renderHTML({ node, HTMLAttributes }) {
		const nodeLevel = Number.parseInt(node.attrs.level, 10) as Level;
		const hasLevel = this.options.levels.includes(nodeLevel);
		const level = hasLevel ? nodeLevel : this.options.levels[0];

		return [
			`h${level}`,
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
			0,
		];
	},
	addNodeView() {
		return ReactNodeViewRenderer((props) => {
			return (
				<NodeViewWrapper>
					<Typography variant={`h${props.node.attrs.level}` as "h1"}>
						<NodeViewContent />
					</Typography>
				</NodeViewWrapper>
			);
		});
	},
});

export default Heading;
