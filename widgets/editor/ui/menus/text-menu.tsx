import { Box, Divider, dividerClasses } from "@mui/material";
import * as Popover from "@radix-ui/react-popover";
import { BubbleMenu, type Editor } from "@tiptap/react";
import { memo } from "react";
import { useTextmenuCommands } from "../../hooks/use-textmenu-commands";
import { useTextmenuContentTypes } from "../../hooks/use-textmenu-content-types";
import { useTextmenuStates } from "../../hooks/use-textmenu-states";
import { ColorPicker } from "../panels/colorpicker";
// import { AIDropdown } from "./ai-dropdown";
import { ContentTypePicker } from "./content-type-picker";
import { EditLinkPopover } from "./edit-link-popover";
import { FontFamilyPicker } from "./font-family-picker";
import { FontSizePicker } from "./font-size-picker";
import { ToolbarButton } from "./toolbar-button"

import CodeIcon from '@mui/icons-material/Code';
import ColorLensIcon from '@mui/icons-material/ColorLens'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import SubscriptIcon from '@mui/icons-material/Subscript'
import SuperscriptIcon from '@mui/icons-material/Superscript'

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoToolbarButton = memo(ToolbarButton)
const MemoColorPicker = memo(ColorPicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);
const MemoFontSizePicker = memo(FontSizePicker);
const MemoContentTypePicker = memo(ContentTypePicker);

export type TextMenuProps = {
	editor: Editor;
};

export const TextMenuInner = ({ editor }: TextMenuProps) => {
	const commands = useTextmenuCommands(editor);
	const states = useTextmenuStates(editor);
	const blockOptions = useTextmenuContentTypes(editor);

	return <Box
		sx={{
			display: 'flex',
			alignItems: 'center',
			border: '1px solid',
			borderColor: 'divider',
			borderRadius: 1,
			bgcolor: 'background.paper',
			color: 'text.secondary',
			'& svg': {
				m: 1,
			},
			[`& .${dividerClasses.root}`]: {
				mx: 0.5,
			},
		}}
	>
		{/* <AIDropdown */}
		{/*   onCompleteSentence={commands.onCompleteSentence} */}
		{/*   onEmojify={commands.onEmojify} */}
		{/*   onFixSpelling={commands.onFixSpelling} */}
		{/*   onMakeLonger={commands.onMakeLonger} */}
		{/*   onMakeShorter={commands.onMakeShorter} */}
		{/*   onSimplify={commands.onSimplify} */}
		{/*   onTldr={commands.onTldr} */}
		{/*   onTone={commands.onTone} */}
		{/*   onTranslate={commands.onTranslate} */}
		{/* /> */}
		{/* <Divider orientation="vertical" flexItem /> */}
		<MemoContentTypePicker options={blockOptions} />
		<MemoFontFamilyPicker
			onChange={commands.onSetFont}
			value={states.currentFont || ""}
		/>
		<MemoFontSizePicker
			onChange={commands.onSetFontSize}
			value={states.currentSize || ""}
		/>
		<Divider orientation="vertical" flexItem />
		<MemoToolbarButton
			tooltip="Bold"
			tooltipShortcut={["Mod", "B"]}
			onClick={commands.onBold}
			active={states.isBold}
		>
			<FormatBoldIcon />
		</MemoToolbarButton>
		<MemoToolbarButton
			tooltip="Italic"
			tooltipShortcut={["Mod", "I"]}
			onClick={commands.onItalic}
			active={states.isItalic}
		>
			<FormatItalicIcon />
		</MemoToolbarButton>
		<MemoToolbarButton
			tooltip="Underline"
			tooltipShortcut={["Mod", "U"]}
			onClick={commands.onUnderline}
			active={states.isUnderline}
		>
			<FormatUnderlinedIcon />
		</MemoToolbarButton>
		<MemoToolbarButton
			tooltip="Strikehrough"
			tooltipShortcut={["Mod", "Shift", "S"]}
			onClick={commands.onStrike}
			active={states.isStrike}
		>
			<StrikethroughSIcon />
		</MemoToolbarButton>
		<MemoToolbarButton
			tooltip="Code"
			tooltipShortcut={["Mod", "E"]}
			onClick={commands.onCode}
			active={states.isCode}
		>
			<CodeIcon />
		</MemoToolbarButton>
		<MemoToolbarButton tooltip="Code block" onClick={commands.onCodeBlock}>
			<IntegrationInstructionsIcon />
		</MemoToolbarButton>
		<EditLinkPopover onSetLink={commands.onLink} />
		<Popover.Root>
			<Popover.Trigger asChild>
				<MemoToolbarButton
					active={!!states.currentHighlight}
					tooltip="Highlight text"
				>
					<DriveFileRenameOutlineIcon />
				</MemoToolbarButton>
			</Popover.Trigger>
			<Popover.Content side="top" sideOffset={8} asChild>
				<MemoColorPicker
					color={states.currentHighlight}
					onChange={commands.onChangeHighlight}
					onClear={commands.onClearHighlight}
				/>
			</Popover.Content>
		</Popover.Root>
		<Popover.Root>
			<Popover.Trigger asChild>
				<MemoToolbarButton active={!!states.currentColor} tooltip="Text color">
					<ColorLensIcon />
				</MemoToolbarButton>
			</Popover.Trigger>
			<Popover.Content side="top" sideOffset={8} asChild>
				<MemoColorPicker
					color={states.currentColor}
					onChange={commands.onChangeColor}
					onClear={commands.onClearColor}
				/>
			</Popover.Content>
		</Popover.Root>
		<Popover.Root>
			<Popover.Trigger asChild>
				<MemoToolbarButton tooltip="More options">
					<MoreVertIcon />
				</MemoToolbarButton>
			</Popover.Trigger>
			<Popover.Content side="top" asChild>
				<Box>
					<MemoToolbarButton
						tooltip="Subscript"
						tooltipShortcut={["Mod", "."]}
						onClick={commands.onSubscript}
						active={states.isSubscript}
					>
						<SubscriptIcon />
					</MemoToolbarButton>
					<MemoToolbarButton
						tooltip="Superscript"
						tooltipShortcut={["Mod", ","]}
						onClick={commands.onSuperscript}
						active={states.isSuperscript}
					>
						<SuperscriptIcon />
					</MemoToolbarButton>
					<Divider orientation="vertical" flexItem />
					<MemoToolbarButton
						tooltip="Align left"
						tooltipShortcut={["Shift", "Mod", "L"]}
						onClick={commands.onAlignLeft}
						active={states.isAlignLeft}
					>
						<FormatAlignLeftIcon />
					</MemoToolbarButton>
					<MemoToolbarButton
						tooltip="Align center"
						tooltipShortcut={["Shift", "Mod", "E"]}
						onClick={commands.onAlignCenter}
						active={states.isAlignCenter}
					>
						<FormatAlignCenterIcon />
					</MemoToolbarButton>
					<MemoToolbarButton
						tooltip="Align right"
						tooltipShortcut={["Shift", "Mod", "R"]}
						onClick={commands.onAlignRight}
						active={states.isAlignRight}
					>
						<FormatAlignRightIcon />
					</MemoToolbarButton>
					<MemoToolbarButton
						tooltip="Justify"
						tooltipShortcut={["Shift", "Mod", "J"]}
						onClick={commands.onAlignJustify}
						active={states.isAlignJustify}
					>
						<FormatAlignJustifyIcon />
					</MemoToolbarButton>
				</Box>
			</Popover.Content>
		</Popover.Root>
	</Box>
}

export const TextMenu = ({ editor }: TextMenuProps) => {
	const states = useTextmenuStates(editor);

	return (
		<BubbleMenu
			tippyOptions={{
				popperOptions: {
					placement: "top-start",
					modifiers: [
						{
							name: "preventOverflow",
							options: {
								boundary: "viewport",
								padding: 8,
							},
						},
						{
							name: "flip",
							options: {
								fallbackPlacements: ["bottom-start", "top-end", "bottom-end"],
							},
						},
					],
				},
				maxWidth: "calc(100vw - 16px)",
			}}
			editor={editor}
			pluginKey="textMenu"
			shouldShow={states.shouldShow}
			updateDelay={100}
		>
			<TextMenuInner editor={editor} />
		</BubbleMenu>
	);
};
