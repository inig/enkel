import { ipcMain, app, BrowserWindow } from "electron"
import fs from 'fs'
import path from 'path'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
if (!fs.existsSync(app.getPath('userData'))) {
  fs.mkdirSync(app.getPath('userData'))
  fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_app.json', '{}')
} else if (!fs.existsSync(app.getPath('userData') + path.sep + 'enkel_app.json')) {
  fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_app.json', '{}')
}
const adapter = new FileSync(app.getPath('userData') + path.sep + 'enkel_app.json')
const db = low(adapter)

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
  requestsUpdated(requests)
  return requests
}
function modifyRequest (args) {
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
  requestsUpdated()
  return getRequests()
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
  requestsUpdated(requests)
  return requests
}
function modifyRequestFolder (args) {
  db.get('requests').find({
    id: args.id
  }).assign({
    label: args.label
  }).write()
  let requests = getRequests()
  requestsUpdated(requests)
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
    console.log(event.sender, '######', (event.sender === item))
    if (item.id !== event.sender.id) {
      item.webContents.send('requests-updated', allRequests)
    }
  })
}

ipcMain.on('remove-request', (event, args) => {
  event.returnValue = removeRequest(event, args)
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
ipcMain.on('modify-requests', (event, args) => {
  if (args.request) {
    args.request = Object.assign({
      type: 'request',
      id: getUUID()
    }, args.request)
  }
  event.returnValue = modifyRequest(args)
})
ipcMain.on('set-requests-folder', (event, args) => {
  event.returnValue = setRequestFolder(args)
})
ipcMain.on('modify-requests-folder', (event, args) => {
  event.returnValue = modifyRequestFolder(args)
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
