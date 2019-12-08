import { ipcMain, app, BrowserWindow, dialog } from "electron"
import request from 'request'
import fs from 'fs'
import path from 'path'

const pkg = require('../../package.json')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
if (!fs.existsSync(app.getPath('userData'))) {
  fs.mkdirSync(app.getPath('userData'))
  fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_auto_update.json', '{}')
} else if (!fs.existsSync(app.getPath('userData') + path.sep + 'enkel_auto_update.json')) {
  fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_auto_update.json', '{}')
}
// console.log('===', app.getPath('userData') + path.sep + 'enkel_auto_update.json')
// console.log('==2=', app.getAppPath())
const adapter = new FileSync(app.getPath('userData') + path.sep + 'enkel_auto_update.json')
const db = low(adapter)

db.defaults({
  receivedBytes: 0,
  totalBytes: 0,
  version: '0.0.1',
  downloaded: false
}).write()

let isDownloading = false

let checkUpdateInterval = null

let checkUpdateTs = 10 * 1000
// let checkUpdateTs = 10 * 60 * 1000

function removeCheckUpdateInterval () {
  if (checkUpdateInterval) {
    checkUpdateInterval = null
    clearInterval(checkUpdateInterval)
  }
}

function getReceivedBytes () {
  return db.get('receivedBytes').value()
}

function setReceivedBytes (bytes) {
  db.set('receivedBytes', Number(bytes)).write()
}

function getDownloadedStatus () {
  return db.get('downloaded').value()
}

function setDownloadedStatus (status) {
  db.set('downloaded', status).write()
}

function getTotalBytes () {
  return db.get('totalBytes').value()
}

function setTotalBytes (bytes) {
  let _total = getTotalBytes()
  if (Number(_total) !== Number(bytes)) {
    db.set('totalBytes', Number(bytes)).write()
  }
}

function getDownloadingVersion () {
  return db.get('version').value()
}

function setDownloadingVersion (version) {
  return new Promise((resolve) => {
    db.set('version', version).write()
    resolve(true)
  })
}

function getRemoteVersion () {
  return new Promise((resolve) => {
    request({
      method: 'GET',
      uri: `http://127.0.0.1/version.json`
      // uri: `http://static.dei2.com/enkel/version.json`
    }, function (err, response, body) {
      // 下载完成
      let data = {}
      if (typeof body === 'string') {
        try {
          data = JSON.parse(body)
        } catch (err) {
          data = {
            version: '0.0.1'
          }
        }
      }
      resolve(data.version)
    })
  })
}

const adm_zip = require('adm-zip')
async function boardcastUpdateInfo (data) {
  if (data.type === 'update-download-success') {
    // 提示用户安装更新
    let res = await dialog.showMessageBox({
      type: 'info',
      message: `已检测到新版本，是否安装`,
      defaultId: 1,
      cancelId: 0,
      buttons: ['稍后再说', '安装']
    })
    if (res.response == 1) {

      console.log('@@@@@@@@', `/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`)
      // fs.createReadStream(`/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`)
      //   .pipe(zlib.createGunzip())
      //   .pipe(fs.createWriteStream('/Users/liangshan/Downloads/pic/Enkel.app'))

      let unzip = new adm_zip(`/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`)
      unzip.extractAllTo(`/Users/liangshan/Downloads/pic/`, true)

      setTimeout(() => {
        app.exit(0)
      }, 500)
      // compressing.zip.uncompress(`/Users/liangshan/Downloads/pic/Enkel-0.0.2-mac.zip`, `/Applications`).then(() => {
      //   console.log('解压成功')
      // }).catch(err => {
      //   console.log('解压失败: ', err)
      // })
    } else {
    }

    // let extract = unzip.Extract({
    //   path: `/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`
    // })
    // extract.on('finish', () => {
    //   console.log('解压完成')
    // })
    // extract.on('error', (error) => {
    //   console.log('解压失败：', error)
    // })
    // fs.createReadStream(`/Users/liangshan/Downloads/pic`).pipe(extract)
  }
  BrowserWindow.getAllWindows().forEach(item => {
    if (['settings'].indexOf(item.webContents.browserWindowOptions.id) > -1) {
      item.webContents.send(data.type, data.message || {})
    }
  })
}

export async function downloadPackage (version) {
  let receivedBytes = getReceivedBytes()
  isDownloading = true
  removeCheckUpdateInterval()
  let downloadVersion = version || getDownloadingVersion()
  let req = request({
    method: 'GET',
    // uri: `http://static.dei2.com/enkel/versions/Enkel-${downloadVersion}-mac.zip`,
    uri: `http://127.0.0.1/Enkel-${downloadVersion}-mac.zip`,
    headers: {
      'Range': `bytes=${receivedBytes}-`
    }
  }, function (err, response, body) {
    if (err) {
      console.log('error: ', err)
      // return
    }
    isDownloading = false
    setDownloadedStatus(true)
    setReceivedBytes(0)
    setTotalBytes(0)
    setDownloadingVersion(downloadVersion)
    console.log(Math.floor(Math.random() * 1000), '======', isDownloading, checkUpdateInterval)

    boardcastUpdateInfo({
      type: 'update-download-success',
      message: {
        version: downloadVersion
      }
    })

    // setTimeout(checkUpdate, checkUpdateTs)

    // 下载完成
  }).on('response', (response) => {
    response.on('data', function (data) {
      isDownloading = true
      // compressed data as it is received
      receivedBytes += data.length
      setReceivedBytes(receivedBytes)
      let ranges = (response.caseless.get('content-ranges') || response.caseless.get('content-range'))
      setTotalBytes(ranges.match(/\/(\d*)/)[1])
      boardcastUpdateInfo({
        type: 'update-download-progress',
        message: {
          receivedBytes: Number(receivedBytes),
          totalBytes: Number(ranges.match(/\/(\d*)/)[1])
        }
      })
    })
  })
  let stream = fs.createWriteStream(`/Users/liangshan/Downloads/pic/Enkel-${downloadVersion}-mac.zip`, {
    start: receivedBytes,
    flags: receivedBytes > 0 ? 'a+' : 'w'
  })
  req.pipe(stream)
}

function isNewVersion (version, remoteVersion) {
  let v1 = Number(version.replace(/(\d{1,}\.)/g, item => { if (Number(item) < 10) { return '0' + item } else { return item } }).replace(/\./g, ''))
  let v2 = Number(remoteVersion.replace(/(\d{1,}\.)/g, item => { if (Number(item) < 10) { return '0' + item } else { return item } }).replace(/\./g, ''))
  return v1 < v2
}

async function _checkUpdate () {
  if (!getDownloadedStatus()) {
    let downloadingVersion = getDownloadingVersion()
    let remoteVersion = await getRemoteVersion()
    if (downloadingVersion !== remoteVersion) {
      // 正在下载的版本与远端版本不一致，继续下载
      setReceivedBytes(0)
      setTotalBytes(0)
      // await setDownloadingVersion(remoteVersion)
      downloadPackage(remoteVersion)
    } else {
      let hasNewVersion = isNewVersion(pkg.version, remoteVersion)
      // await setDownloadingVersion(remoteVersion)
      if (hasNewVersion) {
        // 发现新版本
        downloadPackage(remoteVersion)
      } else {
        // 无新版本
        if (getReceivedBytes() > 0) {
          // 有未完成的任务
          downloadPackage(remoteVersion)
        }
      }
    }
  } else {
    console.log('1111')
    boardcastUpdateInfo({
      type: 'update-download-success',
      message: {
        version: getDownloadingVersion()
      }
    })

    clearInterval(checkUpdateInterval)
    checkUpdateInterval = null
  }
}

export async function checkUpdate () {
  if (!isDownloading) {
    if (!checkUpdateInterval) {
      checkUpdateInterval = setInterval(_checkUpdate, checkUpdateTs)
    }
  }
}
