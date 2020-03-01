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

function _flacGetRealPath (event, args) {
  return new Promise(async (resolve, reject) => {
    let win = new BrowserWindow({
      height: 197 + 20,
      useContentSize: true,
      width: 520,
      titleBarStyle: 'hidden',
      show: false,
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true, // 是否集成 Nodejs
        webSecurity: false,
        // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
      }
    })
    win.loadURL(args.url)

    // let targetWindow = BrowserWindow.fromWebContents(win.webContents)
    // targetWindow.webContents.executeJavaScript(`
    win.webContents.executeJavaScript(`
      function _getSystemContext () {
        return window.require("system-core:context/context.js").instanceForSystem;
      }
      function _initWidgetContext (name, callback) {
        var initFunc = function (widget) {
          if (!widget.getContext()) {
            widget.setContext(_getSystemContext());
          }
          callback && callback();
        };
        if (callback) {
          window.require.async(name, initFunc);
        }
        else {
          initFunc(window.require(name));
        }
      }
      
      function pan_run () {
        return new Promise(resolve => {
          let fileList = require('system-core:context/context.js').instanceForSystem.list.getSelected();
          _initWidgetContext("function-widget-1:download/util/context.js");
        
          window.require.async("function-widget-1:download/service/dlinkService.js", function (dl) {
            var yunData = window.yunData;
            var data = {
              list: fileList,
              share_uk: yunData.SHARE_UK,
              share_id: yunData.SHARE_ID,
              sign: yunData.SIGN,
              timestamp: yunData.TIMESTAMP,
              type: "nolimit"
            };
            try {
              dl.getDlinkShare(data, (response) => {
                resolve(response)
              });
            } catch (err) {
            }
          })
        })
      }
      pan_run().then(response => {
        document.title = JSON.stringify(response)
      })
    `)

    win.on('page-title-updated', (evt, title) => {
      let response = {}
      try {
        response = JSON.parse(title)
      } catch (err) {
        response = {}
      }
      if (response.list && response.list.length) {
        event.sender.send('flac-response-real-path', response.list[0].dlink)
        win.destroy()
      }
    })

    const requestFilter = {
      urls: ['*://*.baidu.com/genimage*']
    }
    const requestFilter2 = {
      urls: ['*://*.baidu.com/api/sharedownload*']
    }

    session.defaultSession.webRequest.onResponseStarted(requestFilter, (details) => {
      // 显示验证码输入框
      win.webContents.executeJavaScript(`
        var closeBtn = document.querySelector('.dialog-control')
        closeBtn && (closeBtn.style.display = 'none')
        var bgMask = document.querySelector('.module-canvas')
        var dialog1 = document.querySelector('.dialog-dialog1')
        var drager = document.querySelector('.dialog-drag')
        var layoutApp = document.querySelector('#layoutApp')
        var cancelBtn = document.querySelector('[title="取消"]')
        if (bgMask) {
          bgMask.style.backgroundColor = '#FAFDFF'
          bgMask.style.opacity = '1'
        }
        if (dialog1) {
          dialog1.style.top = '20px'
        }
        if (cancelBtn) {
          cancelBtn.style.display = 'none'
        }
        if (drager) {
          drager.classList.remove('dialog-drag')
        }
        if (layoutApp) {
          layoutApp.style.overflow = 'hidden'
          layoutApp.style.display = 'none'
          layoutApp.style.webkitAppRegion = 'drag'
        }
      `)

      win.show()
    })
    session.defaultSession.webRequest.onResponseStarted(requestFilter2, (details) => {
      win.hide()
    })
    session.defaultSession.webRequest.onCompleted(requestFilter2, (details) => {
      win.webContents.executeJavaScript(`
        var closeBtn = document.querySelector('.dialog-control')
        closeBtn && (closeBtn.style.display = 'none')
        var bgMask = document.querySelector('.module-canvas')
        var dialog1 = document.querySelector('.dialog-dialog1')
        var drager = document.querySelector('.dialog-drag')
        var layoutApp = document.querySelector('#layoutApp')
        var cancelBtn = document.querySelector('[title="取消"]')
        if (bgMask) {
          bgMask.style.backgroundColor = '#FAFDFF'
          bgMask.style.opacity = '1'
        }
        if (dialog1) {
          dialog1.style.top = '20px'
        }
        if (cancelBtn) {
          cancelBtn.style.display = 'none'
        }
        if (drager) {
          drager.classList.remove('dialog-drag')
        }
        if (layoutApp) {
          layoutApp.style.overflow = 'hidden'
          layoutApp.style.display = 'none'
          layoutApp.style.webkitAppRegion = 'drag'
        }
      `)
      win.show()
    })

    resolve(true)
    return
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
  await _flacGetRealPath(event, data)
})