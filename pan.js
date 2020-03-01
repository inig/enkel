const puppeteer = require('puppeteer');
const url = 'https://pan.baidu.com/share/init?surl=bo9Rajl';
// const url = 'https://pan.baidu.com/s/1bo9Rajl';
// const url = 'https://www.52flac.com/omei/';
const username = 'liangshan488';
const password = '*#liangshan*#';
const code = 't864';
const vcode = 'e6tj';

function timeout (ts) {
  return new Promise(resolve => setTimeout(resolve, ts))
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    timeout: 60 * 1000
  })
  const page = await browser.newPage()
  await page.goto('https://www.52flac.com/download/10473.html', {
    waitUntil: ["load", "domcontentloaded", "networkidle0"]
  })

  let data = await page.$eval('.wrap', links => {
    let str = links.querySelectorAll('.con')[1].querySelector('p').innerHTML.replace(/\s/g, '')
    return {
      url: str.replace(/^(链接：)(.*)(提取码：)(.*)$/, '$2'),
      code: str.replace(/^(.*)(提取码：)(.*)$/, '$3')
    }
  })
  console.log(data)
  await browser.close()
})()

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: true,
//     ignoreHTTPSErrors: true,
//     timeout: 60 * 1000
//   })
//   const page = await browser.newPage()
//   await page.goto('https://www.52flac.com/', {
//     waitUntil: ["load", "domcontentloaded", "networkidle0"]
//   })

//   let list = await page.$eval('.main', links => {
//     let tab = Array.from(links.querySelectorAll('.wupd .notice .tab-nav li')).map(item => {
//       return item.querySelector('a').innerHTML
//     })
//     tab = tab.map((item, index) => {
//       let content = Array.from(links.querySelectorAll('.wupd .notice .tab-pal')[index].querySelectorAll('li')).map(itm => {
//         return {
//           name: itm.querySelector('a').getAttribute('title'),
//           url: itm.querySelector('a').getAttribute('href')
//         }
//       })
//       return {
//         group: item,
//         list: content.slice(1)
//       }
//     })
//     let others = ['', '', '', ''].map((item, index) => {
//       let group = links.querySelectorAll('.index-cms .ybbt')[index].querySelector('.yanse').innerHTML
//       let content = Array.from(links.querySelectorAll('.index-cms .bgb ul')[index].querySelectorAll('li')).map(itm => {
//         return {
//           name: itm.querySelector('a').getAttribute('title'),
//           url: itm.querySelector('a').getAttribute('href')
//         }
//       })
//       return {
//         group: group,
//         list: content
//       }
//     })
//     tab = tab.concat(others)
//     return tab
//   })
//   await browser.close()
// })()

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false
//   }).catch((err) => console.log('error: ', err.message));
//   const page = await browser.newPage();

//   // console.log('response: ', response)

//   // await page.setRequestInterception(true);

//   // await page.on('request', async (request) => {
//   //   let requestUrl = request.url()
//   //   // 需要输入提取码
//   //   // await page.waitForNavigation()
//   //   console.log('=======', await page.$('.pickpw input'))
//   //   console.log(request.resourceType(), ': ', request.url())
//   //   // if (request.resourceType() === 'xhr') {
//   //   //   console.log('url: ', request.url())
//   //   // console.log('response: ', await request.respond())
//   //   // }
//   //   request.continue()
//   // })

//   // 需要输入提取码


//   await page.goto(url, { waitUntil: 'networkidle2' });

//   // 输入提取码
//   let codeInput = await page.$('.pickpw input')
//   if (codeInput) {
//     await page.type('.pickpw input', code)
//   }
//   // 点击提取按钮
//   let codeBtn = await page.$('.pickpw a')
//   if (codeBtn) {
//     await page.click('.pickpw a')
//   }
//   await page.waitForNavigation()
//   console.log('>>>>>>', await page.url())
//   let step2Url = await page.url()
//   if (step2Url.match(/https?\:\/\/pan\.baidu\.com\/s\//)) {
//     await timeout(1000);
//     await page.waitForSelector('[node-type="header-login-btn"]')
//     await page.click('[node-type="header-login-btn"]')
//     await timeout(1000);
//     await page.waitForSelector('.tang-pass-footerBarULogin');
//     await page.click('.tang-pass-footerBarULogin');
//     await page.waitForSelector('.pass-text-input-userName');
//     await timeout(1000);
//     await page.type('.pass-text-input-userName', username);
//     // await page.waitFor(200)
//     await timeout(1000);
//     await page.type('.pass-text-input-password', password);
//     // await timeout(1000);
//     // await page.click('.pass-button-submit');
//     // await page.waitFor('[node-type="app-user-info"]')

//   }
//   // await page.click('[data-button-id="b3"]');

//   // let doms = await page.$$eval('.main .left ul li', links => links.map(el => {
//   //   return {
//   //     html: el.querySelector('a').innerHTML
//   //   }
//   // }));
//   // console.log(doms)

//   // await browser.close();
// })();