import { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog, net } from 'electron'
import axios from 'axios'
import path from 'path'
import os from 'os'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(app.getAppPath() + path.sep + 'db.json')
const db = low(adapter)

const puppeteer = require('puppeteer')

db.defaults({
  requests: [
    {
      id: '9e24bad1c663',
      url: 'http://capipre.zhaopin.com/capi/garyscale/getHomePageGrayConfig?uticket=00ac237b333f4e06a3a238dec67bc687&at=9b7bfdc0c77745c9afb2db15867c06e9&rt=9bb4ccc8b4304ef68da59c00d55f3858&platform=5&d=1B2D3D3D88034056343CD0C58C6B5CC4&channel=apple&k=26412474748748&s=1d4f0ci9e2e4d8cz591e13eiu39ok487f&v=7930&version=7.9.30',
      method: 'GET',
      label: '测试',
      type: 'request',
      cookie: {},
      header: {}
    },
    {
      label: 'Weex首页',
      id: '0d29ed42e3ec',
      type: 'folder',
      children: [
        {
          id: '78f275a046d1',
          url: 'http://capi.zhaopin.com/capi/position/searchRecommend?isCompus=0&resumeNumber=&resumeVersion=&pageIndex=1&pageSize=40&uticket=00ac237b333f4e06a3a238dec67bc687&at=99572e2f4b05460abdc13f9535dfcfa7&rt=73cbd4c6b91548e79b3886c0709d0f48&platform=5&d=1B2D3D3D88034056343CD0C58C6B5CC4&channel=apple&k=26412474748748&v=7918&version=7.9.18&key=26412474748748&t=1554891664846&e=9ec2c21eae188a342bb823f229963baa',
          method: 'GET',
          label: '推荐职位',
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
  ? `http://localhost:9080/#/screenshots`
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
    // app.quit()
  })
  // mainWindow.setAspectRatio(16 / 9)
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
  if (mainWindow === null) {
    createWindow()
  }
  mainWindow.webContents.send('navigate-to', arg)
  mainWindow.showInactive()
  mainWindow.flashFrame(true)
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
            if (mainWindow === null) {
              createWindow()
              setTimeout(() => {
                mainWindow.webContents.send('navigate-to', {
                  path: item.name
                })
              }, 1000)
            } else {
              mainWindow.webContents.send('navigate-to', {
                path: item.name
              })
            }
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
  let response = await axios(args)
  event.reply('response', response)
})

ipcMain.on('screenshot', (event, args) => {
  (async () => {
    console.log('@@@@@@@', args)
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width: args.width || 800,
        height: args.height || 600,
        deviceScaleFactor: args.dpr || 2
      }
    })
    const page = await browser.newPage()
    await page.goto(args.url, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"]
    })
    await page.screenshot({
      path: path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + (args.filename || 'screenshot.jpg')),
      type: 'jpeg',
      encoding: 'binary',
      quality: 100,
      fullPage: true
    })
    await browser.close()
  })()
})

function screenshot (args) {
  (async () => {
    console.log('@@@@@@@', args)
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width: Number(args.width) || 800,
        height: Number(args.height) || 600,
        deviceScaleFactor: args.dpr || 2
      }
    })
    const page = await browser.newPage()
    await page.goto(args.url, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"]
    })
    await page.screenshot({
      path: args.path || path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + (args.filename || 'screenshot.jpg')),
      type: 'jpeg',
      encoding: 'binary',
      quality: 100,
      fullPage: true
    })
    await browser.close()
  })()
}

ipcMain.on('open-save', async (event, args) => {
  let response = await dialog.showSaveDialogSync({
    defaultPath: path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + (args.filename || 'screenshot.jpg')),
    buttonLabel: '保存'
  })
  if (response) {
    screenshot(Object.assign({}, args.options, {
      path: response
    }))
  }
  console.log(response)
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
