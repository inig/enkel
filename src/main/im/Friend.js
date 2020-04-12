import { ipcMain, BrowserWindow } from 'electron'

/**
 * 获取好友列表
 * @param {*} event 
 */
export function imGetFriendListHandler (event) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-get-friend-list')
    }
  })
}
ipcMain.on('im-get-friend-list', (event) => imGetFriendListHandler(event))

/**
 * 获取好友列表返回
 * @param {*} event 
 */
export function imGetFriendListResponseHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-get-friend-list-response', args)
    }
  })
}
ipcMain.on('im-get-friend-list-response', (event, args) => imGetFriendListResponseHandler(event, args))

/**
 * 添加好友
 * @param {*} event 
 * target_name: 目标 username
 * why: 邀请说明
 */
export function imAddFriendHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-add-friend', args)
    }
  })
}
ipcMain.on('im-add-friend', (event, args) => imAddFriendHandler(event, args))

/**
 * 添加好友 返回
 * @param {*} event 
 */
export function imAddFriendResponseHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-add-friend-response', args)
    }
  })
}
ipcMain.on('im-add-friend-response', (event, args) => imAddFriendResponseHandler(event, args))

/**
 * 添加好友 同意
 * @param {*} event 
 * target_name: 目标 username
 */
export function imAcceptFriendHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-accept-friend', args)
    }
  })
}
ipcMain.on('im-accept-friend', (event, args) => imAcceptFriendHandler(event, args))

/**
 * 添加好友 同意 返回
 * @param {*} event 
 */
export function imAcceptFriendResponseHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-accept-friend-response', args)
    }
  })
}
ipcMain.on('im-accept-friend-response', (event, args) => imAcceptFriendResponseHandler(event, args))

/**
 * 添加好友 拒绝
 * @param {*} event 
 * target_name: 目标 username
 * why: 拒绝理由
 */
export function imDeclineFriendHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-decline-friend', args)
    }
  })
}
ipcMain.on('im-decline-friend', (event, args) => imDeclineFriendHandler(event, args))

/**
 * 添加好友 拒绝 返回
 * @param {*} event 
 */
export function imDeclineFriendResponseHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-decline-friend-response', args)
    }
  })
}
ipcMain.on('im-decline-friend-response', (event, args) => imDeclineFriendResponseHandler(event, args))

/**
 * 删除好友
 * @param {*} event 
 * target_name: 目标 username
 */
export function imDelFriendHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-del-friend', args)
    }
  })
}
ipcMain.on('im-del-friend', (event, args) => imDelFriendHandler(event, args))

/**
 * 删除好友 返回
 * @param {*} event 
 */
export function imDelFriendResponseHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-del-friend-response', args)
    }
  })
}
ipcMain.on('im-del-friend-response', (event, args) => imDelFriendResponseHandler(event, args))

/**
 * 更新好友备注
 * @param {*} event 
 * target_name: 目标 username
 * memo_name: 名称备注
 * memo_others: 其他备注
 */
export function imUpdateFriendMemoHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-update-friend-memo', args)
    }
  })
}
ipcMain.on('im-update-friend-memo', (event, args) => imUpdateFriendMemoHandler(event, args))

/**
 * 更新好友备注 返回
 * @param {*} event 
 */
export function imUpdateFriendMemoResponseHandler (event, args) {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.webContents !== event.sender) {
      item.webContents.send('im-update-friend-memo-response', args)
    }
  })
}
ipcMain.on('im-update-friend-memo-response', (event, args) => imUpdateFriendMemoResponseHandler(event, args))
