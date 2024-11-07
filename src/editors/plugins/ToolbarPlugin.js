import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	ActionIcon,
	ColorPicker,
	Divider,
	Group,
	Menu,
	Popover,
	Text,
	TextInput,
} from "@mantine/core";
import {
	IconAlignLeft2,
	IconAt,
	IconBold,
	IconCode,
	IconItalic,
	IconLink,
	IconList,
	IconListNumbers,
	IconMoodSmile,
	IconPaperclip,
	IconPencil,
	IconSquareFilled,
	IconStrikethrough,
	IconUnderline,
} from "@tabler/icons-react";
import {
	$createTextNode,
	$insertNodes,
	SELECTION_CHANGE_COMMAND,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_LOW,
	$isTextNode,
} from "lexical";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { useCallback, useEffect, useState } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isCodeNode } from "@lexical/code";
import { mergeRegister } from "@lexical/utils";
import { useDisclosure } from "@mantine/hooks";
import Picker from "@emoji-mart/react";
import { HeadingPlugin } from "./HeadingPlugin";
import CodeBlockPlugin from "./CodeBlockPlugin";
import { FloatingMenuPlugin } from "lexical-floating-menu";
import { FloatingLinkEditorPlugin } from "./FloatingLinkEditorPlugin";
import { getSelectedNode } from "Utilities";
import { useFormatText } from "hooks/useFormatText";

const BasicColors = [
	"#2e2e2e",
	"#868e96",
	"#fa5252",
	"#e64980",
	"#be4bdb",
	"#7950f2",
	"#4c6ef5",
	"#228be6",
	"#15aabf",
	"#12b886",
	"#40c057",
	"#82c91e",
	"#fab005",
	"#fd7e14",
];

export function ToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const [isLink, { open: floatingLinkOpen, close: floatingLinkClose }] = useDisclosure();
	const [opened, { open, close }] = useDisclosure(false);
	const [fontColor, setFontColor] = useState("#000000");
	const { handleFormatText } = useFormatText();
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const [isCodeBlock, setIsCodeBlock] = useState(false);
	const [isBold, setBold] = useState(false);
	const [isItalic, setItalic] = useState(false);
	const [isUnderline, setUnderline] = useState(false);
	const [isStrikethrough, setStrikethrough] = useState(false);
	const [isCode, setCode] = useState(false);
	const [activeKey, setActiveKey] = useState(null);

	const handleButtonClick = (event) => {
		const type = event.currentTarget.getAttribute("data-format-type");
		if (typeof type === "string") {
			handleFormatText(type);
		}
	};

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection) === true) {
			const node = getSelectedNode(selection);
			setBold(selection.hasFormat("bold"));
			setItalic(selection.hasFormat("italic"));
			setUnderline(selection.hasFormat("underline"));
			setStrikethrough(selection.hasFormat("strikethrough"));
			setCode(selection.hasFormat("code"));
			setFontColor($getSelectionStyleValueForProperty(selection, "color", "#000"));

			const parent = node.getParent();
			if ($isCodeNode(parent) === true || $isCodeNode(node) === true) {
				setIsCodeBlock(true);
			} else {
				setIsCodeBlock(false);
			}
			if ($isLinkNode(parent) === true || $isLinkNode(node) === true) {
				floatingLinkOpen();
			} else {
				floatingLinkClose();
			}
			setIsCommentVisible(selection.getTextContent().length !== 0);
		} else {
			floatingLinkClose();
		}
	}, [editor]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
				});
				editorState.read(() => {
					const selection = $getSelection();
					if ($isRangeSelection(selection) === true) {
						const selectedNode = selection.anchor.getNode();
						if ($isTextNode(selectedNode) === true) {
							if (selection.isCollapsed() === false) {
								setActiveKey(selectedNode.getKey());
							} else {
								setActiveKey(null);
							}
						}
					} else {
						setActiveKey(null);
					}
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateToolbar();
					return true;
				},
				COMMAND_PRIORITY_LOW,
			),
		);
	}, [editor, updateToolbar]);

	const handleInsertLink = useCallback(() => {
		if (isLink === false) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [editor, isLink]);

	const handleEmojiSelect = (emoji) => {
		editor.update(() => {
			$insertNodes([$createTextNode(emoji.native)]);
		});
		close();
	};

	const handleInsertAt = () => {
		editor.update(() => {
			$insertNodes([$createTextNode("@")]);
		});
	};

	const applyStyleText = useCallback(
		(styles) => {
			editor.update(() => {
				const selection = $getSelection();
				if (selection !== null) {
					$patchStyleText(selection, styles);
				}
			});
		},
		[editor],
	);

	const handleFontColorSelect = useCallback(
		(value) => {
			setFontColor(value);
			applyStyleText({ color: value });
		},
		[applyStyleText],
	);

	return (
		<Group justify="space-between" p="sm" className="bg-lightgray">
			{isCodeBlock === false ? (
				<>
					<Group gap="xs">
						<ActionIcon
							size="xs"
							variant={isBold === true ? "light" : "transparent"}
							data-format-type="bold"
							onClick={handleButtonClick}
							aria-label="Format bold"
						>
							<IconBold />
						</ActionIcon>
						<ActionIcon
							size="xs"
							variant={isItalic === true ? "light" : "transparent"}
							data-format-type="italic"
							onClick={handleButtonClick}
							aria-label="Format italics"
						>
							<IconItalic />
						</ActionIcon>
						<ActionIcon
							size="xs"
							variant={isUnderline === true ? "light" : "transparent"}
							data-format-type="underline"
							onClick={handleButtonClick}
							aria-label="Format underline"
						>
							<IconUnderline />
						</ActionIcon>
						<ActionIcon
							size="xs"
							variant={isStrikethrough === true ? "light" : "transparent"}
							data-format-type="strikethrough"
							onClick={handleButtonClick}
							aria-label="Format strikethrough"
						>
							<IconStrikethrough />
						</ActionIcon>
						<Divider orientation="vertical" />
						<HeadingPlugin />
						<Divider orientation="vertical" />
						<ActionIcon
							size="xs"
							variant="transparent"
							aria-label="Format number list"
							data-format-type="number"
							onClick={handleButtonClick}
						>
							<IconListNumbers />
						</ActionIcon>
						<ActionIcon
							size="xs"
							variant="transparent"
							aria-label="Format bullet list"
							data-format-type="bullet"
							onClick={handleButtonClick}
						>
							<IconList />
						</ActionIcon>
						<ActionIcon
							size="xs"
							variant="transparent"
							aria-label="Text align left"
							data-format-type="left"
							onClick={handleButtonClick}
						>
							<IconAlignLeft2 />
						</ActionIcon>
						<Divider orientation="vertical" />
						<ActionIcon
							size="xs"
							variant={isCode === true ? "light" : "transparent"}
							data-format-type="code"
							onClick={handleButtonClick}
							aria-label="Format code"
						>
							<IconCode />
						</ActionIcon>
						<ActionIcon
							size="xs"
							variant={isLink === true ? "light" : "transparent"}
							aria-label="Insert link"
							onClick={handleInsertLink}
						>
							<IconLink />
						</ActionIcon>
						{isLink === true ? (
							<FloatingMenuPlugin MenuComponent={FloatingLinkEditorPlugin} />
						) : null}
						{/* TODO: Update Create portal */}
						<CodeBlockPlugin showDropdown={isCodeBlock} />
						<Divider orientation="vertical" />
						<Menu>
							<Menu.Target>
								<ActionIcon c={fontColor} size="xs" variant="transparent" aria-label="Text color">
									<IconSquareFilled />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								{/* TODO: Add onChange */}
								<ColorPicker
									size="xs"
									swatches={BasicColors}
									value={fontColor}
									onChange={handleFontColorSelect}
								/>
							</Menu.Dropdown>
						</Menu>
						{/* TODO: handle change */}
						<ActionIcon size="xs" variant="transparent">
							<IconPencil />
						</ActionIcon>
					</Group>
					<Group gap="xs">
						<TextInput size="xs" w={40} defaultValue={11} />/{/* TODO: replace with total page */}
						<Text>13</Text>
					</Group>
					<Group>
						<ActionIcon
							size="xs"
							variant="transparent"
							aria-label="Mentions"
							onClick={handleInsertAt}
						>
							<IconAt />
						</ActionIcon>
						<Popover opened={opened} onClose={close} shadow="md">
							<Popover.Target>
								<ActionIcon variant="transparent" size="xs" onClick={open}>
									<IconMoodSmile />
								</ActionIcon>
							</Popover.Target>
							<Popover.Dropdown>
								<Picker onEmojiSelect={handleEmojiSelect} previewPosition="none" />
							</Popover.Dropdown>
						</Popover>
						<ActionIcon size="xs" variant="transparent" aria-label="Attachments">
							<IconPaperclip />
						</ActionIcon>
					</Group>
				</>
			) : (
				<CodeBlockPlugin showDropdown={isCodeBlock} />
			)}
		</Group>
	);
}
