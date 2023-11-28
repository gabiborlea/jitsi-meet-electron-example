// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');
const { SCREEN_SHARE_GET_SOURCES } = require('./constants');

contextBridge.exposeInMainWorld('jitsiAPI', {
  getDesktopSources: (options) => ipcRenderer.invoke(SCREEN_SHARE_GET_SOURCES, options)
})