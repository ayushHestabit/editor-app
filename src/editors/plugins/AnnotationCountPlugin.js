import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function AnnotationCountPlugin({ className }) {
	const [editor] = useLexicalComposerContext();
	const [annotationCounts, setAnnotationCounts] = useState({});
	const [hasAnnotations, setHasAnnotations] = useState(false);

	useEffect(() => {
		const calculateAnnotationCounts = () => {
			editor.update(() => {
				const editorState = editor.getEditorState();
				const serializedState = editorState.toJSON();
				const counts = {};
				const paragraphs = serializedState.root.children || [];
				paragraphs.forEach((paragraph) => {
					if (paragraph.type === 'paragraph') {
						const paragraphText = paragraph.children.map(item => item.text).join('');
						const uniqueAnnotationTexts = new Set();
						paragraph.children.forEach(item => {
							if (item.type === 'annotation') {
								item.annotations.forEach(annotation => {
									uniqueAnnotationTexts.add(annotation.annotationText);
								});
							}
						});
						counts[paragraphText] = uniqueAnnotationTexts.size;
					}
				});
				setAnnotationCounts(counts);
				setHasAnnotations(Object.values(counts).some(count => count > 0));
			});
		};

		const unregister = editor.registerUpdateListener(() => {
			calculateAnnotationCounts();
		});

		return () => {
			unregister();
		};
	}, [editor]);

	return (
		<div className={className}>
			{Object.entries(annotationCounts).map(([text, count]) => (
				<div key={text} className="annotation-count">
					{count > 0 && <span className="count-badge">{count}</span>}
				</div>
			))}
		</div>
	);
}

export default AnnotationCountPlugin;
