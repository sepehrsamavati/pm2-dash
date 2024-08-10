import url from "node:url";
import path from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";
import Application from "./server/Application";

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'clientPreload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, "../public/index.html"))
        .then(() => mainWindow.show());

    // new Application().initialize().start();
}

app.whenReady().then(() => {
    ipcMain.on('set-title', (event, title) => {
        console.log(title)
    });
    createWindow();
});
