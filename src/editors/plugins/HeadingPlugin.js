import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $createParagraphNode } from "lexical";
import { Select, ThemeIcon } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

const Headings = [
	{ value: "p", label: "Normal" },
	{ value: "h1", label: "Heading 1" },
	{ value: "h2", label: "Heading 2" },
	{ value: "h3", label: "Heading 3" },
	{ value: "h4", label: "Heading 4" },
	{ value: "h5", label: "Heading 5" },
	{ value: "h6", label: "Heading 6" },
];

export function HeadingPlugin() {
	const [editor] = useLexicalComposerContext();

	const handleFormatHeading = (headingSize) => {
		editor.update(() => {
			const selection = $getSelection();
			if (headingSize === "p") {
				$setBlocksType(selection, $createParagraphNode);
			} else {
				$setBlocksType(selection, () => $createHeadingNode(headingSize));
			}
		});
	};

	return (
		<Select
			variant="unstyled"
			pointer={true}
			placeholder="Select heading"
			data={Headings}
			defaultValue="p"
			onChange={handleFormatHeading}
			rightSection={
				<ThemeIcon variant="transparent">
					<IconChevronDown />
				</ThemeIcon>
			}
			w={120}
			allowDeselect={false}
		/>
	);
}
