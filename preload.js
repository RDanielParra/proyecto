/*const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInIsolatedWorld('api', {
  onUpdateTheme: (callback) => ipcRenderer.on('update-theme', callback)
})*/
// preload.js (CÓDIGO CORREGIDO)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {  
      onUpdateTheme: (callback) => {
        const channel = 'update-theme'
        const listener = (event, ...args) => callback(event,...args)
        ipcRenderer.on(channel, listener)
    }
})