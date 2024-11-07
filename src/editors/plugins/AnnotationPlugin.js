import { $getSelection } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import AnnotationNode from '../nodes/AnnotationNode';
import { generateRandomUsername } from 'Utilities';
import { ActionIcon, Card } from "@mantine/core";
import { IconMessageCirclePlus } from "@tabler/icons-react";

function AnnotationPlugin() {
	const [editor] = useLexicalComposerContext();
	const [annotations, setAnnotations] = useState([]);
	const [isComment, setIsComment] = useState(false);
	const [currentAnnotation, setCurrentAnnotation] = useState({
		annotationText: '',
		comment: '',
		color: '#9333EA',
		user: 'User1',
	});

	const getEditorState = useCallback(async () => {
		editor.update(() => {
			const editorState = editor.getEditorState();
			const serializedState = editorState.toJSON();
			console.log("Editor State:", serializedState);
		});
	}, [editor]);

	useEffect(() => {
		if (!editor.hasNodes([AnnotationNode])) {
			throw new Error('AnnotationNode not registered on editor');
		}

		const addAnnotation = () => {
			editor.update(() => {
				const selection = $getSelection();

				console.log("NODE ==>>", selection.extract())

				if (selection && !selection.isCollapsed()) {
					const nodes = selection.extract();

					const concatenatedText = nodes.map(node => node.__text).join('');
					var isMarker = true

					console.log("concatenatedText ==>>", concatenatedText);

					nodes.forEach((node) => {
						const nodeType = node.getType()
						if (nodeType === 'text') {
							const editorState = editor.getEditorState();
							const serializedState = editorState.toJSON();
							const textContent = node.getTextContent();
							localStorage.setItem('data', JSON.stringify(serializedState?.root?.children?.[0]?.children))
							const annotationsArr = [{ ...currentAnnotation, annotationText: concatenatedText, isMarker }]
							const annotationNode = new AnnotationNode(textContent, annotationsArr);
							node.replace(annotationNode);
							isMarker = false
						} else if (nodeType === 'annotation') {
							node.addAnnotation({ ...currentAnnotation, annotationText: concatenatedText });
						}
					});
				}
			});
		};

		getEditorState();

		return editor.registerCommand('ADD_ANNOTATION', () => {
			addAnnotation();
			return true;
		}, 0);
	}, [editor, currentAnnotation, getEditorState]);

	const handleAnnotateClick = () => {
		if (currentAnnotation.comment) {
			const randomUser = generateRandomUsername();
			editor.dispatchCommand('ADD_ANNOTATION', undefined);

			setAnnotations([...annotations, currentAnnotation]);
			setCurrentAnnotation((prev) => ({
				...prev,
				comment: '',
				user: randomUser,
			}));
			setIsComment(false)
		}
	};

	return (
		<>
			<div className='comment-card'>
				<Card pos="fixed" p="sm" radius="xl" withBorder>
					<ActionIcon mb="sm" radius="lg">
						<IconMessageCirclePlus onClick={() => setIsComment(true)} />
					</ActionIcon>
					<IconMessageCirclePlus onClick={() => console.log("DDD")} />
				</Card>
			</div>
			{isComment &&
				<div className="annotation-controls">
					<div className="annotation-row">
						<input
							type="text"
							placeholder="Add comment"
							value={currentAnnotation.comment}
							onChange={(e) => setCurrentAnnotation(prev => ({
								...prev,
								comment: e.target.value
							}))}
							className="annotation-input"
						/>
						<input
							type="color"
							value={currentAnnotation.color}
							onChange={(e) => setCurrentAnnotation(prev => ({
								...prev,
								color: e.target.value
							}))}
							className="color-picker"
						/>
					</div>
					<button
						onClick={handleAnnotateClick}
						className="annotation-button"
						disabled={!currentAnnotation.comment}
					>
						Add Annotation
					</button>
				</div>
			}
		</>
	);
}

export default AnnotationPlugin;
