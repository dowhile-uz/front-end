import { EditorContent } from "@tiptap/react";
import React from "react";

import { LinkMenu } from "../menus/link-menu";

import { useBlockEditor } from "../../hooks/use-block-editor";

import "../../styles/index.scss";

import type { TiptapCollabProvider } from "@hocuspocus/provider";
import type * as Y from "yjs";
import ImageBlockMenu from "../../extensions/image-block/components/image-block-menu";
import { ColumnsMenu } from "../../extensions/multi-column//menus";
import { TableColumnMenu, TableRowMenu } from "../../extensions/table/menus";
import { useSidebar } from "../../hooks/use-sidebar";
import { ContentItemMenu } from "../menus/content-item-menu";
import { TextMenu } from "../menus/text-menu";
import { Sidebar } from "../sidebar/sidebar";
import { EditorHeader } from "./editor-header";

export const BlockEditor = ({
	// aiToken,
	ydoc,
	provider,
}: {
	// aiToken?: string
	ydoc: Y.Doc | null;
	provider?: TiptapCollabProvider | null | undefined;
}) => {
	const menuContainerRef = React.useRef(null);

	const leftSidebar = useSidebar();
	const { editor, users, collabState } = useBlockEditor({ ydoc, provider });

	if (!editor || !users) {
		return null;
	}

	return (
		<div className="flex h-full" ref={menuContainerRef}>
			<Sidebar
				isOpen={leftSidebar.isOpen}
				onClose={leftSidebar.close}
				editor={editor}
			/>
			<div className="relative flex flex-col flex-1 h-full overflow-hidden">
				<EditorHeader
					editor={editor}
					collabState={collabState}
					users={users}
					isSidebarOpen={leftSidebar.isOpen}
					toggleSidebar={leftSidebar.toggle}
				/>
				<EditorContent editor={editor} className="flex-1 overflow-y-auto" />
				<ContentItemMenu editor={editor} />
				<LinkMenu editor={editor} appendTo={menuContainerRef} />
				<TextMenu editor={editor} />
				<ColumnsMenu editor={editor} appendTo={menuContainerRef} />
				<TableRowMenu editor={editor} appendTo={menuContainerRef} />
				<TableColumnMenu editor={editor} appendTo={menuContainerRef} />
				<ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
			</div>
		</div>
	);
};

export default BlockEditor;
