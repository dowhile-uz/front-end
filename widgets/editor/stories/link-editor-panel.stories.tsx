import type { Meta, StoryObj } from "@storybook/react";

import React from "react";
import { LinkEditorPanel as LinkEditorPanelComponent } from "../ui/panels/link-editor-panel";

const meta: Meta<typeof LinkEditorPanelComponent> = {
	title: "widgets/editor",
	component: LinkEditorPanelComponent,
};

export default meta;
type Story = StoryObj<typeof LinkEditorPanelComponent>;

export const LinkEditorPanel: Story = {
	render() {
		const [, setLink] = React.useState<string>();
		return (
			<LinkEditorPanelComponent
				initialUrl="https://google.com"
				initialOpenInNewTab={true}
				onSetLink={setLink}
			/>
		);
	},
};
