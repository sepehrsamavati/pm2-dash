import path from "node:path";
import "../config/config.js";
import "../config/ipcConfig.js";
import { app, BrowserWindow } from "electron";

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        darkTheme: true,
        webPreferences: {
            preload: path.join(__dirname, '..', 'clientPreload.js'),
        }
    });

    // mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

    mainWindow.loadURL("http://localhost:3000");
};

app.whenReady().then(() => {

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
