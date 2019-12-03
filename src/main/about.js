import { ipcMain, BrowserWindow, dialog, screen } from 'electron'

let aboutWindow
function createAboutWindow () {
  const settingsUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/about`
    : `file://${__dirname}/index.html?page=about`
  if (!aboutWindow) {
    aboutWindow = new BrowserWindow({
      height: 200,
      width: 375,
      show: false,
      // resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      fullscreenable: false,
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true, // 是否集成 Nodejs
        webSecurity: false
      }
    })
  }
  aboutWindow.on('close', (event) => {
    // menuWindow = null
    if (aboutWindow) {
      aboutWindow.hide()
    }
    event.preventDefault()
  })
  aboutWindow.loadURL(settingsUrl)
}

export function showAboutWindow () {
  if (!aboutWindow) {
    createAboutWindow()
  }
  aboutWindow.show()
}

export function hideAboutWindow () {
  if (aboutWindow) {
    aboutWindow.hide()
  }
}

ipcMain.on('show-about', (event, args) => {
  showAboutWindow()
})
ipcMain.on('hide-about', () => {
  hideAboutWindow()
})
