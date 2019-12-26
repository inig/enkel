import { ipcMain, app, BrowserWindow, dialog, shell } from "electron"
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
// console.log('===', app.getPath('temp'))
// console.log('==2=', app.getAppPath())
const adapter = new FileSync(app.getPath('userData') + path.sep + 'enkel_auto_update.json')
const db = low(adapter)

db.defaults({
  receivedBytes: 0,
  totalBytes: 0,
  version: '', // 本地已下载包的版本
  downloaded: false // 本地是否有下载但未安装的包
}).write()

const JSON_PATH = `http://static.dei2.com/enkel/version.json`

const ZIP_PATH = `http://static.dei2.com/enkel/versions/Enkel-VERSION-mac.zip`
// const ZIP_PATH = `http://127.0.0.1/Enkel-VERSION-mac.zip`

let downloadReq = null

let isDownloading = false

let checkUpdateInterval = null

let checkUpdateTs = 10 * 1000
// let checkUpdateTs = 10 * 60 * 1000

function removeCheckUpdateInterval () {
  if (checkUpdateInterval) {
    clearInterval(checkUpdateInterval)
    checkUpdateInterval = null
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

function getDownloadingProgress () {
  return {
    receivedBytes: getReceivedBytes(),
    totalBytes: getTotalBytes()
  }
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

function resetDownloadInfo () {
  /**
   * {
  receivedBytes: 0,
  totalBytes: 0,
  version: '', // 本地已下载包的版本
  downloaded: false // 本地是否有下载但未安装的包
}
   */
  db.setState({
    receivedBytes: 0,
    totalBytes: 0,
    version: '', // 本地已下载包的版本
    downloaded: false
  }).write()
}

ipcMain.on('get-upgrade-status', (event) => {
  let downloadedStatus = getDownloadedStatus()
  if (downloadedStatus) {
    // showInstallTip({
    //   version: getDownloadingVersion()
    // })
    boardcastUpdateInfo({
      type: 'upgrade-response',
      data: {
        status: 'downloaded',
        version: getDownloadingVersion(),
        receivedBytes: Number(getReceivedBytes()),
        totalBytes: Number(getTotalBytes())
      }
    })
  }
})

ipcMain.on('remove-download-info', (event) => {
  resetDownloadInfo()
})

function getRemoteVersion () {
  return new Promise((resolve) => {
    request({
      method: 'GET',
      uri: JSON_PATH
      // uri: `http://static.dei2.com/enkel/version.json`
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

      // console.log('@@@@@@@@', `/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`)
      // fs.createReadStream(`/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`)
      //   .pipe(zlib.createGunzip())
      //   .pipe(fs.createWriteStream('/Users/liangshan/Downloads/pic/Enkel.app'))
      // console.log(app.getPath('temp'))
      let unzip = new adm_zip(`${app.getPath('temp')}/Enkel-${data.message.version}-mac.zip`)
      unzip.extractAllTo(`/Applications`, true)

      // setTimeout(() => {
      //   app.exit(0)
      // }, 500)
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
      item.webContents.send(data.type, data.data || {})
    }
  })
}

export async function download (version) {
  let receivedBytes = getReceivedBytes()
  downloadReq = request({
    method: 'GET',
    // uri: `http://static.dei2.com/enkel/versions/Enkel-${downloadVersion}-mac.zip`,
    // uri: `http://static.dei2.com/enkel/versions/Enkel-${version}-mac.zip`,
    uri: ZIP_PATH.replace('VERSION', version),
    headers: {
      'Range': `bytes=${receivedBytes}-`
    }
  }, function (err, response, body) {
    if (err) {
      console.log('error: ', err)
      return
    }
    setDownloadedStatus(true)
    // setReceivedBytes(0)
    // setTotalBytes(0)
    setDownloadingVersion(version)

    boardcastUpdateInfo({
      type: 'upgrade-response',
      data: {
        status: 'downloaded',
        version: version,
        receivedBytes: Number(getReceivedBytes()),
        totalBytes: Number(getTotalBytes())
      }
    })

    // setTimeout(checkUpdate, checkUpdateTs)

    // 下载完成
  }).on('response', (response) => {
    response.on('data', function (data) {
      // compressed data as it is received
      receivedBytes += data.length
      setReceivedBytes(receivedBytes)
      let ranges = (response.caseless.get('content-ranges') || response.caseless.get('content-range'))
      // console.log('==========', response, response.caseless, ranges)
      setTotalBytes(ranges.match(/\/(\d*)/)[1])

      boardcastUpdateInfo({
        type: 'upgrade-response',
        data: {
          status: 'downloading',
          version: version,
          receivedBytes: Number(receivedBytes),
          totalBytes: Number(ranges.match(/\/(\d*)/)[1])
        }
      })
    })
  })
  let stream = fs.createWriteStream(`${app.getPath('downloads')}/Enkel-${version}-mac.zip`, {
    // let stream = fs.createWriteStream(`${app.getPath('temp')}/Enkel-${version}-mac.zip`, {
    start: receivedBytes,
    flags: receivedBytes > 0 ? 'a+' : 'w'
  })
  downloadReq.pipe(stream)
}

export async function downloadPackage (version) {
  let downloadingVersion = getDownloadingVersion()
  if (version) {
    download(version)
  } else if (downloadingVersion) {
    download(downloadingVersion)
  } else {
    let remoteVersion = await getRemoteVersion()
    download(remoteVersion)
  }

  // return
  // let receivedBytes = getReceivedBytes()
  // isDownloading = true
  // // removeCheckUpdateInterval()
  // let downloadVersion = version || getDownloadingVersion()
  // let req = request({
  //   method: 'GET',
  //   // uri: `http://static.dei2.com/enkel/versions/Enkel-${downloadVersion}-mac.zip`,
  //   uri: `http://static.dei2.com/enkel/versions/Enkel-${downloadVersion}-mac.zip`,
  //   headers: {
  //     'Range': `bytes=${receivedBytes}-`
  //   }
  // }, function (err, response, body) {
  //   if (err) {
  //     console.log('error: ', err)
  //     // return
  //   }
  //   isDownloading = false
  //   setDownloadedStatus(true)
  //   setReceivedBytes(0)
  //   setTotalBytes(0)
  //   setDownloadingVersion(downloadVersion)
  //   console.log(Math.floor(Math.random() * 1000), '======', isDownloading, checkUpdateInterval)

  //   boardcastUpdateInfo({
  //     type: 'update-download-success',
  //     data: {
  //       version: downloadVersion
  //     }
  //   })

  //   // setTimeout(checkUpdate, checkUpdateTs)

  //   // 下载完成
  // }).on('response', (response) => {
  //   response.on('data', function (data) {
  //     isDownloading = true
  //     // compressed data as it is received
  //     receivedBytes += data.length
  //     setReceivedBytes(receivedBytes)
  //     let ranges = (response.caseless.get('content-ranges') || response.caseless.get('content-range'))
  //     setTotalBytes(ranges.match(/\/(\d*)/)[1])
  //     boardcastUpdateInfo({
  //       type: 'update-download-progress',
  //       data: {
  //         receivedBytes: Number(receivedBytes),
  //         totalBytes: Number(ranges.match(/\/(\d*)/)[1])
  //       }
  //     })
  //   })
  // })
  // let stream = fs.createWriteStream(`${app.getPath('temp')}/Enkel-${downloadVersion}-mac.zip`, {
  //   start: receivedBytes,
  //   flags: receivedBytes > 0 ? 'a+' : 'w'
  // })
  // req.pipe(stream)
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
    boardcastUpdateInfo({
      type: 'update-download-success',
      data: {
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

ipcMain.on('get-latest-version', async (event, arg) => {
  event.reply('response-latest-version', {
    version: await getRemoteVersion()
  })
  // event.returnValue = await getRemoteVersion()
})

ipcMain.on('init-downloading-progress', async (event) => {
  // event.returnValue = await getDownloadingProgress()
  event.reply('response-downloading-progress', await getDownloadingProgress())
})

ipcMain.on('cancel-download', (event) => {
  downloadReq.abort()
})

ipcMain.on('upgrade', async (event) => {
  if (getDownloadedStatus()) {
    let downloadedVersion = getDownloadingVersion()
    if (isNewVersion(pkg.version, downloadedVersion)) {
      // 本地已下载好新版本
      boardcastUpdateInfo({
        type: 'upgrade-response',
        data: {
          status: 'installing',
          version: downloadedVersion
        }
      })
    }
  } else {
    let remoteVersion = await getRemoteVersion()
    // 开始下载
    downloadPackage(remoteVersion)
  }
})

async function showInstallTip (data) {
  let dialogResponse = await dialog.showMessageBox({
    type: 'info',
    message: `已下载新版本，是否安装`,
    defaultId: 1,
    cancelId: 0,
    buttons: ['稍后再说', '去安装']
  })
  if (dialogResponse.response == 1) {
    shell.showItemInFolder(app.getPath('downloads') + path.sep + `Enkel-${data.version}-mac.zip`)
  }
}

ipcMain.on('install', async (event, data) => {
  let remoteVersion = await getRemoteVersion()
  let hasNewVersion = isNewVersion(pkg.version, remoteVersion)
  if (hasNewVersion) {
    showInstallTip(data)
  }
  // return
  // // 开始安装
  // boardcastUpdateInfo({
  //   type: 'upgrade-response',
  //   data: {
  //     status: 'installing',
  //     version: getDownloadingVersion()
  //   }
  // })
  // let res = await dialog.showMessageBox({
  //   type: 'info',
  //   message: `已下载新版本，是否安装`,
  //   defaultId: 1,
  //   cancelId: 0,
  //   buttons: ['稍后再说', '安装']
  // })
  // if (res.response == 1) {

  //   // console.log('@@@@@@@@', `/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`)
  //   // fs.createReadStream(`/Users/liangshan/Downloads/pic/Enkel-${data.message.version}-mac.zip`)
  //   //   .pipe(zlib.createGunzip())
  //   //   .pipe(fs.createWriteStream('/Users/liangshan/Downloads/pic/Enkel.app'))
  //   console.log(app.getPath('temp'))
  //   let version = getDownloadingVersion()
  //   // const { exec } = require('child_process')
  //   // exec(`tar -xvzf ${app.getPath('temp')}/Enkel-${version}-mac.zip`, (error, stdout, stderr) => {
  //   //   if (error) {
  //   //     console.error(`执行的错误: ${error}`);
  //   //     return;
  //   //   }
  //   //   console.log(`stdout: ${stdout}`);
  //   //   // console.error(`stderr: ${stderr}`);
  //   // })
  //   const exec = require('child_process').exec
  //   let workerProcess = exec(`tar -xvzf ${app.getPath('temp')}Enkel-${version}-mac.zip`, {})
  //   // 打印正常的后台可执行程序输出
  //   workerProcess.stdout.on('data', function (data) {
  //     console.log('stdout: ' + data);
  //   });

  //   // 打印错误的后台可执行程序输出
  //   workerProcess.stderr.on('data', function (data) {
  //     console.log('stderr: ' + data);
  //   });

  //   // 退出之后的输出
  //   workerProcess.on('close', function (code) {
  //     console.log('out code：' + code);
  //   })
  // } else {
  // }
})
