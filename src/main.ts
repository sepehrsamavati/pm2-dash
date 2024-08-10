import { app, BrowserView, BrowserWindow } from "electron";
import Application from "./server/Application";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadFile('../public/index.html');

    new Application().initialize().start();
}

app.whenReady().then(() => {
    createWindow();
});
