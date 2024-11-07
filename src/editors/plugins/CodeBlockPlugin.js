import { useCallback, useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { registerCodeHighlighting, $createCodeNode, getCodeLanguages } from "@lexical/code";
import { $getSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { ActionIcon, Group, Select, ThemeIcon } from "@mantine/core";
import { IconChevronDown, IconFileCode } from "@tabler/icons-react";

export default function CodeBlockPlugin({ showDropdown }) {
	const [editor] = useLexicalComposerContext();
	const languages = useMemo(getCodeLanguages, []);
	const [language, setLanguage] = useState("javascript");

	useEffect(() => {
		registerCodeHighlighting(editor);
	}, [editor]);

	const handleAddCodeBlock = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			if (selection !== null) {
				const codeNode = $createCodeNode();
				codeNode.setLanguage(language ?? "javascript");
				if (selection.isCollapsed() === true) {
					$setBlocksType(selection, () => {
						return codeNode;
					});
				} else {
					const textContent = selection.getTextContent();
					selection.insertNodes([codeNode]);
					selection.insertRawText(textContent);
				}
			}
		});
	}, [editor]);

	const handleLanguageChange = (value) => {
		setLanguage(value);
		if (typeof value === "string") {
			editor.update(() => {
				const selection = $getSelection();
				if (selection !== null && selection.isCollapsed() === true) {
					const codeNode = $createCodeNode();
					codeNode.setLanguage(value);
					$setBlocksType(selection, () => codeNode);
				}
			});
		}
	};

	return (
		<Group justify="space-between">
			<ActionIcon
				size="sm"
				variant="transparent"
				aria-label="Format code block"
				onClick={handleAddCodeBlock}
			>
				<IconFileCode />
			</ActionIcon>
			{showDropdown === true ? (
				<Select
					variant="unstyled"
					data={languages}
					value={language}
					rightSection={
						<ThemeIcon variant="transparent" size="sm">
							<IconChevronDown />
						</ThemeIcon>
					}
					w={120}
					placeholder="Select language"
					onChange={handleLanguageChange}
					allowDeselect={false}
				/>
			) : null}
		</Group>
	);
}
