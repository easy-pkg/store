const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld(
    'electron',
    {
        close: () => ipcRenderer.send('close'),
        minimize: () => ipcRenderer.send('minimize'),
        login: () => ipcRenderer.send('login'),
        update: () => ipcRenderer.send('update')
    }
)