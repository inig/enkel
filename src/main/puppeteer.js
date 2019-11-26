const puppeteer = require('puppeteer')

function screenshotHandler (event, args) {
  return new Promise(async (resolve) => {
    // console.log('@@@@@@@', args)
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      defaultViewport: args.viewport,
      timeout: 60 * 1000
    })
    const page = await browser.newPage()
    // let domain = getHost(args.url)
    await page.setCookie(...args.cookies.map(item => {
      return {
        name: item.key,
        value: item.value,
        url: args.url
      }
    }))
    if (args.userAgent) {
      await page.setUserAgent(args.userAgent)
    }
    await page.goto(args.url, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"]
    })
    let _args = JSON.parse(JSON.stringify(args))
    await page.screenshot({
      path: args.path,
      type: 'jpeg',
      encoding: 'binary',
      quality: args.hasOwnProperty('quality') ? args.quality : 100,
      fullPage: args.hasOwnProperty('fullPage') ? args.fullPage : true
    }).catch(() => {
    })
    if (args.scripts && args.scripts.length > 0) {
      let i = 0
      for (i; i < args.scripts.length; i++) {
        await page.mainFrame().addScriptTag({
          content: args.scripts[i].text
        })
        if (i !== 0) {
          await page.waitForNavigation({
            waitUntil: ["load", "domcontentloaded", "networkidle0"]
          })
          await sleep(300)
        }

        await page.screenshot({
          path: _args.path.replace(/(.*)(\.[a-zA-Z]*)$/, '$1-' + (i + 1) + '$2'), // path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + (i > 0 ? 'screenshot_' + (i + 1) + '.jpg' : 'screenshot.jpg')), // (i === 0 ? args.path : _args.path.replace(/\/(.*)(\.[a-zA-Z]*)$/, '$1-' + (i + 1) + '$2')), // || path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + 'screenshot.jpg'),
          type: 'jpeg',
          encoding: 'binary',
          quality: args.hasOwnProperty('quality') ? args.quality : 100,
          fullPage: args.hasOwnProperty('fullPage') ? args.fullPage : true
        }).catch(() => {
        })
      }
    }
    await browser.close()
    resolve(true)
  })
}

export async function screenshot (event, args) {
  event.reply('start-screenshot')
  await screenshotHandler(event, args)
  event.reply('end-screenshot')
}