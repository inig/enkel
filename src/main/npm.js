import { ipcMain, app, BrowserWindow } from "electron"
import shelljs from 'shelljs'

ipcMain.on('shell-npm-install', (event, args) => {
  console.log('NPM Install', args)
  shelljs.exec('sudo npm ')
  console.log(shelljs.which('node').stdout)
})

ipcMain.on('shell-npm-list', (event, args) => {
  console.log(shelljs.which('node'))
})