const { app, BrowserWindow } = require('electron');
const { join } = require("path")

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadFile('./dist/index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainContents = mainWindow.webContents;
    mainContents.on("will-navigate", (e, url) => {
        e.preventDefault();
        mainWindow.loadURL(join(url, "index.html"))
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});

