import { useState, useCallback } from "react";
import { Group, ActionIcon, TextInput, Anchor, Card } from "@mantine/core";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getSelection, $isRangeSelection } from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useDisclosure } from "@mantine/hooks";
import { getSelectedNode } from "Utilities";

export function FloatingLinkEditorPlugin({ editor }) {
	const [linkURL, setLinkURL] = useState("");
	const [isEditMode, { open: startEditing, close: stopEditing }] = useDisclosure(false);

	const handleInputChange = (event) => {
		setLinkURL(event.currentTarget.value);
	};

	const handleInputKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			if (linkURL !== "") {
				editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkURL);
			} else {
				editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
			}
			stopEditing();
		}
	};

	const updateLinkEditor = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection) === true) {
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			if ($isLinkNode(parent) === true) {
				setLinkURL(parent.getURL());
			} else if ($isLinkNode(node) === true) {
				setLinkURL(node.getURL());
			} else {
				setLinkURL("");
			}
		}
	}, []);

	const handleEditorChange = useCallback(
		(editorState) => {
			editorState.read(updateLinkEditor);
		},
		[updateLinkEditor],
	);

	const handleConfirmLink = () => {
		if (linkURL.length > 0) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkURL);
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
		stopEditing();
	};

	const handleDeleteLink = () => {
		editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
	};

	return (
		<Card px="sm" py="xs" shadow="md" withBorder pos="absolute" mt={35}>
			<OnChangePlugin onChange={handleEditorChange} />
			{isEditMode === true ? (
				<Group wrap="nowrap" w={300}>
					<TextInput
						autoFocus
						value={linkURL}
						placeholder="Enter link URL"
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						w="80%"
					/>
					<ActionIcon onClick={handleConfirmLink} variant="transparent">
						<IconCheck />
					</ActionIcon>
					<ActionIcon onClick={handleDeleteLink} variant="transparent">
						<IconX />
					</ActionIcon>
				</Group>
			) : (
				<Group justify="space-between" wrap="nowrap">
					<Anchor href={linkURL} target="_blank" w={250} truncate>
						{linkURL}
					</Anchor>
					<ActionIcon onClick={startEditing} variant="transparent">
						<IconPencil />
					</ActionIcon>
				</Group>
			)}
		</Card>
	);
}
