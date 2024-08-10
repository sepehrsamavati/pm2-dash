import url from "node:url";
import path from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        darkTheme: true,
        webPreferences: {
            preload: path.join(__dirname, 'clientPreload.js'),
        }
    });

    // mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

    mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
    ipcMain.on('set-title', (event, title) => {
        console.log(title)
    });
    createWindow();
});
