import type { Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import type { PluginKey } from "@tiptap/pm/state";
import React from "react";
import type { Props } from "tippy.js";
import { DragHandlePlugin, dragHandlePluginDefaultKey } from "./drag-handle";

export const DragHandleComponent: React.FC<{
	className?: string;
	onNodeChange?: (data: {
		node: Node | null;
		editor: Editor;
		pos: number;
	}) => void;
	children: React.ReactNode;
	editor: Editor;
	pluginKey?: PluginKey;
	tippyOptions: Partial<Props>;
}> = ({
	className = "drag-handle",
	children,
	editor,
	pluginKey = dragHandlePluginDefaultKey,
	onNodeChange,
	tippyOptions = {},
}) => {
	const [domElement, setDomElement] = React.useState<HTMLDivElement | null>(
		null,
	);
	const plugin = React.useRef<ReturnType<typeof DragHandlePlugin> | null>(null);

	React.useEffect(() => {
		if (!domElement || editor.isDestroyed) {
			return () => {
				plugin.current = null;
			};
		}

		if (plugin.current) {
			return;
		}

		plugin.current = DragHandlePlugin({
			editor: editor,
			element: domElement,
			pluginKey: pluginKey,
			tippyOptions: tippyOptions,
			onNodeChange: onNodeChange,
		});

		editor.registerPlugin(plugin.current);
		return () => {
			editor.unregisterPlugin(pluginKey);
			plugin.current = null;
		};
	}, [domElement, editor, onNodeChange, pluginKey]);

	return (
		<div className={className} ref={setDomElement}>
			{children}
		</div>
	);
};
