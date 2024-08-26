import path from "node:path";
import "../config/config.js";
import { app, BrowserWindow, ipcMain } from "electron";
import { initializeIpcHandlers } from "../handlers/ipc.js";

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 500,
        minHeight: 600,
        darkTheme: true,
        icon: path.join(app.getAppPath(), "./build/react-ui/icon.ico"),
        title: app.getName(),
        autoHideMenuBar: app.isPackaged,
        webPreferences: {
            preload: path.join(__dirname, '..', 'clientPreload.js'),
            devTools: !app.isPackaged,
        },
        show: false
    });

    if (app.isPackaged)
        mainWindow.removeMenu();

    ipcMain.on("showMainFrame", () => {
        mainWindow.show();
    });

    ipcMain.on("closeApp", () => {
        mainWindow.close();
        app.quit();
    });

    if (app.isPackaged)
        mainWindow.loadFile(path.join(app.getAppPath(), "./build/react-ui/index.html"));
    else
        mainWindow.loadURL("http://localhost:3000");
};

app.whenReady().then(() => {
    initializeIpcHandlers();
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
