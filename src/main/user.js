import { ipcMain, app, BrowserWindow, dialog } from "electron"
import fs from 'fs'
import path from 'path'
import os from 'os'
import axios from 'axios'
import qs from 'querystring'
import { imLoginHandler, imRegisterHandler, imUpdateSelfInfoHandler, imUpdateSelfAavatarHandler } from './im/index'
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
// console.log('===', app.getPath('userData') + path.sep + 'user_info.json')
const adapter = new FileSync(app.getPath('userData') + path.sep + 'user_info.json')
const db = low(adapter)
const http = axios.create({
  timeout: 5000,
  baseURL: 'http://127.0.0.1:3000'
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
  await http({
    method: 'POST',
    // baseURL: 'http://talkapi.dei2.com',
    // baseURL: 'http://127.0.0.1:3000',
    url: '/enkel/user/login',
    data: qs.stringify(args)
  }).then(response => {
    if (response.data && (response.data.status === 200)) {
      // 登录成功
      setUser(event, response.data.data)
      imLoginHandler(event, {
        username: response.data.data.phonenum,
        password: response.data.data.password
      })
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

ipcMain.on('register', async (event, args) => {
  await http({
    method: 'POST',
    url: '/enkel/user/register',
    data: qs.stringify(args)
  }).then(response => {
    if (response.data && (response.data.status === 200)) {
      // 注册成功
      // setUser(event, response.data.data)
      imRegisterHandler(event, {
        nickname: args.phonenum,
        username: args.phonenum,
        password: args.password
      })
    }
    event.reply('register-response', response.data)
  }).catch(err => {
    event.reply('register-response', err.response ? {
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

ipcMain.on('save-profile', async (event, args) => {
  await http({
    method: 'POST',
    url: '/enkel/user/updateUserInfo',
    data: qs.stringify(args)
  }).then(response => {
    if (response.data.status === 200) {
      // 更新 成功
      setUser(event, response.data.data)
      // imUpdateSelfInfoHandler(event, {
      //   username: response.data.data.phonenum,
      //   nickname: response.data.data.nickname,
      //   // birthday: String(response.data.data.birthday),
      //   // gender: String(response.data.data.gender)
      // })
    }
    event.reply('save-profile-response', response.data)
  }).catch(err => {
    event.reply('save-profile-response', err.response ? {
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

ipcMain.on('modify-password', async (event, args) => {
  await http({
    method: 'POST',
    url: '/enkel/user/modifyPassword',
    data: qs.stringify(args)
  }).then(response => {
    event.reply('modify-password-response', response.data)
  }).catch(err => {
    event.reply('modify-password-response', err.response ? {
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

ipcMain.on('update-user-info', (event, data) => {
  let userInfo = getUser()
  userInfo = Object.assign({}, userInfo, data)
  setUser(event, userInfo)
})

ipcMain.on('login-out', (event) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('login-out')
    }
  })
})
ipcMain.on('login-out-response', (event) => {
  let userInfo = getUser()
  setUser(event, Object.assign({}, userInfo, {
    token: ''
  }))
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('login-out-response')
    }
  })
})

ipcMain.on('survey-create', async (event, data) => {
  console.log('>>>>>>>>', data)
  await http({
    method: 'POST',
    url: '/enkel/survey/create',
    data: qs.stringify(data)
  }).then(response => {
    event.returnValue = response.data
  }).catch(err => {
    event.returnValue = {
      status: 1001,
      message: err.message
    }
  })
})

ipcMain.on('survey-detail', async (event, data) => {
  await http({
    method: 'POST',
    url: '/enkel/survey/detail',
    data: qs.stringify(data)
  }).then(response => {
    event.returnValue = response.data
  }).catch(err => {
    event.returnValue = {
      status: 1001,
      message: err.message
    }
  })
})

ipcMain.on('survey-answer', async (event, data) => {
  await http({
    method: 'POST',
    url: '/enkel/survey/answer',
    data: qs.stringify(data)
  }).then(response => {
    event.returnValue = response.data
  }).catch(err => {
    event.returnValue = {
      status: 1001,
      message: err.message
    }
  })
})
