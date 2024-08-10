"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Application_1 = __importDefault(require("./server/Application"));
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadFile('../public/index.html');
    new Application_1.default().initialize().start();
};
electron_1.app.whenReady().then(() => {
    createWindow();
});
