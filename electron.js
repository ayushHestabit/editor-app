const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const START_URL = 'http://localhost:8080';

const createWindow = async () => {
	const isDev = (await import('electron-is-dev')).default;

	// Get the primary display's work area size
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	let mainWindow = new BrowserWindow({
		title: "Margent",
		width: width,  // Set the window width to the display's width
		height: height, // Set the window height to the display's height
		icon: '',
		webPreferences: {
			nodeIntegration: false,
		},
	});

	const startUrl = isDev
		? START_URL
		: new URL(`file://${path.join(__dirname, '/../build/index.html')}`).toString();

	mainWindow.loadURL(startUrl);
	if (isDev) {
		mainWindow.webContents.openDevTools({ mode: 'right' });
	}
	mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
