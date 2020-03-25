import { ipcMain, app, BrowserWindow, dialog } from "electron"
import fs from 'fs'
import path from 'path'
import os from 'os'
import axios from 'axios'
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
axios.defaults.timeout = 5000
db.defaults({
  requests: [
  ],
  baseParams: {}
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

function setRequests (event, requests) {
  db.set('requests', requests).write()
  requestsUpdated(event, requests)
}

function getBaseParams () {
  return db.get('baseParams').value()
}

function setBaseParams (event, baseParams) {
  db.set('baseParams', baseParams).write()
  baseParamsUpdated(event, baseParams)
}

function setRequest (event, args) {
  let requests = getRequests()
  if (args.parent) {
    let dirIndex = findRequestIndex(args.parent.id, requests)
    if (dirIndex[0] !== -1) {
      requests[dirIndex[0]].children.push(args.request)
    }
  } else {
    requests.splice((args.index || 10000), 0, args.request)
  }
  db.set('requests', requests).write()
  requestsUpdated(event, requests)
  return requests
}
function modifyRequest (event, args) {
  let v = db.get('requests').find({
    id: args.request.id
  }).value()
  if (v) {
    db.get('requests').find({
      id: args.request.id
    }).assign(Object.assign({}, args.request)).write()
  } else {
    let requests = getRequests()
    requests = requests.map(item => {
      if (item.type === 'folder') {
        item.children = item.children.map(itm => {
          if (itm.id === args.request.id) {
            itm = JSON.parse(JSON.stringify(args.request))
          }
          return itm
        })
      }
      return item
    })
    db.set('requests', requests).write()
  }
  requestsUpdated(event)
  return getRequests()
}

function modifyBaseParams (event, args) {
  setBaseParams(event, args.baseParams)
  return getBaseParams()
}

function setRequestFolder (event, args) {
  let requests = getRequests()
  requests.splice((args.index || 10000), 0, {
    label: args.label,
    id: args.name || getUUID(),
    children: [],
    type: 'folder'
  })
  db.set('requests', requests).write()
  requestsUpdated(event, requests)
  return requests
}
function modifyRequestFolder (event, args) {
  db.get('requests').find({
    id: args.id
  }).assign({
    label: args.label
  }).write()
  let requests = getRequests()
  requestsUpdated(event, requests)
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

function removeRequest (event, args) {
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
  requestsUpdated(event, requests)
  return requests
}

function requestsUpdated (event, requests) {
  BrowserWindow.getAllWindows().forEach(item => {
    let allRequests = (requests || getRequests())
    if (item.webContents !== event.sender) {
      item.webContents.send('requests-updated', allRequests)
    }
  })
}

function baseParamsUpdated (event, baseParams) {
  BrowserWindow.getAllWindows().forEach(item => {
    let allBaseParams = (baseParams || getBaseParams())
    if (item.webContents !== event.sender) {
      item.webContents.send('base-params-updated', allBaseParams)
    }
  })
}

ipcMain.on('remove-request', (event, args) => {
  event.returnValue = removeRequest(event, args)
})
ipcMain.on('get-requests', (event) => {
  event.returnValue = getRequests()
})
ipcMain.on('get-base-params', (event) => {
  event.returnValue = getBaseParams()
})
ipcMain.on('set-requests', (event, args) => {
  if (args.request) {
    args.request = Object.assign({
      type: 'request',
      id: getUUID()
    }, args.request)
  }
  event.returnValue = setRequest(event, args)
})
ipcMain.on('modify-requests', (event, args) => {
  if (args.request) {
    args.request = Object.assign({
      type: 'request',
      id: getUUID()
    }, args.request)
  }
  BrowserWindow.getAllWindows().forEach(item => {
    if (['request'].indexOf(item.webContents.browserWindowOptions.id) < 0) {
      event.reply('request-modified', args.request)
    }
  })
  event.returnValue = modifyRequest(event, args)
})
ipcMain.on('modify-base-params', (event, args) => {
  event.returnValue = modifyBaseParams(event, args)
})
ipcMain.on('set-requests-folder', (event, args) => {
  event.returnValue = setRequestFolder(event, args)
})
ipcMain.on('modify-requests-folder', (event, args) => {
  event.returnValue = modifyRequestFolder(event, args)
})

ipcMain.on('move-request-to-dir', (event, args) => {
  let requests = getRequests()
  if (args.request.id && args.dir.id) {
    let index = findRequestIndex(args.request.id, requests)
    let dirIndex = findRequestIndex(args.dir.id, requests)
    if (index[0] !== -1 && index[1] === -1 && dirIndex[0] !== -1) {
      requests[dirIndex[0]].children.push(args.request)
      requests.splice(index[0], 1)
      db.set('requests', requests).write()
    }
  }
  requestsUpdated(event, requests)
  event.returnValue = requests
})
ipcMain.on('move-request-out-from-dir', (event, args) => {
  let requests = getRequests()
  if (args.request.id && args.dir.id) {
    let index = findRequestIndex(args.request.id, requests)
    let dirIndex = findRequestIndex(args.dir.id, requests)
    if (index[0] !== -1 && index[1] !== -1 && dirIndex[0] !== -1) {
      requests.push(args.request)
      requests[dirIndex[0]].children.splice(index[1], 1)
      db.set('requests', requests).write()
    }
  }
  requestsUpdated(event, requests)
  event.returnValue = requests
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
