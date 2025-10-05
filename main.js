const { app, BrowserWindow, ipcMain } = require('electron')
const { setMainMenu } = require('./Menu.js')
const path = require('path')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  setMainMenu(mainWindow)
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})