import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND } from "lexical";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { useCallback, useMemo, useState } from "react";

export function useFormatText() {
	const [editor] = useLexicalComposerContext();
	const [blockType, setBlockType] = useState("paragraph");
	const handleFormatText = useCallback(
		(formatType) => {
			switch (formatType) {
				case "bold":
				case "italic":
				case "underline":
				case "strikethrough":
				case "code":
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
					break;
				case "number":
					if (blockType === "number") {
						editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
						setBlockType("paragraph");
					} else {
						editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
						setBlockType("number");
					}
					break;
				case "bullet":
					if (blockType === "bullet") {
						editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
						setBlockType("paragraph");
					} else {
						editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
						setBlockType("bullet");
					}
					break;
				case "left":
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
					break;
				default:
					break;
			}
		},
		[editor],
	);
	const output = useMemo(() => {
		return { blockType, handleFormatText };
	}, [blockType, handleFormatText]);
	return output;
}
