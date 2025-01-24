import type { Meta, StoryObj } from '@storybook/react';

import { useBlockEditor } from "../hooks/use-block-editor";
import { TextMenuInner } from '../ui/menus/text-menu';

const meta: Meta<typeof TextMenuInner> = {
  title: "widgets/editor",
  component: TextMenuInner,
};

export default meta;
type Story = StoryObj<typeof TextMenuInner>;

export const TextMenu: Story = {
  render: () => {
    const { editor } = useBlockEditor({ ydoc: null })
    return <TextMenuInner editor={editor} />
  }
};
