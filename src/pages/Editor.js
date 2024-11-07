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
import { Paper, Text } from "@mantine/core";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { Header } from 'components';
import AnnotationsListingPlugin from 'editors/plugins/AnnotationsListingPlugin';

function Editor() {
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
		<div className='flex flex-col min-h-screen'>
			<Header />
			<LexicalComposer initialConfig={initialConfig}>
				<div className="flex flex-row">
					<div className="flex-1">
						<ToolbarPlugin />
						<Paper className={"container"} p="md">
							<RichTextPlugin
								contentEditable={<ContentEditable className={"contentEditable !h-[80vh]"} />}
								placeholder={<Text className={"placeholder"}>Enter some text...</Text>}
							/>
							<AnnotationPlugin />
							<AnnotationCountPlugin className="absolute left-8 top-5" />
							<ListPlugin />
							<LinkPlugin />
							<HistoryPlugin />
						</Paper>
					</div>
					<div className="w-1/4">
						<AnnotationsListingPlugin />
					</div>
				</div>
			</LexicalComposer>
		</div>
	);
}

export default Editor;
