import { TextNode } from 'lexical';

class AnnotationNode extends TextNode {

	static getType() {
		return 'annotation';
	}

	static clone(node) {
		return new AnnotationNode(node.__text, node.__annotations, node.__key);
	}

	constructor(text, annotations = [], key) {
		super(text, key);
		this.__annotations = annotations;
	}

	createDOM() {
		const dom = document.createElement('span');
		dom.textContent = this.__text;
		dom.className = 'annotation-wrapper relative';

		const initialState = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : undefined
		const filteredAnnotions = initialState?.filter(item => item.type === 'annotation');
		const commonAnnotations = filteredAnnotions?.find(item => item.annotations[0].annotationText.includes(this.__text));
		const commonAnnotation = commonAnnotations?.annotations?.[0]?.color;

		if (this.__annotations?.[0]?.isMarker) {
			const userMarker = this._createUserMarker();
			dom.appendChild(userMarker);
		}

		this.__annotations.forEach((annotation, index) => {
			const annotationLayer = this._createAnnotationLayer(annotation, index, commonAnnotation);
			dom.appendChild(annotationLayer);
		});

		return dom;
	}

	_createUserMarker() {
		const userMarker = document.createElement('span');
		userMarker.textContent = this.__annotations[0]?.user.charAt(0) || 'U';
		userMarker.className = 'user-marker';
		userMarker.title = this.__annotations[0]?.user;
		Object.assign(userMarker.style, {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '30px',
			height: '30px',
			borderRadius: '50%',
			backgroundColor: this.__annotations[0].color,
			color: 'white',
			fontWeight: 'bold',
			marginLeft: '4px',
			fontSize: '14px',
			lineHeight: '1',
			position: 'absolute',
			top: '-30px',
			left: '-13%',
			transform: 'translateX(4px)',
			zIndex: '1000',
		});
		return userMarker;
	}

	_createAnnotationLayer(annotation, index, commonAnnotation) {
		const annotationLayer = document.createElement('span');
		annotationLayer.className = 'annotation-layer absolute inset-0 pointer-events-none';

		Object.assign(annotationLayer.style, {
			position: 'absolute',
			left: commonAnnotation ? '-4px' : '-2px',
			right: commonAnnotation ? '-4px' : '-2px',
			top: '-1px',
			bottom: '-1px',
			borderTop: `2px solid ${commonAnnotation || annotation.color}`,
			borderBottom: `2px solid ${commonAnnotation || annotation.color}`,
			borderLeft: `2px solid ${annotation.color}`,
			borderRight: `2px solid ${commonAnnotation || annotation.color}`,
			zIndex: commonAnnotation ? index + 2 : index + 1,
			padding: '10px',
			transition: 'all 0.2s ease',
		});

		if (annotation.comment) {
			annotationLayer.title = annotation.comment;
		}
		return annotationLayer;
	}

	exportJSON() {
		return {
			...super.exportJSON(),
			annotations: this.__annotations,
			type: 'annotation',
			version: 1,
		};
	}

	static importJSON(serializedNode) {
		const node = new AnnotationNode(
			serializedNode.text,
			serializedNode.annotations,
			serializedNode.key
		);
		node.setFormat(serializedNode.format);
		node.setDetail(serializedNode.detail);
		node.setMode(serializedNode.mode);
		return node;
	}

	addAnnotation(annotation) {
		const self = this.getWritable();
		self.__annotations.push(annotation);
	}

}

export default AnnotationNode;
