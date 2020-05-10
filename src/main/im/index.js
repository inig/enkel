import md5 from 'blueimp-md5'
import { ipcMain, BrowserWindow } from 'electron'
require('./Friend')

const APP_KEY = '41a433f900631257d7a6ebb9'
const SECRET = '5139e281cf755d0a0a206b9b'

function _S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function getRandomStr () {
  return _S4() + _S4() + _S4() + _S4() + _S4()
}

export function getSignature (ts, rs) {
  return md5(`appkey=${APP_KEY}&timestamp=${ts}&random_str=${rs}&key=${SECRET}`)
}

export function getIMConfig () {
  let ts = new Date().getTime()
  let rs = getRandomStr()
  return {
    appkey: APP_KEY,
    random_str: rs,
    timestamp: ts,
    signature: getSignature(ts, rs),
    flag: 1
  }
}

let IM

ipcMain.on('im-get-config', (event) => {
  event.returnValue = getIMConfig()
})

function imNewHandler (event, im) {
  if (!IM) {
    if (im) {
      IM = im
    } else {
      event.returnValue = {
        status: 1001,
        message: 'IM还未初始化'
      }
    }
  }
  event.returnValue = IM
}
ipcMain.on('im-new', (event, im) => imNewHandler(event, im))

function IMCheck (event) {
  if (!IM) {
    event.returnValue = {
      status: 1001,
      message: 'IM还未初始化'
    }
    return false
  } else {
    return true
  }
}

/**
 * 初始化 IM
 * @param {*} event 
 */
function imInitHandler (event) {
  event.reply('im-init-start')
  if (!IMCheck(event)) {
    return
  }
  IM.init(getIMConfig()).onSuccess(data => {
    event.reply('im-init-success', data)
    event.returnValue = data
  }).onFail(data => {
    event.reply('im-init-fail', data)
    event.returnValue = data
  })
}
ipcMain.on('im-init', (event) => imInitHandler(event))

/**
 * 登录
 * @param {*} event 
 * @param {*} args 
 */
// function imLoginHandler (event, args) {
//   event.reply('im-login-start')
//   if (!IMCheck(event)) {
//     return
//   }
//   IM.login(args).onSuccess(data => {
//     event.reply('im-login-success', data)
//     event.returnValue = data
//   }).onFail(data => {
//     event.reply('im-login-fail', data)
//     event.returnValue = data
//   })
// }
// ipcMain.on('im-login', (event, args) => imLoginHandler(event, args))

/**
 * 注册
 * @param {*} event 
 * @param {*} args 
 */
// function imRegisterHandler (event, args) {
//   event.reply('im-register-start')
//   if (!IMCheck(event)) {
//     return
//   }
//   IM.register(args).onSuccess(data => {
//     event.reply('im-register-success', data)
//     event.returnValue = data
//   }).onFail(data => {
//     event.reply('im-register-fail', data)
//     event.returnValue = data
//   })
// }
// ipcMain.on('im-register', (event, args) => imRegisterHandler(event, args))

/**
 * 发送文本消息
 * @param {*} event 
 * @param {*} args 
 */
function imSendSingleMsgHandler (event, args) {
  event.reply('im-send-single-msg-start')
  if (!IMCheck(event)) {
    return
  }
  IM.sendSingleMsg(args).onSuccess(data => {
    event.reply('im-send-single-msg-success', data)
    event.returnValue = data
  }).onFail(data => {
    event.reply('im-send-single-msg-fail', data)
    event.returnValue = data
  }).onTimeout(data => {
    if (data.response_timeout) {
      event.reply('im-send-single-msg-response-timeout', data)
    } else {
      event.reply('im-send-single-msg-request-timeout', data)
    }
    event.returnValue = data
  }).onAck(data => {
    event.reply('im-send-single-msg-ack', data)
    event.returnValue = data
  })
}
ipcMain.on('im-send-single-msg', (event, args) => imSendSingleMsgHandler(event, args))

export function imLoginHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 登录
    // if (item.webContents !== event.sender) {
    //   item.webContents.send('im-login', args)
    // }
    if (item.webContents.browserWindowOptions && (item.webContents.browserWindowOptions.id == 'profile')) {
      item.webContents.send('im-login', args)
    }
  })
}
ipcMain.on('im-login', (event, args) => imLoginHandler(event, args))

export function imRegisterHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 注册
    // if (item.webContents !== event.sender) {
    //   console.log('>>>>>>>>>>>>', item.webContents)
    //   item.webContents.send('im-register', args)
    // }
    if (item.webContents.browserWindowOptions && (item.webContents.browserWindowOptions.id == 'profile')) {
      item.webContents.send('im-register', args)
    }
  })
}
ipcMain.on('im-register', (event, args) => imRegisterHandler(event, args))

export function imLoginOutHandler (event) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 退出登录
    item.webContents.send('im-login-out')
  })
}
ipcMain.on('im-login-out', (event) => imLoginOutHandler(event))

export function imCreateGroupHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 创建群组
    if (item.webContents !== event.sender) {
      item.webContents.send('im-create-group', args)
    }
  })
}
ipcMain.on('im-create-group', (event, args) => imCreateGroupHandler(event, args))

export function imGetGroupsHandler (event) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 获取群组
    item.webContents.send('im-get-groups')
  })
}
ipcMain.on('im-get-groups', (event) => imGetGroupsHandler(event))

export function imGetGroupsResponseHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 获取群组 返回
    item.webContents.send('im-get-groups-response', args)
  })
}
ipcMain.on('im-get-groups-response', (event, args) => imGetGroupsResponseHandler(event, args))

ipcMain.on('im-on-msg-receive', (event, msg) => {
  BrowserWindow.getAllWindows().forEach(item => {
    // 广播 消息
    // if (item.webContents !== event.sender) {
    item.webContents.send('im-on-msg-receive', msg)
    // }
  })
})

ipcMain.on('im-on-sync-conversation', (event, msg) => {
  BrowserWindow.getAllWindows().forEach(item => {
    // 离线消息同步监听
    // if (item.webContents !== event.sender) {
    item.webContents.send('im-on-sync-conversation', msg)
    // }
  })
})

ipcMain.on('im-on-room-msg', (event, msg) => {
  BrowserWindow.getAllWindows().forEach(item => {
    // 聊天室消息监听
    if (item.webContents !== event.sender) {
      item.webContents.send('im-on-room-msg', msg)
    }
  })
})

export function imUpdateSelfInfoHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 聊天室消息监听
    if (item.webContents !== event.sender) {
      item.webContents.send('im-update-self-info', args)
    }
  })
}
ipcMain.on('im-update-self-info', (event, args) => imUpdateSelfInfoHandler(event, args))

export function imGetUserInfoHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-get-user-info', args)
    }
  })
}
ipcMain.on('im-get-user-info', (event, args) => imGetUserInfoHandler(event, args))

export function imUpdateSelfAavatarHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    // 聊天室消息监听
    if (item.webContents !== event.sender) {
      item.webContents.send('im-update-self-avatar', args)
    }
  })
}
ipcMain.on('im-update-self-avatar', (event, args) => imUpdateSelfAavatarHandler(event, args))

ipcMain.on('im-on-event-notification', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    // 聊天室消息监听
    item.webContents.send('im-on-event-notification', args)
  })
})

ipcMain.on('im-on-sync-event', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    // 聊天室消息监听
    item.webContents.send('im-on-sync-event', args)
  })
})

ipcMain.on('im-get-event-notification', (event) => {
  BrowserWindow.getAllWindows().forEach(item => {
    // 聊天室消息监听
    item.webContents.send('im-get-event-notification')
  })
})

ipcMain.on('im-get-event-notification-response', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-get-event-notification-response', args)
    }
  })
})

ipcMain.on('send-group-custom-msg', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    item.webContents.send('send-group-custom-msg', args)
  })
})
