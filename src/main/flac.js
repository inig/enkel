import { ipcMain, session, BrowserWindow } from 'electron'

const puppeteer = require('puppeteer')

function _getCookiesByUrl (url) {
  return new Promise(async (resolve) => {
    session.defaultSession.cookies.get({
      url: url
    }).then(cookies => {
      resolve(cookies)
    }).catch(err => {
      resolve([])
    })
  })
}

function _flacGetPlayList (args) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      defaultViewport: args.viewport,
      timeout: 60 * 1000
    })
    const page = await browser.newPage()
    await page.goto(args.url, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"]
    })

    let doms = await page.$$eval('.main .left ul li', links => links.map(el => {
      return {
        html: el.querySelector('a').innerHTML
      }
    }));
    console.log(doms)

    await browser.close()
  })
}

function _flacGetRealPath (args) {
  return new Promise(async (resolve, reject) => {
    let win = new BrowserWindow({
      height: 563,
      useContentSize: true,
      width: 1000,
      titleBarStyle: 'hidden',
      show: true,
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true, // 是否集成 Nodejs
        webSecurity: false,
        // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
      }
    })
    win.loadURL(args.url)
    win.webContents.executeJavaScript(`
      let codeInput = document.querySelector('.pickpw input')
      if (codeInput) {
        codeInput.setAttribute('value', '${args.code}')
      }
      // 点击提取按钮
      let codeBtn = document.querySelector('.pickpw a')
      if (codeBtn) {
        codeBtn.click()
      }
    `)
    win.webContents.on('did-navigate', (evt, url) => {
      if (url.match(/\.baidu\.com\/s\//)) {
        win.webContents.executeJavaScript(`
        
        `)
      }
    })

    // const browser = await puppeteer.launch({
    //   headless: false,
    //   ignoreHTTPSErrors: true,
    //   defaultViewport: args.viewport,
    //   timeout: 60 * 1000
    // })
    // const page = await browser.newPage()
    // await page.goto(args.url, {
    //   waitUntil: ["load", "domcontentloaded", "networkidle0"]
    // })

    // 输入提取码
    // let codeInput = await page.$('.pickpw input')
    // if (codeInput) {
    //   await page.type('.pickpw input', args.code)
    // }
    // // 点击提取按钮
    // let codeBtn = await page.$('.pickpw a')
    // if (codeBtn) {
    //   await page.click('.pickpw a')
    // }
    // await page.waitForNavigation()
    let allCookies = await _getCookiesByUrl(args.url)

    // await page.setCookie(...allCookies)

    // console.log('alll cookies222: ', allCookies)
    // await browser.close()
  })
}

ipcMain.on('flac-get-play-list', async (event, data) => {
  await _flacGetPlayList(data)
})

ipcMain.on('flac-get-real-path', async (event, data) => {
  console.log('Data: ', data)
  await _flacGetRealPath(data)
})
