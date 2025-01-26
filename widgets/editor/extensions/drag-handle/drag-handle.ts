import { type Editor, Extension, type RawCommands } from "@tiptap/core";
import { isChangeOrigin } from "@tiptap/extension-collaboration";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import {
	type EditorState,
	Plugin,
	PluginKey,
	type Selection,
} from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import tippy, {
	type Instance as TippyInstance,
	type Props as TippyProps,
} from "tippy.js";
import {
	absolutePositionToRelativePosition,
	relativePositionToAbsolutePosition,
	ySyncPluginKey,
} from "y-prosemirror";
import { NodeRangeSelection, getSelectionRanges } from "../node-range";

function cloneDomElement(source: HTMLElement) {
	const cloned = source.cloneNode(true) as HTMLElement;
	const elements1 = [
		source,
		...Array.from(
			source.getElementsByTagName("*") as HTMLCollectionOf<HTMLElement>,
		),
	];
	const elements2 = [
		cloned,
		...Array.from(
			cloned.getElementsByTagName("*") as HTMLCollectionOf<HTMLElement>,
		),
	];

	elements1.forEach((element, key) => {
		let cssText = "";
		const computedStyle = getComputedStyle(element);

		for (let i = 0; i < computedStyle.length; i += 1) {
			cssText += `${computedStyle[i]}:${computedStyle.getPropertyValue(
				computedStyle[i],
			)};`;
		}

		elements2[key].style.cssText = cssText;
	});

	return cloned;
}

const findElementByDirection = (state: {
	x: number;
	y: number;
	direction: string;
	editor: Editor;
}) => {
	const { x, y, direction, editor } = state;
	let resultElement = null;
	let resultNode = null;
	let pos = null;
	let pointerX = x;

	while (resultNode == null && pointerX < window.innerWidth && pointerX > 0) {
		const elements = document.elementsFromPoint(pointerX, y);
		const index = elements.findIndex((e) =>
			e.classList.contains("ProseMirror"),
		);
		const range = elements.slice(0, index);
		if (range.length > 0) {
			const res = range[0];
			resultElement = res;
			pos = editor.view.posAtDOM(res, 0);

			if (pos >= 0) {
				resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));

				if (resultNode != null && resultNode.isText) {
					resultNode = editor.state.doc.nodeAt(Math.max(pos - 1, 0));

					if (resultNode) {
						resultNode = editor.state.doc.nodeAt(Math.max(pos, 0));
					}
				}

				break;
			}
		}

		if ("left" === direction) {
			pointerX -= 1;
		} else {
			pointerX += 1;
		}
	}

	return { resultElement, resultNode, pos: null != pos ? pos : null };
};
function getMinPos(base = 0, left = 0, right = 0) {
	return Math.min(Math.max(base, left), right);
}

function detachFromParentNode(node: HTMLElement) {
	if (node.parentNode != null) {
		node.parentNode.removeChild(node);
	}
}

function getSelectionRangesByCoords(event: DragEvent, editor: Editor) {
	const { doc } = editor.view.state;

	const element = findElementByDirection({
		editor: editor,
		x: event.clientX,
		y: event.clientY,
		direction: "right",
	});

	if (!element.resultNode || null === element.pos) return [];

	const paddingLeft = Number.parseInt(
		window.getComputedStyle(editor.view.dom).paddingLeft,
		10,
	);
	const paddingRight = Number.parseInt(
		window.getComputedStyle(editor.view.dom).paddingRight,
		10,
	);
	const borderLeft = Number.parseInt(
		window.getComputedStyle(editor.view.dom).borderLeftWidth,
		10,
	);
	// const s1 = parseInt(window.getComputedStyle(t.view.dom).borderLeftWidth, 10)
	const borderRight = Number.parseInt(
		window.getComputedStyle(editor.view.dom).borderRightWidth,
		10,
	);

	const clientRect = editor.view.dom.getBoundingClientRect();

	const position = {
		left: getMinPos(
			event.clientX,
			clientRect.left + paddingLeft + borderLeft,
			clientRect.right - paddingRight - borderRight,
		),
		top: event.clientY,
	};

	const posAtCoords = editor.view.posAtCoords(position);

	if (!posAtCoords) return [];

	const { pos } = posAtCoords;

	if (!doc.resolve(pos).parent) return [];

	const from = doc.resolve(element.pos);
	const to = doc.resolve(element.pos + 1);

	return getSelectionRanges(from, to, 0);
}

const offsetByNode = (node: ProseMirrorNode, posAtDom: number) => {
	const resolvedNode = node.resolve(posAtDom);

	const { depth } = resolvedNode;
	if (depth == 0) {
		return posAtDom;
	}

	return resolvedNode.pos - resolvedNode.parentOffset - 1;
};

const findNodeByPos = (node: ProseMirrorNode, posAtDom: number) => {
	const foundNode = node.nodeAt(posAtDom);
	const resolvedNode = node.resolve(posAtDom);
	let { depth } = resolvedNode;
	let result = foundNode;

	while (depth > 0) {
		const temp = resolvedNode.node(depth);

		depth -= 1;

		if (depth == 0) {
			result = temp;
		}
	}

	return result;
};

const getRelativePosByState = (editorState: EditorState, pos: number) => {
	const yState = ySyncPluginKey.getState(editorState);
	return yState
		? absolutePositionToRelativePosition(
				pos,
				yState.type,
				yState.binding.mapping,
			)
		: null;
};

const findParent = (editorView: EditorView, node: Node | null) => {
	let parent = node;

	while (parent && parent.parentNode && parent.parentNode !== editorView.dom) {
		parent = parent.parentNode;
	}
	return parent;
};

const dragHandlePluginDefaultKey = new PluginKey("dragHandle");

const DragHandlePlugin = ({
	pluginKey = dragHandlePluginDefaultKey,
	element,
	editor,
	tippyOptions,
	onNodeChange,
}: {
	pluginKey?: PluginKey;
	element: HTMLElement;
	editor: Editor;
	tippyOptions: Partial<TippyProps>;
	onNodeChange?: (data: {
		node: ProseMirrorNode | null;
		editor: Editor;
		pos: number;
	}) => void;
}) => {
	const wrapper = document.createElement("div");
	let unknownRelPos: any;
	let tippyInstance: TippyInstance<TippyProps> | null = null;
	let isDragging = false;
	let proseMirrorNode: ProseMirrorNode | null = null;
	let mappedPos = -1;

	element.addEventListener("dragstart", (event: DragEvent) => {
		const { view } = editor;

		if (!event.dataTransfer) return;

		const { empty, $from, $to } = view.state.selection;

		const rangesByCoords = getSelectionRangesByCoords(event, editor);
		const rangesRaw = getSelectionRanges($from, $to, 0);
		const contains = rangesRaw.some((e) =>
			rangesByCoords.find((t) => t.$from === e.$from && t.$to === e.$to),
		);
		const ranges = empty || !contains ? rangesByCoords : rangesRaw;

		if (!ranges.length) return;

		const { tr } = view.state;
		const divElement = document.createElement("div");
		const fromPos = ranges[0].$from.pos;
		const toPos = ranges[ranges.length - 1].$to.pos;
		const rangeSelection = NodeRangeSelection.create(
			view.state.doc,
			fromPos,
			toPos,
		);
		const rangeContent = rangeSelection.content();

		ranges.forEach((range) => {
			const clonedElement = cloneDomElement(
				view.nodeDOM(range.$from.pos) as HTMLElement,
			);
			divElement.append(clonedElement);
		});

		divElement.style.position = "absolute";
		divElement.style.top = "-10000px";

		document.body.append(divElement);

		event.dataTransfer.clearData();
		event.dataTransfer.setDragImage(divElement, 0, 0);

		view.dragging = { slice: rangeContent, move: true };

		tr.setSelection(rangeSelection as unknown as Selection);

		view.dispatch(tr);

		document.addEventListener("drop", () => detachFromParentNode(divElement), {
			once: true,
		});

		setTimeout(() => {
			if (element) {
				element.style.pointerEvents = "none";
			}
		}, 0);
	});

	element.addEventListener("dragend", () => {
		if (element) {
			element.style.pointerEvents = "auto";
		}
	});

	return new Plugin({
		key: "string" == typeof pluginKey ? new PluginKey(pluginKey) : pluginKey,
		state: {
			init: () => ({ locked: false }),
			apply(tr, value, oldState, newState) {
				const lockDragMeta = tr.getMeta("lockDragHandle");
				const hideDragMeta = tr.getMeta("hideDragHandle");

				if (lockDragMeta) {
					isDragging = lockDragMeta;
				}

				if (hideDragMeta && tippyInstance) {
					tippyInstance?.hide();
					isDragging = false;
					proseMirrorNode = null;
					mappedPos = -1;

					if (onNodeChange != null) {
						onNodeChange({ editor: editor, node: null, pos: -1 });
					}

					return value;
				}

				if (tr.docChanged && mappedPos != -1 && element && tippyInstance)
					if (isChangeOrigin(tr)) {
						const n = ySyncPluginKey.getState(newState);
						const e = n
							? relativePositionToAbsolutePosition(
									n.doc,
									n.type,
									unknownRelPos,
									n.binding.mapping,
								) || 0
							: -1;

						if (mappedPos !== -1) {
							mappedPos = e;
						}
					} else {
						const mapping = tr.mapping.map(mappedPos);

						if (mapping !== mappedPos) {
							mappedPos = mapping;
							unknownRelPos = getRelativePosByState(newState, mappedPos);
						}
					}
				return value;
			},
		},
		view: (editorView) => {
			element.draggable = true;
			element.style.pointerEvents = "auto";

			if (editor.view.dom.parentElement != null) {
				editor.view.dom.parentElement.appendChild(wrapper);
			}

			wrapper.appendChild(element);
			wrapper.style.pointerEvents = "none";
			wrapper.style.position = "absolute";
			wrapper.style.top = "0";
			wrapper.style.left = "0";

			tippyInstance = tippy(editorView.dom, {
				getReferenceClientRect: null,
				interactive: true,
				trigger: "manual",
				placement: "left-start",
				hideOnClick: false,
				duration: 100,
				popperOptions: {
					modifiers: [
						{ name: "flip", enabled: false },
						{
							name: "preventOverflow",
							options: { rootBoundary: "document", mainAxis: false },
						},
					],
				},
				...tippyOptions,
				appendTo: wrapper,
				content: element,
			});

			return {
				update(view, prevState) {
					if (!element || !tippyInstance) return;
					element.draggable = !isDragging;

					if (editorView.state.doc.eq(prevState.doc) || mappedPos !== -1)
						return;

					let domElement = editorView.nodeDOM(mappedPos);

					if (
						((domElement = findParent(editorView, domElement)),
						domElement === editorView.dom)
					)
						return;
					if (1 !== (null == domElement ? undefined : domElement.nodeType))
						return;

					const posAtDom = editorView.posAtDOM(domElement as HTMLElement, 0);
					const node1 = findNodeByPos(editor.state.doc, posAtDom);
					const offset = offsetByNode(editor.state.doc, posAtDom);

					(proseMirrorNode = node1),
						(mappedPos = offset),
						(unknownRelPos = getRelativePosByState(
							editorView.state,
							mappedPos,
						)),
						null == onNodeChange ||
							onNodeChange({
								editor: editor,
								node: proseMirrorNode,
								pos: mappedPos,
							}),
						tippyInstance.setProps({
							getReferenceClientRect: () =>
								(domElement as HTMLElement).getBoundingClientRect(),
						});
				},
				destroy() {
					null == tippyInstance || tippyInstance.destroy(),
						element && detachFromParentNode(wrapper);
				},
			};
		},
		props: {
			handleDOMEvents: {
				mouseleave: (view, event) => (
					isDragging ||
						(event.target &&
							!wrapper.contains(event.relatedTarget as HTMLElement) &&
							(null == tippyInstance || tippyInstance.hide(),
							(proseMirrorNode = null),
							(mappedPos = -1),
							null == onNodeChange ||
								onNodeChange({ editor: editor, node: null, pos: -1 }))),
					false
				),
				mousemove(view, event) {
					if (!element || !tippyInstance || isDragging) return false;

					const tempEl = findElementByDirection({
						x: event.clientX,
						y: event.clientY,
						direction: "right",
						editor: editor,
					});

					if (!tempEl.resultElement) return false;

					const parent = findParent(
						view,
						tempEl.resultElement,
					) as HTMLElement | null;
					if (!parent || parent === view.dom) return false;

					if (1 !== (null == parent ? undefined : parent.nodeType))
						return false;
					const posAtDom1 = view.posAtDOM(parent as HTMLElement, 0);

					const pos = findNodeByPos(editor.state.doc, posAtDom1);

					if (pos !== proseMirrorNode) {
						const t = offsetByNode(editor.state.doc, posAtDom1);
						proseMirrorNode = pos;
						mappedPos = t;
						unknownRelPos = getRelativePosByState(view.state, mappedPos);
						if (onNodeChange != null) {
							onNodeChange({
								editor: editor,
								node: proseMirrorNode,
								pos: mappedPos,
							});
						}

						tippyInstance.setProps({
							getReferenceClientRect: () => parent.getBoundingClientRect(),
						});
						tippyInstance.show();
					}
					return false;
				},
			},
		},
	});
};

const DragHandle = Extension.create<{
	tippyOptions: Partial<TippyProps>;
	onNodeChange: (x: any) => void;
	render: () => HTMLElement;
	locked: boolean;
}>({
	name: "dragHandle",
	addOptions: () => ({
		render() {
			const element = document.createElement("div");
			element.classList.add("drag-handle");
			return element;
		},
		tippyOptions: {},
		locked: false,
		onNodeChange: () => null,
	}),
	addCommands() {
		return {
			lockDragHandle:
				() =>
				({ editor }: { editor: Editor }) => (
					(this.options.locked = true),
					editor.commands.setMeta("lockDragHandle", this.options.locked)
				),
			unlockDragHandle:
				() =>
				({ editor }: { editor: Editor }) => (
					(this.options.locked = false),
					editor.commands.setMeta("lockDragHandle", this.options.locked)
				),
			toggleDragHandle:
				() =>
				({ editor }: { editor: Editor }) => (
					(this.options.locked = !this.options.locked),
					editor.commands.setMeta("lockDragHandle", this.options.locked)
				),
		} as Partial<RawCommands>;
	},
	addProseMirrorPlugins() {
		const element = this.options.render();
		return [
			DragHandlePlugin({
				tippyOptions: this.options.tippyOptions,
				element,
				editor: this.editor,
				onNodeChange: this.options.onNodeChange,
			}),
		];
	},
});

export {
	DragHandle,
	DragHandlePlugin,
	DragHandle as default,
	dragHandlePluginDefaultKey,
};
