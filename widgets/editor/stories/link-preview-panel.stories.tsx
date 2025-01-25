import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { LinkPreviewPanel as LinkPreviewPanelComponent } from '../ui/panels/link-preview-panel';

const meta: Meta<typeof LinkPreviewPanelComponent> = {
  title: "widgets/editor",
  component: LinkPreviewPanelComponent,
};

export default meta;
type Story = StoryObj<typeof LinkPreviewPanelComponent>;

export const LinkPreviewPanel: Story = {
  render() {
    const [link,] = React.useState<string>("https://google.com")
    return <LinkPreviewPanelComponent
      url={link}
      onEdit={() => { }}
      onClear={() => { }}
    />
  },
};
