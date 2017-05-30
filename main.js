const electron = require('electron');
const path = require('path');
const url = require('url');

const { app, BrowserWindow } = electron;

let mainWindow = null;

/**
 * Create the Window of the program.
 */
function createWindow() {
	mainWindow = new BrowserWindow({
		minWidth:  800,
		minHeight: 500,
		title:     'Socket.io tester',
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes:  true,
	}));

	mainWindow.setMenu(null);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
