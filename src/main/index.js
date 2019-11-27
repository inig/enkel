import { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog, net } from 'electron'
// import { autoUpdater } from 'electron-updater'
import { screenshot } from './puppeteer'
import axios from 'axios'
import path from 'path'
import fs from 'fs'
import os from 'os'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
if (!fs.existsSync(app.getPath('userData'))) {
  fs.mkdirSync(app.getPath('userData'))
  fs.writeFileSync(app.getPath('userData') + path.sep + 'db.json', '{}')
} else if (!fs.existsSync(app.getPath('userData') + path.sep + 'db.json')) {
  fs.writeFileSync(app.getPath('userData') + path.sep + 'db.json', '{}')
}
const adapter = new FileSync(app.getPath('userData') + path.sep + 'db.json')
// const adapter = new FileSync(app.getAppPath() + path.sep + 'db.json')
const db = low(adapter)
// console.log('=======', !fs.existsSync(app.getAppPath() + path.sep + 'db.json'), app.getAppPath() + path.sep + 'db.json')
// if (!fs.existsSync(app.getAppPath() + path.sep + 'db.json')) {
//   fs.writeFileSync(app.getAppPath() + path.sep + 'db.json', '')
// }

// const puppeteer = require('puppeteer')

axios.defaults.timeout = 5000

db.defaults({
  requests: [
    {
      id: '9e24bad1c663',
      url: 'http://gank.io/api/xiandu/data/id/appinn/count/10/page/1',
      method: 'GET',
      label: '获取闲读数据',
      type: 'request',
      cookie: {},
      header: {}
    },
    {
      label: '笑话目录',
      id: '0d29ed42e3ec',
      type: 'folder',
      children: [
        {
          id: '78f275a046d1',
          url: 'http://gank.io/api/today',
          method: 'GET',
          label: '最新干货',
          type: 'request',
          cookie: {},
          header: {}
        }
      ]
    }
  ]
}).write()

function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
function getUUID (perfix) {
  return ((perfix ? (perfix + '-') : '') + S4() + S4() + S4())
}

function getRequests () {
  return db.get('requests').value()
}

function setRequest (args) {
  let requests = getRequests()
  if (args.parent) {
    requests.map(item => {
      if (item.name === args.parent) {
        item.children.splice((args.index || 10000), 0, args.request)
      }
    })
  } else {
    requests.splice((args.index || 10000), 0, args.request)
  }
  db.set('requests', requests).write()
  return requests
}

function setRequestFolder (args) {
  let requests = getRequests()
  requests.splice((args.index || 10000), 0, {
    label: args.label,
    id: args.name || getUUID(),
    children: [],
    type: 'folder'
  })
  db.set('requests', requests).write()
  return requests
}

function findRequestIndex (id, requests) {
  let out = [-1, -1]
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].id === id) {
      out[0] = i
      i = requests.length
    } else if (requests[i].type === 'folder') {
      let children = requests[i].children
      for (let j = 0; j < children.length; j++) {
        if (children[j].id === id) {
          out[0] = i
          out[1] = j
          j = children.length
          i = requests.length
        }
      }
    } else { }
  }
  return out
}

function removeRequest (args) {
  let requests = getRequests()
  if (args.id) {
    let index = findRequestIndex(args.id, requests)
    if (index[0] !== -1) {
      if (index[1] !== -1) {
        requests[index[0]].children.splice(index[1], 1)
      } else {
        requests.splice(index[0], 1)
      }
    }
  }
  db.set('requests', requests).write()
  return requests
}

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

function createNewWindow (arg) {
  let newWindow = new BrowserWindow({
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
  const url = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/${arg.path}`
    : `file://${__dirname}/index.html?page=${arg.path}`
  newWindow.loadURL(url)

  newWindow.on('closed', () => {
    // newWindow = null
    newWindow.destroy()
    // app.quit()
  })
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
      // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })

  const menuURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/menu`
    : `file://${__dirname}/index.html?page=menu`

  menuWindow.loadURL(menuURL)

  menuWindow.on('close', (event) => {
    // menuWindow = null
    if (menuWindow) {
      menuWindow.destroy()
      app.quit()
    }
    event.preventDefault()
  })
  menuWindow.once('ready-to-show', () => {
    menuWindow.show()
  })
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

app.on('ready', async () => {
  // if ((process.env.NODE_ENV == 'development') && !process.env.IS_TEST) {
  // Install Vue Devtools
  // await installVueDevtools()
  // }
  // createWindow()
  createMenuWindow()

  // 每次运行APP检测更新。这里设置延时是为了避免还未开始渲染，更新检测就已经完成(网速超快，页面加载跟不上)。
  // setTimeout(() => {
  //   autoUpdater.checkForUpdates()
  // }, 1500)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
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
  createNewWindow(arg)
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

ipcMain.on('context-menu-request-item', (event, args) => {
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
        event.reply('context-menu-delete', {
          deleted: args,
          requests: removeRequest(args)
        })
      } else {
        event.preventDefault()
      }
    }
  }))
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})

ipcMain.on('get-requests', (event) => {
  event.returnValue = getRequests()
})
ipcMain.on('set-requests', (event, args) => {
  if (args.request) {
    args.request = Object.assign({
      type: 'request',
      id: getUUID()
    }, args.request)
  }
  event.returnValue = setRequest(args)
})
ipcMain.on('set-requests-folder', (event, args) => {
  event.returnValue = setRequestFolder(args)
})

ipcMain.on('request', async (event, args) => {
  event.reply('start-request')
  await axios(args).then(response => {
    event.reply('response', response)
  }).catch(err => {
    event.reply('response', err.response ? {
      data: {
        errmsg: err.response.statusText,
        status: err.response.status
      },
      headers: err.response.headers
    } : {
        data: {
          errmsg: err.message,
          status: 1001
        },
        headers: {}
      })
  })
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
  BrowserWindow.getAllWindows().forEach(item => item.show())
})

ipcMain.on('close-all-window', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.id != menuWindow.id) {
      item.destroy()
    }
  })
})

ipcMain.on('shell-npm-install', (event, args) => {
  console.log('NPM Install', args)
})
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

