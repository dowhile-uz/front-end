import type { Meta, StoryObj } from "@storybook/react";

import { BlockEditor as BlockEditorComponent } from "../ui/block-editor/block-editor";

const meta: Meta<typeof BlockEditorComponent> = {
	title: "widgets/editor",
	component: BlockEditorComponent,
};

export default meta;
type Story = StoryObj<typeof BlockEditorComponent>;

export const BlockEditor: Story = {
	args: {},
};
