const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    onUpdateTheme: (callback) => {
        const channel = 'update-theme'
        const listener = (event, ...args) => callback(event,...args)
        ipcRenderer.on(channel, listener)
    },

    getEmpleados: () => ipcRenderer.invoke('get-empleados'),

    verificarLogin: (usuario, contrasena) => ipcRenderer.invoke('verificar-login', usuario, contrasena),

    onNotificationMessage: (callback) => ipcRenderer.on('show-notification-message', (event, ...args) => callback(event, ...args)),

    sendNotification: (message) => ipcRenderer.send('show-notification-request', message)
})