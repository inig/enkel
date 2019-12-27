import { ipcMain, BrowserWindow, dialog, screen } from 'electron'

import fs from 'fs'
import path from 'path'
let outList = []
ipcMain.on('get-play-list', (event, data) => {
  if (outList.length > 0) {
    event.returnValue = outList
    return
  }
  let fileData = fs.readFileSync(path.join(__dirname, '../renderer/assets/preload/playlist.m3u'), {
    encoding: 'utf-8'
  })
  let list = fileData.split('\r\n')
  let indexMap = {}
  let i = 0
  let groupTitle = ''
  let title = ''
  let url = ''
  for (i; i < list.length; i++) {
    if (list[i].trim() && (list[i].indexOf('#EXTINF:') === 0)) {
      groupTitle = list[i].replace(/^(.*)(group\-title\=)([^,]*)(,.*)$/, '$3')
      title = list[i].replace(/^(.*)(title\=)([^,]*)(,.*)$/, '$3')
      url = list[i].replace(/^(.*)(url\=)([^,]*)(,?.*)$/, '$3')
      if (!indexMap.hasOwnProperty(groupTitle)) {
        outList.push({
          label: groupTitle,
          children: [
            {
              label: title,
              url: url,
              type: 'application/x-mpegURL'
            }
          ]
        })
        indexMap[groupTitle] = outList.length - 1
      } else {
        outList[indexMap[groupTitle]].children.push({
          label: title,
          url: url,
          type: 'application/x-mpegURL'
        })
      }
    }
  }
  event.returnValue = outList
})
