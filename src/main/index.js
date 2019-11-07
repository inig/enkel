import { app, BrowserWindow, ipcMain, dialog, systemPreferences } from 'electron'
import { hidden } from 'ansi-colors'

import path from 'path'
// if (process.mas) app.setName('Enkel')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let menuWindow

let menuWindowNormalBounds = {}
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  // systemPreferences.promptTouchID('登录Enkel').then(success => {
  //   dialog.showMessageBox({
  //     message: '成功'
  //   })
  // }).catch(err => {
  //   dialog.showMessageBox({
  //     message: '失败: ' + err.message
  //   })
  // })
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })

  mainWindow.loadURL(winURL)

  // initMenu()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })

  mainWindow.on('blur', () => {
    // dialog.showMessageBox({
    //   message: 'blur'
    // })
  })

  // mainWindow.setAspectRatio({
  //   aspectRatio: 0.56
  // })
}

function createMenuWindow () {
  menuWindow = new BrowserWindow({
    height: 667,
    width: 375,
    // titleBarStyle: 'hidden',
    // modal: true,
    // parent: mainWindow,
    frame: false,
    show: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: true,
    backgroundColor: '#00ffffff',
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })

  const menuURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/menu`
    : `file://${__dirname}/index.html/#/menu`

  menuWindow.loadURL(menuURL)

  menuWindow.on('close', (event) => {
    // menuWindow = null
    if (menuWindow) {
      menuWindow.hide()
    }
    event.preventDefault()
  })

  menuWindow.on('blur', (event) => {
    // let displays = screen.getAllDisplays()
    // let externalDisplay = displays.find((display) => {
    //   return display.bounds.x !== 0 || display.bounds.y !== 0
    // })
    // if (externalDisplay) {
    //   dialog.showMessageBox({
    //     message: JSON.stringify(screen)
    //   })
    // }


  })

  // menuWindow.setClosable(false)
  menuWindow.setFullScreenable(false)
  // menuWindow.setMinimizable(false)
  menuWindow.setMaximizable(false)

}

function minimizeMenuWindow () {
  menuWindowNormalBounds = menuWindow.getNormalBounds()
  menuWindow.setBounds({
    x: 20,
    y: 20,
    height: 48,
    width: 48
  }, true)
}

function restoreMenuWindow () {
  menuWindow.setBounds(menuWindowNormalBounds, true)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('open-menu', (event, arg) => {
  console.log('【open-menu】', arg)
  if (!menuWindow) {
    createMenuWindow()
  }
  menuWindow.show()

  event.returnValue = 'opened'
})

ipcMain.on('close-menu', (event, arg) => {
  if (menuWindow) {
    menuWindow.hide()
  }
})

ipcMain.on('set-bounds', (event, arg) => {
  if (menuWindow) {

    // dialog.showMessageBox({
    //   message: JSON.stringify(arg)
    // })
    menuWindow.setBounds(arg, true)
  }
})

ipcMain.on('menu-fold', (event) => {
  minimizeMenuWindow()
  event.reply('menu-folded')
})
ipcMain.on('menu-unfold', (event) => {
  restoreMenuWindow()
  event.reply('menu-unfolded')
})

ipcMain.on('navigate-to', (event, arg) => {
  mainWindow.webContents.send('navigate-to', arg)
  mainWindow.showInactive()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
