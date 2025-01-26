import type { Meta, StoryObj } from "@storybook/react";

import React from "react";
import { ColorPicker as ColorPickerComponent } from "../ui/panels/colorpicker";

const meta: Meta<typeof ColorPickerComponent> = {
	title: "widgets/editor",
	component: ColorPickerComponent,
};

export default meta;
type Story = StoryObj<typeof ColorPickerComponent>;

export const ColorPicker: Story = {
	render() {
		const [color, setColor] = React.useState<string>();
		return (
			<ColorPickerComponent
				color={color}
				onChange={(color) => setColor(color)}
				onClear={() => setColor}
			/>
		);
	},
};
