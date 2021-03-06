import { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog, clipboard, globalShortcut, screen, session, Notification } from 'electron'
// import { autoUpdater } from 'electron-updater'
import { screenshot } from './puppeteer'
import path from 'path'
import routes from './routes'
import os from 'os'
require('./request')
require('./npm')
const { showSettingsWindow, createSettingsWindow } = require('./settings')
const { showProfileWindow, createProfileWindow } = require('./profile')
const { showAboutWindow } = require('./about')
// require('./autoUpdate')
require('./video')
require('./flac')
require('./user')
// const { checkUpdate } = require('./autoUpdate')
// console.log('=======', !fs.existsSync(app.getAppPath() + path.sep + 'db.json'), app.getAppPath() + path.sep + 'db.json')
// if (!fs.existsSync(app.getAppPath() + path.sep + 'db.json')) {
//   fs.writeFileSync(app.getAppPath() + path.sep + 'db.json', '')
// }
const pkg = require('../../package.json')
// const puppeteer = require('puppeteer')

function initMenu () {
  const isMac = process.platform === 'darwin'
  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: pkg.name,
      submenu: [
        {
          label: '关于 ' + pkg.name,
          click: () => {
            showAboutWindow()
          }
        },
        { type: 'separator' },
        {
          label: '设置',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            showSettingsWindow()
          }
        },
        { type: 'separator' },
        {
          role: 'quit',
          label: '退出 ' + pkg.name
        }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: '编辑',
      submenu: [
        {
          role: 'undo',
          label: '撤销'
        },
        {
          role: 'redo',
          label: '重做'
        },
        { type: 'separator' },
        {
          role: 'cut',
          label: '剪切'
        },
        {
          role: 'copy',
          label: '复制'
        },
        {
          role: 'paste',
          label: '粘贴'
        },
        {
          role: 'close',
          label: '关闭'
        }
      ]
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
initMenu()

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
let menuWindowMinimumBounds = {}
let menuWindowStatus = 'normal' // normal; minimum
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
    show: true,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })
  mainWindow.loadURL(winURL)

  // initMenu()

  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show()
  // })

  mainWindow.on('closed', () => {
    mainWindow = null
    // app.quit()
  })
  // mainWindow.setAspectRatio(16 / 9)
}

function cookieValidate (loginBeforeOption, win, redirectUrl) {
  return new Promise((resolve) => {
    session.defaultSession.cookies.get({
      url: loginBeforeOption.url
    }).then(c => {
      let now = (new Date()).getTime()
      if (loginBeforeOption.cookies.every(item => c.some(itm => (itm.name === item) && (parseInt(itm.expirationDate * 1000) > now)))) {
        win.loadURL(redirectUrl)
      } else {
        win.loadURL(loginBeforeOption.url)
        win.webContents.executeJavaScript((loginBeforeOption.insert && loginBeforeOption.insert.js) ? loginBeforeOption.insert.js : '')
      }
      resolve()
    }).catch(err => {
      win.loadURL(loginBeforeOption.url)
      win.webContents.executeJavaScript((loginBeforeOption.insert && loginBeforeOption.insert.js) ? loginBeforeOption.insert.js : '')
      resolve()
    })
    win.webContents.on('will-navigate', (event) => {
      event.preventDefault()
    })
  })
}

async function cookieChanged (changedCookie, loginBeforeOption, win, redirectUrl) {
  if (loginBeforeOption.cookies.indexOf(changedCookie.name) > -1) {
    await cookieValidate(loginBeforeOption, win, redirectUrl)
  }
}

async function createNewWindow (arg, extraData) {
  let extraOptions = {}
  if (arg.id) {
    let targetWindows = BrowserWindow.getAllWindows().filter(item => (item.webContents.browserWindowOptions.id == arg.id))
    if (targetWindows.length > 0) {
      // 已经存在
      // targetWindows[0].setAlwaysOnTop(true)
      targetWindows[0].show()
      return
    } else {
      extraOptions.id = arg.id
    }
  }
  if (extraData && extraData.content && extraData.content.msg_body) {
    if (extraData.content.msg_body.id) {
      let id = extraData.content.msg_body.id
      let targetWindows = BrowserWindow.getAllWindows().filter(item => (item.webContents.browserWindowOptions.id == id))
      if (targetWindows.length > 0) {
        // 已经存在
        targetWindows[0].show()
        return
      } else {
        extraOptions.id = id
      }
    }

    if (extraData.content.msg_body.windowOption) {
      extraOptions = Object.assign({}, extraOptions, extraData.content.msg_body.windowOption)
    }
  }

  let windowCreateOption = Object.assign({
    height: 800,
    // useContentSize: true,
    width: 1200,
    titleBarStyle: 'hidden',
    show: false,
    frame: false,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      // preload: (arg.resources && arg.resources.js && (arg.resources.js.length > 0)) ? path.join(__dirname, `../renderer/assets/preload/js/${arg.resources.js[0]}`) : ''
      // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  }, arg.windowOption, extraOptions)

  let newWindow = new BrowserWindow(windowCreateOption)

  let url = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/${arg.path}`
    : `file://${__dirname}/index.html?page=${arg.path}`

  if (arg.pathQueryString) {
    if (url.indexOf('file://') === 0) {
      url += '&' + arg.pathQueryString
    } else {
      url += '?' + arg.pathQueryString
    }
  }

  if (arg.loginBefore && arg.loginBefore.url) {
    await cookieValidate(arg.loginBefore, newWindow, url)
    session.defaultSession.cookies.on('changed', async (evt, cookie, cause, removed) => {
      await cookieChanged(cookie, arg.loginBefore, newWindow, url)
    })
  } else {
    newWindow.loadURL(url)
  }
  // if (arg.resources) {
  //   let webContents = newWindow.webContents
  //   webContents.executeJavaScript(`var dynamicLoading={css:function(path){if(!path||path.length===0){throw new Error('argument "path" is required !')}var head=document.getElementsByTagName("head")[0];var link=document.createElement("link");link.href=path;link.rel="stylesheet";link.type="text/css";head.appendChild(link)},js:function(path){if(!path||path.length===0){throw new Error('argument "path" is required !')}var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.src=path;script.type="text/javascript";head.appendChild(script)}};`)
  //   if (arg.resources.css && arg.resources.css.length > 0) {
  //     let j = 0
  //     for (j; j < arg.resources.css.length; j++) {
  //       webContents.executeJavaScript(`dynamicLoading.css("${arg.resources.css[j]}")`, true)
  //     }
  //   }
  //   if (arg.resources.js && arg.resources.js.length > 0) {
  //     let i = 0
  //     for (i; i < arg.resources.js.length; i++) {
  //       webContents.executeJavaScript(`dynamicLoading.js("${arg.resources.js[i]}")`, true)
  //     }
  //   }
  // }



  newWindow.on('closed', (event) => {
    if (arg.eternally) {
      newWindow.hide()
      event.preventDefault()
    } else {
      newWindow.destroy()
    }
  })

  newWindow.once('ready-to-show', () => {
    newWindow.show()

    if (extraData) {
      newWindow.webContents.send('init-data', extraData)
    }
  })
}

const { autoUpdater } = require('electron-updater')

let defaultOption;

function createMenuWindow (args) {
  menuWindow = new BrowserWindow({
    // width: 800,
    // height: 800,
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
      // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    },
    id: 'menu'
  })

  const menuURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/menu`
    : `file://${__dirname}/index.html?page=menu`

  menuWindow.loadURL(menuURL)

  menuWindow.on('close', (event) => {
    menuWindow = null
    app.exit(0)
  })
  menuWindow.once('ready-to-show', () => {
    // openUrlHandler(null, 'http://enkel.com?p=profile&target=profile', false)
    menuWindow.show()
    
    // setTimeout(() => {
    if (defaultOption && defaultOption.defaultOpen) {
      createNewWindow(defaultOption.defaultOpen)
      minimizeMenuWindow()
      menuWindow.webContents.send('menu-folded')
      defaultOption = undefined
    } else if (args && args.defaultOpen) {
      createNewWindow(args.defaultOpen)
    }
    // }, 300)
    // https://www.cnblogs.com/qirui/p/8328069.html
    // https://segmentfault.com/a/1190000007616641
  })
}

function minimizeMenuWindow () {
  menuWindowNormalBounds = menuWindow.getNormalBounds()
  menuWindowStatus = 'minimum'
  menuWindow.setBounds({
    x: menuWindowMinimumBounds.x || 20,
    y: menuWindowMinimumBounds.y || 20,
    height: menuWindowMinimumBounds.height || 48,
    width: menuWindowMinimumBounds.width || 48
  }, true)
}

function restoreMenuWindow () {
  menuWindowMinimumBounds = menuWindow.getNormalBounds()
  menuWindowStatus = 'normal'
  menuWindow.setBounds(menuWindowNormalBounds, true)
}

// function createShotcutsWindow (data) {
//   let shortcutsWindow = new BrowserWindow({
//     height: 363,
//     width: 600,
//     modal: true,
//     show: true,
//     // transparent: true,
//     alwaysOnTop: true,
//     x: 144 / 2,
//     y: 394 / 2,
//     webPreferences: {
//       javascript: true,
//       plugins: true,
//       nodeIntegration: true, // 是否集成 Nodejs
//       webSecurity: false,
//       // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
//     }
//   })
// }

let modalLoadingWindow
function createModalLoadingWindow () {
  const modalLoadingUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/modal-loading`
    : `file://${__dirname}/index.html?page=modal-loading`
  modalLoadingWindow = new BrowserWindow({
    height: 128,
    width: 128,
    modal: true,
    show: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    backgroundColor: '#00ffffff',
    frame: false,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false
    },
    id: 'modal-loading'
  })
  modalLoadingWindow.on('close', (event) => {
    // menuWindow = null
    if (modalLoadingWindow) {
      modalLoadingWindow.hide()
    }
    event.preventDefault()
  })
  modalLoadingWindow.loadURL(modalLoadingUrl)
}

let shortcutsWindow
function createShotcutsWindow (data) {
  // const { width, height } = screen.getPrimaryDisplay().workAreaSize
  // const screenshotQrcodeUrl = process.env.NODE_ENV === 'development'
  //   ? `http://localhost:9080/#/screenshot-qrcode`
  //   : `file://${__dirname}/index.html?page=screenshot-qrcode`
  shortcutsWindow = new BrowserWindow({
    height: data.height,
    width: data.width,
    modal: true,
    show: true,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    backgroundColor: '#88000000',
    frame: false,
    x: data.x,
    y: data.y,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false
    }
  })
  shortcutsWindow.on('blur', () => {
    shortcutsWindow.destroy()
  })
  // shortcutsWindow.loadURL(screenshotQrcodeUrl)
}

ipcMain.on('show-shortcuts', async (event, args) => {
  if (modalLoadingWindow) {
    modalLoadingWindow.hide()
  }

  let dpr = args.dpr || 2
  let x = (args.topLeftCorner.x / dpr).toFixed(2)
  let y = (args.topLeftCorner.y / dpr).toFixed(2)
  let width = ((args.topRightCorner.x - args.topLeftCorner.x) / dpr).toFixed(2)
  let height = ((args.bottomLeftCorner.y - args.topLeftCorner.y) / dpr).toFixed(2)

  let opts = {}

  let f = false

  let primaryDisplay = screen.getPrimaryDisplay()
  if (String(primaryDisplay.id) === String(args.screenId)) {
    opts = {
      width: Math.ceil(width),
      height: Math.ceil(height),
      x: Math.ceil(x),
      y: Math.ceil(y)
    }
    f = true
  } else {

    let displays = screen.getAllDisplays()
    let externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    if (externalDisplay && (String(externalDisplay.id) === String(args.screenId))) {
      let r = externalDisplay.workArea.width / primaryDisplay.workArea.width
      if (args.scaled === 'small') {
        opts = {
          width: Math.ceil(width * r) * 2 * dpr,
          height: Math.ceil(width * r) * 2 * dpr,
          x: Math.floor(Number(externalDisplay.bounds.x) + Number(x * r) * 2 * dpr),
          y: Math.floor(Number(externalDisplay.bounds.y) + Number(y * r) * 2 * dpr)
        }
      } else if (args.scaled === 'large') {
        opts = {
          width: Math.ceil(width * r) / 2 / dpr,
          height: Math.ceil(width * r) / 2 / dpr,
          x: Math.floor(Number(externalDisplay.bounds.x) + Number(x * r) / 2 / dpr),
          y: Math.floor(Number(externalDisplay.bounds.y) + Number(y * r) / 2 / dpr)
        }
      } else {
        opts = {
          width: Math.ceil(width * r),
          height: Math.ceil(width * r),
          x: Math.floor(Number(externalDisplay.bounds.x) + Number(x * r)),
          y: Math.floor(Number(externalDisplay.bounds.y) + Number(y * r))
        }
      }
      f = true
    }
  }

  if (f) {
    createShotcutsWindow(Object.assign({}, opts, {
      message: args.message
    }))

    let res = await dialog.showMessageBox({
      title: '扫描结果',
      message: '扫描结果: 【' + args.message + '】',
      defaultId: 1,
      cancelId: 0,
      buttons: ['取消', '复制']
    })
    if (res.response == 1) {
      clipboard.writeText(args.message, 'selection')
    } else {
      event.preventDefault()
    }
  }

})

ipcMain.on('hide-modal-loading', (event) => {
  if (modalLoadingWindow) {
    modalLoadingWindow.hide()
  }
})
ipcMain.on('show-modal-loading', () => {
  if (!modalLoadingWindow) {
    createModalLoadingWindow()
  }
  modalLoadingWindow.show()
})

let checkForUpdates = () => {
  // 配置安装包远端服务器
  autoUpdater.setFeedURL('http://127.0.0.1')

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', async function (message) {
    sendUpdateMessage('error', message);
    let res = await dialog.showMessageBox({
      message: '已经下载成功，是否更新',
      defaultId: 1,
      cancelId: 0,
      buttons: ['稍后', '更新']
    })
    if (res.response == 1) {
      autoUpdater.quitAndInstall()
    } else {

    }
  });
  autoUpdater.on('checking-for-update', function (message) {
    sendUpdateMessage('checking-for-update', message);
  });
  autoUpdater.on('update-available', function (message) {
    sendUpdateMessage('update-available', message);
  });
  autoUpdater.on('update-not-available', function (message) {
    sendUpdateMessage('update-not-available', message);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    sendUpdateMessage('downloadProgress', progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', async function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    sendUpdateMessage('isUpdateNow');
    let res = await dialog.showMessageBox({
      message: '已经下载成功，是否更新',
      defaultId: 1,
      cancelId: 0,
      buttons: ['稍后', '更新']
    })
    if (res.response == 1) {
      autoUpdater.quitAndInstall()
    } else {

    }
  })

  //执行自动更新检查
  autoUpdater.checkForUpdates()
}
function sendUpdateMessage (message, data) {
  menuWindow.webContents.send('update-message', { message, data });
}

function desktopCapturer () {
  if (shortcutsWindow) {
    shortcutsWindow.destroy()
  }

  // createShotcutsWindow()
  menuWindow.webContents.send('desktop-capturer')
}

function getParamStr (url) {
  let params = getParamsFromUrl(url)
  if (params.hasOwnProperty('p')) {
    params.p = null
    delete params.p
  }
  let outStr = []
  for (let k in params) {
    if (params.hasOwnProperty(k)) {
      outStr.push(k + '=' + params[k])
    }
  }
  return outStr.join('&')
}

function openUrlHandler (event, url, extraData, autoOpen = true) {
  let params = getParamsFromUrl(url)
  let pagePath = params.p || params.page
  if (pagePath) {
    if (pagePath === 'profile') {
      showProfileWindow(params)
    } else {
      // enkel://enkel.com?p=
      let p = routes[pagePath]
      let opt = {
        path: p.name
      }
      let pathQueryString = getParamStr(url)
      if (pathQueryString) {
        opt.pathQueryString = pathQueryString
      }
      if (p.id) {
        opt.id = p.id
      }
      if (p.meta) {
        if (p.meta.id) {
          opt.id = p.meta.id
        }
        if (p.meta.resources) {
          opt.resources = p.meta.resources
        }
        if (p.meta.loginBefore) {
          opt.loginBefore = p.meta.loginBefore
        }
        if (p.meta.windowOption) {
          opt.windowOption = p.meta.windowOption
        }
      }
      if (autoOpen) {
        defaultOption = {
          defaultOpen: opt
        }
      }

      if (menuWindow) {
        extraData ? createNewWindow(opt, extraData) : createNewWindow(opt)
      }
    }
  }
}

app.on('will-finish-launching', () => {
  app.on('open-url', (event, url) => openUrlHandler(event, url))
})

app.on('ready', async () => {

  // if ((process.env.NODE_ENV == 'development') && !process.env.IS_TEST) {
  // Install Vue Devtools
  // await installVueDevtools()
  // }
  // createWindow()
  // require('./shortcuts')
  createProfileWindow()
  createMenuWindow()

  if (!modalLoadingWindow) {
    createModalLoadingWindow()
  }

  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

  globalShortcut.register('CommandOrControl+Shift+E', () => {
    // createModalLoadingWindow()
    desktopCapturer()
  })
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (menuWindowStatus === 'normal') {
      minimizeMenuWindow()
      menuWindow.webContents.send('menu-folded')
    } else {
      restoreMenuWindow()
      menuWindow.webContents.send('menu-unfolded')
    }
  })
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    // createModalLoadingWindow()
    createNewWindow({
      path: 'request'
    })
  })

  createSettingsWindow()

  // checkForUpdates()

  // globalShortcut.register('CommandOrControl+,', () => {
  //   showSettingsWindow()
  // })

  // 每次运行APP检测更新。这里设置延时是为了避免还未开始渲染，更新检测就已经完成(网速超快，页面加载跟不上)。
  // setTimeout(() => {
  //   autoUpdater.checkForUpdates()
  // }, 1500)

  app.setAsDefaultProtocolClient('enkel')
  app.setAsDefaultProtocolClient('file')

})
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

function getParamsFromUrl (url) {
  let params = {}
  if (url.indexOf('?') > 0) {
    let paramStr = url.replace(/^([^?]*)(\?)([^/#]*)(\/?\#?.*)$/, '$3')
    params = paramStr.split('&').reduce((result, item) => {
      result[item.split('=')[0]] = item.split('=')[1]
      return result
    }, {})
  }
  return params
}

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  // if (mainWindow === null) {
  //   createWindow()
  // }
  if (menuWindow === null) {
    createMenuWindow()
  }
})

ipcMain.on('open-menu', (event, arg) => {
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
  if (arg.path === 'profile') {
    showProfileWindow(arg)
  } else {
    createNewWindow(arg)
  }
  // if (mainWindow === null) {
  //   createWindow()
  // }
  // console.log('>>>>>>>', arg)
  // mainWindow.webContents.send('navigate-to', arg)
  // mainWindow.showInactive()
  // mainWindow.flashFrame(true)
})

ipcMain.on('right-menu-click', (event, arg) => {
  const menu = new Menu()
  for (let i = 0; i < arg.routes.length; i++) {
    menu.append(new MenuItem({
      label: arg.routes[i].name,
      submenu: arg.routes[i].routes.map(item => {
        return {
          label: item.meta.title,
          click () {
            createNewWindow({
              path: item.name
            })
            /**
            if (mainWindow === null) {
              // createWindow()
              setTimeout(() => {
                createNewWindow({
                  path: item.name
                })
                // mainWindow.webContents.send('navigate-to', {
                //   path: item.name
                // })
                // mainWindow.showInactive()
              }, 1000)
            } else {
              createNewWindow({
                path: item.name
              })
              // mainWindow.webContents.send('navigate-to', {
              //   path: item.name
              // })
              // mainWindow.showInactive()
            }
             */
          }
        }
      })
    }))
  }
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})

ipcMain.on('contextmenu-tool-request', (event, args) => {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: '删除',
    click: async () => {
      let res = await dialog.showMessageBox({
        type: 'info',
        message: `确定删除【${args.label}】吗`,
        defaultId: 1,
        cancelId: 0,
        buttons: ['取消', '确定']
      })
      if (res.response == 1) {
        event.reply('contextmenu-tool-request-delete', {
          deleted: args,
          requests: removeRequest(args)
        })
      } else {
        event.preventDefault()
      }
    }
  }))
  menu.append(new MenuItem({
    label: '修改',
    click: () => {
      event.reply('contextmenu-tool-request-modify', args)
    }
  }))
  // menu.append(new MenuItem({
  //   label: '移动到',
  //   submenu: [
  //     {
  //       label: '笑话目录',
  //       type: 'submenu'
  //     }
  //   ]
  // }))
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})


function getHost (u) {
  let url = 'https://' + u.replace(/^([^/]*\/?\/?)(.*)$/, '$2')
  var result = url.match("^https?:\/\/([^\/:]*)")
  if (result && result[1]) {
    var domain = result[1].match("[0-9a-zA-Z-]*\.(com\.tw|com\.cn|com\.hk|net\.cn|org\.cn|gov\.cn|ac\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|sx\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|fj\.cn|jx\.cn|sd\.cn|ha\.cn|hb\.cn|hn\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|com|net|org|biz|info|cn|mobi|name|sh|ac|io|tw|hk|ws|travel|us|tm|cc|tv|la|in|中国|公司|网络)$")
    try { return domain[0] } catch (e) { }
  }
  return ''
}

ipcMain.on('open-save', async (event, args) => {
  let response = await dialog.showSaveDialogSync({
    defaultPath: path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + 'screenshot.jpg'),
    buttonLabel: '保存'
  })
  if (response) {
    if (args.type === 'screenshot') {
      screenshot(event, Object.assign({}, args, {
        path: response
      }))
    }
  }
})

ipcMain.on('show-all-window', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (['menu', 'modal-loading', 'settings', 'about', 'profile'].indexOf(item.webContents.browserWindowOptions.id) < 0) {
      item.show()
    }
  })
})

ipcMain.on('hide-all-window', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (['menu', 'modal-loading', 'settings', 'about', 'profile'].indexOf(item.webContents.browserWindowOptions.id) < 0) {
      item.hide()
    }
  })
})

ipcMain.on('close-all-window', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (['menu', 'modal-loading', 'settings', 'about', 'profile'].indexOf(item.webContents.browserWindowOptions.id) < 0) {
      item.destroy()
    }
  })
})
ipcMain.on('close-window', (event, args) => {
  let win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    win.destroy()
  }
})

ipcMain.on('capture-screen-qrcode', (event) => {
  desktopCapturer()
})

ipcMain.on('toggle-window-size', (event) => {
  let win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  }
})

ipcMain.on('set-window-size', (event, size) => {
  let win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    win.setBounds(size)
  }
  event.returnValue = true
})

ipcMain.on('open-window', (event, args) => {
  openUrlHandler(event, `http://enkel.com?p=${args.content.msg_body.path}`, args)
})

ipcMain.on('notification', (event, args) => {
  let _args = JSON.parse(JSON.stringify(args))
  if (_args.icon) {
    _args.icon = path.resolve(__dirname, '../../static/images/avatar_female.jpg')
  }
  let notify = new Notification(args)
  notify.show()
  notify.on('click', (event) => openUrlHandler(event, args.redirect || ''))
})

// checkUpdate()

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
// 发送消息给渲染线程
/**
function sendStatusToWindow (status, params) {
  mainWindow.webContents.send(status, params)
}
autoUpdater.autoDownload = false // 关闭自动更新
autoUpdater.autoInstallOnAppQuit = true // APP退出的时候自动安装
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  // 可以更新版本
  sendStatusToWindow('autoUpdater-canUpdate', info)
})
// autoUpdater.on('update-not-available', (info) => {
//   // 不能够更新
// })
autoUpdater.on('error', (err) => {
  // 更新错误
  sendStatusToWindow('autoUpdater-error', err)
})
autoUpdater.on('download-progress', (progressObj) => {
  // 正在下载的下载进度
  sendStatusToWindow('autoUpdater-progress', progressObj)
})
autoUpdater.on('update-downloaded', (info) => {
  // 下载完成
  sendStatusToWindow('autoUpdater-downloaded')
})

ipcMain.on('exit-app', () => {
  app.quit()
})
 */

