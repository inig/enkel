import { ipcMain, BrowserWindow, dialog, screen } from 'electron'

let settingsWindow
function createSettingsWindow () {
  const settingsUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/settings`
    : `file://${__dirname}/index.html?page=settings`
  if (!settingsWindow) {
    settingsWindow = new BrowserWindow({
      height: 667,
      width: 375,
      modal: true,
      show: false,
      transparent: true,
      alwaysOnTop: true,
      backgroundColor: '#00ffffff',
      frame: false,
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true, // 是否集成 Nodejs
        webSecurity: false
      }
    })
  }
  settingsWindow.on('close', (event) => {
    // menuWindow = null
    if (settingsWindow) {
      settingsWindow.hide()
    }
    event.preventDefault()
  })
  settingsWindow.loadURL(settingsUrl)
}

export function showSettingsWindow () {
  if (!settingsWindow) {
    createSettingsWindow()
  }
  settingsWindow.show()
}

export function hideSettingsWindow () {
  if (settingsWindow) {
    settingsWindow.hide()
  }
}

ipcMain.on('show-settings', (event, args) => {
  showSettingsWindow()
})
ipcMain.on('hide-settings', () => {
  hideSettingsWindow()
})
