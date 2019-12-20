/**
 * 注册全局快捷键
 */

import { globalShortcut, app } from 'electron'

import fs from 'fs'
import path from 'path'
import os from 'os'
const CryptoJS = require('crypto-js')
const cryptType = 'TripleDES'
const PRIVATE_KEY = 'ENKEL_LOVES_YOU'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
if (!fs.existsSync(app.getPath('userData'))) {
  fs.mkdirSync(app.getPath('userData'))
  fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_app.json', '{}')
} else if (!fs.existsSync(app.getPath('userData') + path.sep + 'enkel_app.json')) {
  fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_app.json', '{}')
}
// console.log('===', app.getPath('userData') + path.sep + 'enkel_app.json')
const adapter = new FileSync(app.getPath('userData') + path.sep + 'enkel_app.json')
const db = low(adapter)

db.defaults({
  shortcuts: [
    {
      key: 'CommandOrControl+Shift+S',
      command: '打开/关闭菜单',
      id: 1
    },
    {
      key: 'CommandOrControl+Shift+E',
      command: '识别屏幕中二维码',
      id: 2
    }
  ]
}).write()

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
