import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import AnnotationCountPlugin from 'editors/plugins/AnnotationCountPlugin';
import AnnotationPlugin from 'editors/plugins/AnnotationPlugin';
import AnnotationNode from 'editors/nodes/AnnotationNode';
import { ToolbarPlugin } from 'editors/plugins/ToolbarPlugin';
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HeadingNode } from "@lexical/rich-text";
import { BeautifulMentionNode } from "lexical-beautiful-mentions";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { Box, Container, Paper, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { Header } from 'components';
import AnnotationsListingPlugin from 'editors/plugins/AnnotationsListingPlugin';

function Editor() {
	const { colors } = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const initialConfig = {
		namespace: 'MyEditor',
		theme: {},
		nodes: [
			ListNode,
			ListItemNode,
			BeautifulMentionNode,
			AutoLinkNode,
			LinkNode,
			HeadingNode,
			CodeNode,
			CodeHighlightNode,
			AnnotationNode
		],
		onError: (error) => console.log("ERROR:", error),
	};

	return (
		<div className='flex-col min-h-screen flex'>
			<Header />
			<Container className='flex flex-row flex-1  justify-between gap-10 w-full'>
				<div>
					<LexicalComposer initialConfig={initialConfig}>
						<ToolbarPlugin />
						<div className='relative'>
							<Box bg={colorScheme === "dark" ? colors.dark[5] : colors.blue[0]} p="xl">
								<Paper className={"container"} withBorder p="md">
									<RichTextPlugin
										contentEditable={<ContentEditable className={"contentEditable !h-[50vh]"} />}
										placeholder={<Text className={"placeholder"}>Enter some text...</Text>}
									/>
								</Paper>
							</Box>
							<AnnotationPlugin />
							<AnnotationCountPlugin className="absolute left-8 top-5" />
						</div>
						<ListPlugin />
						<LinkPlugin />
						<HistoryPlugin />
					</LexicalComposer>
				</div>
				<AnnotationsListingPlugin />
			</Container>
		</div >
	);
}

export default Editor;