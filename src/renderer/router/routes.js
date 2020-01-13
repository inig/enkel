export const developRouter = {
  name: '开发者工具',
  routes: [
    {
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
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
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
      },
      component: require('@/components/tools/developer/Json').default
    },
    {
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
      },
      component: require('@/components/tools/developer/Request/index').default
    },
    {
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
      },
      component: require('@/components/tools/developer/Screenshots/index').default
    },
    {
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
      },
      component: require('@/components/tools/developer/Qrcode/index').default
    },
    {
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
      },
      component: require('@/components/tools/developer/Encrypt/index').default
    }
    // {
    //   path: '/shell',
    //   name: 'shell',
    //   meta: {
    //     label: 'NPM包安装',
    //     title: 'NPM包安装',
    //     icon: '#route-shell',
    //     name: 'NPM包安装',
    //     desc: '可视化NPM包安装',
    //     createTime: '545440088000',
    //     hot: false
    //   },
    //   component: require('@/components/tools/developer/Shell/index').default
    // }
  ]
}

export const mediaRouter = {
  name: '娱乐工具',
  routes: [
    {
      path: '/video',
      name: 'video',
      meta: {
        label: 'VIDEO',
        title: 'Video',
        icon: '#route-video',
        name: '视频播放',
        desc: '视频播放器，支持多种视频格式',
        createTime: '1577350336459',
        hot: false,
        closable: false,
        withoutHeader: true,
        // resources: {
        //   js: ['http://vjs.zencdn.net/7.7.4/video.min.js', 'https://cdn.jsdelivr.net/npm/videojs-flash@2/dist/videojs-flash.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js'],
        //   css: ['http://vjs.zencdn.net/7.7.4/video-js.min.css']
        // }
        // resources: {
        //   js: ['http://vjs.zencdn.net/5.19/video.min.js', 'https://cdn.jsdelivr.net/npm/videojs-flash@2/dist/videojs-flash.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.15.0/videojs-contrib-hls.min.js'],
        //   css: ['http://vjs.zencdn.net/5.19/video-js.min.css']
        // }
      },
      component: require('@/components/tools/media/Video/index').default
    },
    {
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
      },
      component: require('@/components/tools/media/Fm/index').default
    }
  ]
}

export const routes = [
  developRouter,
  mediaRouter
]