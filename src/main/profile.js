import { ipcMain, BrowserWindow } from 'electron'

let profileWindow
export function createProfileWindowHandler () {
  if (profileWindow) {
    return
  }
  const profileUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/profile`
    : `file://${__dirname}/index.html?page=profile`
  if (!profileWindow) {
    profileWindow = new BrowserWindow({
      height: 440,
      width: 440,
      x: 50,
      y: 100,
      modal: true,
      show: true,
      transparent: true,
      alwaysOnTop: true,
      // resizable: false,
      backgroundColor: '#00ffffff',
      frame: false,
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true, // 是否集成 Nodejs
        webSecurity: false
      },
      id: 'profile'
    })
  }
  profileWindow.on('close', (event) => {
    // menuWindow = null
    if (profileWindow) {
      profileWindow.hide()
    }
    event.preventDefault()
  })
  profileWindow.loadURL(profileUrl)
}

export function createProfileWindow () {
  if (!profileWindow) {
    createProfileWindowHandler()
  }
}

export function showProfileWindow (args) {
  if (!profileWindow) {
    createProfileWindowHandler()
  }

  profileWindow.show()
  profileWindow.setBounds({
    width: 400,
    height: 400
  })
  setTimeout(() => {
    profileWindow.webContents.send('change-query', args)
  }, 20)
}

export function hideProfileWindow () {
  if (profileWindow) {
    profileWindow.hide()
    // profileWindow.setBounds({
    //   width: 0,
    //   height: 0
    // })
  }
}

ipcMain.on('show-profile', (event, args) => {
  showProfileWindow(args)
})
ipcMain.on('hide-profile', () => {
  hideProfileWindow()
})

