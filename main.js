const electron				= require('electron');
const {app, BrowserWindow}	= electron;

let mainWindow = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		'minWidth':		800,
		'minHeight':	500,
		title:			'Socket.io tester'
	});

	mainWindow.loadURL('file://' + __dirname + '/index.html');

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('ready', createWindow);

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
