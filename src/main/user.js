import { ipcMain, app, BrowserWindow, dialog } from "electron"
import fs from 'fs'
import path from 'path'
import os from 'os'
import axios from 'axios'
import qs from 'querystring'
const CryptoJS = require('crypto-js')
const cryptType = 'TripleDES'
const PRIVATE_KEY = 'ENKEL_LOVES_YOU'
const jwt = require('jsonwebtoken');
const secret = 'com.dei2'
const tokenExpiresIn = '7d';
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
if (!fs.existsSync(app.getPath('userData'))) {
  fs.mkdirSync(app.getPath('userData'))
  fs.writeFileSync(app.getPath('userData') + path.sep + 'user_info.json', '{}')
} else if (!fs.existsSync(app.getPath('userData') + path.sep + 'user_info.json')) {
  fs.writeFileSync(app.getPath('userData') + path.sep + 'user_info.json', '{}')
}
console.log('===', app.getPath('userData') + path.sep + 'user_info.json')
const adapter = new FileSync(app.getPath('userData') + path.sep + 'user_info.json')
const db = low(adapter)
const http = axios.create({
  timeout: 5000
})
db.defaults({
  user: {}
}).write()

function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
function getUUID (perfix) {
  return ((perfix ? (perfix + '-') : '') + S4() + S4() + S4())
}

function getUser () {
  let userInfo = db.get('user').value()
  if (userInfo.token) {
    let _status = jwt.verify(userInfo.token, secret, (err, decoded) => {
      return err || {}
    })
    if (!_status.name) {
    } else {
      userInfo = Object.assign({}, userInfo, {
        token: ''
      })
    }
  }
  return userInfo
}

function setUser (event, userInfo) {
  db.set('user', userInfo).write()
  loginStatusUpdated(event, userInfo)
}

function loginStatusUpdated (event, userInfo) {
  BrowserWindow.getAllWindows().forEach(item => {
    let _userInfo = (userInfo || getUser())
    if (item.webContents !== event.sender) {
      item.webContents.send('login-info-updated', _userInfo)
    }
  })
}

ipcMain.on('sync-user-info', (event, args) => {
  let userInfo = getUser()
  loginStatusUpdated(event, userInfo)
  event.returnValue = userInfo
})
ipcMain.on('init-login-info', (event, args) => {
  let userInfo = getUser()
  event.returnValue = userInfo
})

ipcMain.on('login', async (event, args) => {
  await axios({
    method: 'POST',
    baseURL: 'http://talkapi.dei2.com',
    // baseURL: 'http://127.0.0.1:3000',
    url: '/enkel/user/login',
    data: qs.stringify(args)
  }).then(response => {
    if (response.data && (response.data.status === 200)) {
      // 登录成功
      setUser(event, response.data.data)
    }
    event.reply('login-response', response.data)
  }).catch(err => {
    event.reply('login-response', err.response ? {
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

ipcMain.on('logout', (event) => {
  let userInfo = getUser()
  setUser(event, Object.assign({}, userInfo, {
    token: ''
  }))
  event.reply('logout-response')
})

ipcMain.on('export-requests', async (event) => {
  let response = await dialog.showSaveDialogSync({
    defaultPath: path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + 'requests.inig'),
    buttonLabel: '导出'
  })
  if (response) {
    let requests = getRequests()
    let cryptoText = CryptoJS[cryptType].encrypt(JSON.stringify(requests), PRIVATE_KEY).toString()
    fs.writeFileSync(response, cryptoText)
    event.returnValue = true
  } else {
    event.returnValue = false
  }
})

function getRequestFromImport (path) {
  let txt = fs.readFileSync(path, 'utf8')
  let decodeInfo = CryptoJS[cryptType].decrypt(txt, PRIVATE_KEY).toString(CryptoJS.enc.Utf8)
  let newRequests = {}
  try {
    newRequests = JSON.parse(decodeInfo)
  } catch (err) {
    newRequests = {}
    dialog.showMessageBox({
      type: 'warning',
      message: '导入失败，请稍后再试'
    })
  }
  return newRequests
}

function findIndexById (id, list) {
  let outIndex = -1

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      outIndex = i
      i = list.length
    }
  }

  return outIndex
}

function mergeRequests (requests, newRequests) {
  let list = requests

  newRequests.forEach(item => {
    let l = findIndexById(item.id, list)
    if (!item.children) {
      if (l === -1) {
        list.push(item)
      } else {
        list.splice(l, 1, item)
      }
    } else {
      if (l === -1) {
        list.push(item)
      } else {
        list.children = mergeRequests(list[l].children, item.children)
      }
    }
  })

  return list
}

ipcMain.on('import-requests', async (event) => {
  let response = await dialog.showOpenDialogSync({
    defaultPath: path.resolve(os.homedir(), '.' + path.sep + 'Downloads'),
    filters: [
      {
        name: 'inig',
        extensions: ['inig']
      }
    ],
    buttonLabel: '导入',
    message: '选择请求列表，*.inig'
  })
  let requests = getRequests()
  if (response && response.length > 0 && response[0].match(/\.inig$/)) {
    let outRequests = requests
    if (requests && requests.length > 0) {
      let res = await dialog.showMessageBox({
        title: '列表已经存在',
        message: '列表已经存在',
        defaultId: 1,
        cancelId: 0,
        buttons: ['替换', '合并', '取消']
      })
      let newRequests
      if (res.response == 1) {
        // 合并
        newRequests = getRequestFromImport(response[0])
        outRequests = mergeRequests(requests, newRequests)
        // setRequests(event, outRequests)
        event.reply('import-requests-success')
      } else if (res.response == 0) {
        // 替换
        newRequests = getRequestFromImport(response[0])
        outRequests = newRequests
        // setRequests(event, newRequests)
        event.reply('import-requests-success')
      } else if (res.response == 2) {
        // 取消
        outRequests = requests
      }
    } else {
      outRequests = getRequestFromImport(response[0])
      event.reply('import-requests-success')
    }
    setRequests(event, outRequests)
    event.returnValue = outRequests
  } else {
    event.returnValue = requests
  }
})
