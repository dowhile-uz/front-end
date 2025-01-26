import {
	Extension,
	combineTransactionSteps,
	findChildren,
	findChildrenInRange,
	getChangedRanges,
} from "@tiptap/core";
import { Fragment, Slice, Node as any } from "@tiptap/pm/model";
import { Plugin, PluginKey, type Transaction } from "@tiptap/pm/state";
import { v4 } from "uuid";

function findDuplicates(nodes: any[]) {
	nodes = nodes.filter((e, index) => nodes.indexOf(e) !== index);
	const cache: { [key: string]: boolean } = {};

	return nodes.filter((node) => {
		const str = JSON.stringify(node);
		return (
			!Object.prototype.hasOwnProperty.call(cache, str) && (cache[str] = true)
		);
	});
}

export type UniqueIDProps = {
	types: string[];
	attributeName: string;
	generateID: () => string;
	filterTransaction: ((transaction: Transaction) => boolean) | null;
};

export const UniqueID = Extension.create<UniqueIDProps>({
	name: "uniqueID",
	priority: 1e4,
	addOptions: () => ({
		attributeName: "id",
		types: [],
		generateID: () => v4(),
		filterTransaction: null,
	}),
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					[this.options.attributeName]: {
						default: null,
						parseHTML: (t) =>
							t.getAttribute(`data-${this.options.attributeName}`),
						renderHTML: (t) =>
							t[this.options.attributeName]
								? {
										[`data-${this.options.attributeName}`]:
											t[this.options.attributeName],
									}
								: {},
					},
				},
			},
		];
	},
	onCreate() {
		if (
			this.editor.extensionManager.extensions.find(
				(extension) => "collaboration" === extension.name,
			)
		)
			return;

		const { view, state } = this.editor;
		const { tr, doc } = state;
		const { types, attributeName, generateID } = this.options;
		findChildren(
			doc,
			(node) =>
				types.includes(node.type.name) && null === node.attrs[attributeName],
		).forEach(({ node, pos }) => {
			tr.setNodeMarkup(pos, undefined, {
				...node.attrs,
				[attributeName]: generateID(),
			});
		}),
			tr.setMeta("addToHistory", false),
			view.dispatch(tr);
	},
	addProseMirrorPlugins() {
		let globalParentElement: HTMLElement | null = null;
		let somethingBoolean = false;
		return [
			new Plugin({
				key: new PluginKey("uniqueID"),
				appendTransaction: (txs, oldState, newState) => {
					const isChanged =
						txs.some((t) => t.docChanged) && !oldState.doc.eq(newState.doc);

					const s =
						this.options.filterTransaction &&
						txs.some((tx) => {
							const { filterTransaction } = this.options;
							if (filterTransaction) {
								filterTransaction.call(this.options, tx);
							}
						});

					const syncMeta = txs.find((tx) => tx.getMeta("y-sync$"));
					if (syncMeta) return;
					if (!isChanged || s) return;
					const { tr } = newState;
					const { types, attributeName, generateID } = this.options;
					const f = combineTransactionSteps(oldState.doc, [...txs]);
					const { mapping } = f;
					return (
						getChangedRanges(f).forEach(({ newRange }) => {
							const children = findChildrenInRange(
								newState.doc,
								newRange,
								(t) => types.includes(t.type.name),
							);
							const children1 = children
								.map(({ node }) => node.attrs[attributeName])
								.filter((t) => null !== t);
							children.forEach(({ node, pos }, index) => {
								var node1;
								const i =
									null === (node1 = tr.doc.nodeAt(pos)) || undefined === node1
										? undefined
										: node1.attrs[attributeName];
								if (null === i)
									return void tr.setNodeMarkup(pos, undefined, {
										...node.attrs,
										[attributeName]: generateID(),
									});
								const child = children[index + 1];
								if (child && 0 === node.content.size) {
									if (
										(tr.setNodeMarkup(child.pos, undefined, {
											...child.node.attrs,
											[attributeName]: i,
										}),
										(children1[index + 1] = i),
										child.node.attrs[attributeName])
									)
										return;
									const id = generateID();
									return (
										tr.setNodeMarkup(pos, undefined, {
											...node.attrs,
											[attributeName]: id,
										}),
										(children1[index] = id),
										tr
									);
								}
								const duplicates = findDuplicates(children1);
								const { deleted } = mapping.invert().mapResult(pos);
								deleted &&
									duplicates.includes(i) &&
									tr.setNodeMarkup(pos, undefined, {
										...node.attrs,
										[attributeName]: generateID(),
									});
							});
						}),
						tr.steps.length
							? (tr.setStoredMarks(newState.tr.storedMarks), tr)
							: undefined
					);
				},
				view(view) {
					const handler = (event: DragEvent) => {
						var parentElement = view.dom.parentElement;

						if (
							parentElement != null &&
							parentElement.contains(event.target as HTMLElement | null)
						) {
							globalParentElement = view.dom.parentElement;
						}
					};

					window.addEventListener("dragstart", handler);

					return {
						destroy() {
							window.removeEventListener("dragstart", handler);
						},
					};
				},
				props: {
					handleDOMEvents: {
						drop: (view, event) => {
							return (
								(globalParentElement === view.dom.parentElement &&
									"copyMove" !==
										(null === event.dataTransfer ||
										undefined === event.dataTransfer
											? undefined
											: event.dataTransfer.effectAllowed) &&
									"copy" !==
										(null === event.dataTransfer ||
										undefined === event.dataTransfer
											? undefined
											: event.dataTransfer.effectAllowed)) ||
									((globalParentElement = null), (somethingBoolean = true)),
								false
							);
						},
						paste: () => ((somethingBoolean = true), false),
					},
					transformPasted: (slice) => {
						if (!somethingBoolean) return slice;
						const { types, attributeName } = this.options;

						const getContent = (fragment: Fragment) => {
							const nodes: any[] = [];

							fragment.forEach((node) => {
								if (node.isText) {
									nodes.push(node);
									return;
								}

								if (!types.includes(node.type.name)) {
									nodes.push(node.copy(getContent(node.content)));
									return;
								}

								const nodeType = node.type.create(
									{ ...node.attrs, [attributeName]: null },
									getContent(node.content),
									node.marks,
								);

								nodes.push(nodeType);
							});

							return Fragment.from(nodes);
						};

						somethingBoolean = false;
						return new Slice(
							getContent(slice.content),
							slice.openStart,
							slice.openEnd,
						);
					},
				},
			}),
		];
	},
});
