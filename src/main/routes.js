module.exports = {
  base64: {
    path: '/base64',
    name: 'base64',
    meta: {
      label: 'BASE64',
      title: 'base64转换',
      icon: '#route-base64',
      name: 'base64编码解码',
      desc: '字符与base64互转，图片与base64互转',
      createTime: '545440088000',
      hot: false
    }
  },
  json: {
    path: '/json',
    name: 'json',
    meta: {
      label: 'JSON',
      title: 'JSON格式化',
      icon: '#route-json',
      name: 'JSON格式化',
      desc: '可以对JSON代码进行格式化和美化',
      createTime: '545440088000',
      hot: false
    }
  },
  request: {
    path: '/request',
    name: 'request',
    meta: {
      label: '网络请求',
      title: '网络请求',
      icon: '#route-request',
      name: '模拟网络请求',
      desc: '模拟网络请求',
      createTime: '545440088000',
      hot: false
    }
  },
  screenshots: {
    path: '/screenshots',
    name: 'screenshots',
    meta: {
      label: '网页截图',
      title: '网页截图',
      icon: '#route-screenshot',
      name: '网页截图',
      desc: '网页截图，支持长图截取',
      createTime: '545440088000',
      hot: false
    }
  },
  qrcode: {
    path: '/qrcode',
    name: 'qrcode',
    meta: {
      label: '二维码工具',
      title: '二维码工具',
      icon: '#route-qrcode',
      name: '二维码工具',
      desc: '识别屏幕中的二维码，生成二维码，解析二维码',
      createTime: '1576724461449',
      hot: false
    }
  },
  encrypt: {
    path: '/encrypt',
    name: 'encrypt',
    meta: {
      label: '加密/解密',
      title: '加密/解密',
      icon: '#route-encrypt',
      name: '加密/解密',
      desc: '提供多种形式的文件内容加密、解密功能',
      createTime: '1576724461449',
      hot: false
    }
  },
  video: {
    path: '/video',
    name: 'video',
    meta: {
      label: 'Enkel视频',
      title: 'Enkel视频',
      icon: '#route-video',
      name: '视频播放',
      desc: '视频播放器，支持多种视频格式',
      createTime: '1577350336459',
      hot: false,
      closable: false,
      withoutHeader: true
    }
  },
  fm: {
    path: '/fm',
    name: 'fm',
    meta: {
      label: 'Enkel FM',
      title: 'Enkel FM',
      icon: '#route-fm',
      name: 'Enkel电台',
      desc: '听各种心情',
      createTime: '1577350336459',
      hot: false,
      closable: false,
      withoutHeader: true
    }
  },
  flac: {
    path: '/flac',
    name: 'flac',
    meta: {
      label: 'Enkel无损音乐',
      title: 'Enkel无损音乐',
      icon: '#route-flac',
      name: 'Enkel无损音乐',
      desc: '过精致的生活，听无损的音乐',
      createTime: '1582793691589',
      hot: false,
      closable: false,
      withoutHeader: true,
      windowOption: {
        frame: false,
        width: 360,
        height: 250,
        modal: true,
        transparent: true,
        titleBarStyle: 'default'
      },
      loginBefore: {
        url: 'https://wappass.baidu.com/passport#/insert_account',
        cookies: ['BDUSS'],
        insert: {
          js: 'let bdheader = document.querySelector(".pass-header"); if (bdheader) { bdheader.style.display = "none"; }'
        }
      }
    }
  },
  pray: {
    path: '/pray',
    name: 'pray',
    meta: {
      label: 'Enkel半仙',
      title: 'Enkel半仙',
      icon: '#route-pray',
      name: 'Enkel半仙',
      desc: '过精致的生活，听无损的音乐',
      createTime: '1582793691589',
      hot: false,
      closable: false,
      withoutHeader: true,
      windowOption: {
        frame: false,
        // resizable: false,
        // height: 667,
        modal: true,
        transparent: true,
        // hasShadow: false,
        // backgroundColor: '#00ffffff',
        titleBarStyle: 'default'
      }
    }
  }
}