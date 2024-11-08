import { createBrowserHistory } from 'history';
import axios from 'axios';
import { store } from './Store';
import { toast } from 'react-toastify';
import { $isAtNodeEnd } from "@lexical/selection";

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use(
	async (config) => {
		const token = store.getState()?.auth?.user?.accessToken || '';
		if (token) config.headers.Authorization = `${token}`;
		return config;
	},
	(err) => {
		return Promise.reject(err);
	},
);

export default instance;

export const history = createBrowserHistory();

export const requestStart = (loaderName) => {
	store.dispatch(CoreActions.loaderActivate(loaderName));
};

export const requestError = (loaderName, message) => {
	store.dispatch(CoreActions.loaderDeactivate(loaderName));
	if (message) toast.error(message);
};

export const requestSuccess = (loaderName, message) => {
	store.dispatch(CoreActions.loaderDeactivate(loaderName));
	if (message) toast.success(message);
};

export const showToast = (message, type) => {
	if (type === 'error') toast.error(message);
	if (type === 'success') toast.success(message);
};

export function getSelectedNode(selection) {
	const { anchor, focus } = selection;
	const anchorNode = anchor.getNode();
	const focusNode = focus.getNode();
	let output;
	if (anchorNode === focusNode) {
		output = anchorNode;
	} else {
		const isBackward = selection.isBackward();
		if (isBackward === true) {
			output = $isAtNodeEnd(focus) ? anchorNode : focusNode;
		} else {
			output = $isAtNodeEnd(anchor) ? focusNode : anchorNode;
		}
	}
	return output;
}

export function positionEditorElement(editorElement, rect) {
	if (editorElement !== null && rect !== null) {
		editorElement.style.opacity = "1";
		editorElement.style.top = `${(rect.top + rect.height + window.scrollY + 10).toString()}px`;
		editorElement.style.left = `${(rect.left + window.scrollX - editorElement.offsetWidth / 2 + rect.width / 2).toString()}px`;
	}
}

export const generateRandomUsername = () => {
	const adjectives = ['Quick', 'Brave', 'Wise', 'Clever', 'Happy'];
	const nouns = ['Tiger', 'Eagle', 'Lion', 'Shark', 'Panda'];
	const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${randomAdjective}${randomNoun}${Math.floor(Math.random() * 100)}`;
};