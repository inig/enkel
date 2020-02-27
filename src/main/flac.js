import { ipcMain, app, dialog, screen } from 'electron'

const puppeteer = require('puppeteer')

ipcMain.on('get-play-list', (event, data) => {
})