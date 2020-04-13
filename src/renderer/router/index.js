import Vue from 'vue'
import Router from 'vue-router'
import { developRouter, mediaRouter } from './routes'

Vue.use(Router)

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    label: '登录',
    title: '登录',
    withoutHeader: true,
    id: 'loginWindow', // 只能打开一次的窗口
    windowOption: {
      frame: false,
      // resizable: false,
      width: 250,
      height: 390,
      // height: 667,
      modal: true,
      transparent: true,
      // hasShadow: false,
      // backgroundColor: '#00ffffff',
      titleBarStyle: 'default'
    }
  },
  component: require('@/components/pages/Login').default
}
export const registerRouter = {
  path: '/register',
  name: 'register',
  meta: {
    label: '注册',
    title: '注册',
    withoutHeader: true,
    windowOption: {
      frame: false,
      // resizable: false,
      width: 250,
      height: 390,
      // height: 667,
      modal: true,
      transparent: true,
      // hasShadow: false,
      // backgroundColor: '#00ffffff',
      titleBarStyle: 'default'
    }
  },
  component: require('@/components/pages/Register').default
}
export const profileRouter = {
  path: '/profile',
  name: 'profile',
  meta: {
    label: '个人中心',
    title: '个人中心',
    withoutHeader: true,
    eternally: true, // 窗口是否可销毁
    id: 'profileWindow', // 只能打开一次的窗口
    windowOption: {
      frame: false,
      // resizable: false,
      width: 400,
      height: 400,
      // height: 667,
      modal: true,
      transparent: true,
      // hasShadow: false,
      // backgroundColor: '#00ffffff',
      titleBarStyle: 'default'
    }
  },
  component: require('@/components/pages/Profile/index').default
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '/menu',
      name: 'menu',
      meta: {
        withoutHeader: true,
        unresizable: true
      },
      component: require('@/components/pages/Menu').default
    },
    {
      path: '/modal-loading',
      name: 'modal-loading',
      meta: {
        withoutHeader: true
      },
      component: require('@/components/pages/ModalLoading').default
    },
    {
      path: '/settings',
      name: 'settings',
      meta: {
        title: '设置',
        closable: true,
        unresizable: true // 双击header不能最大化
      },
      component: require('@/components/pages/Settings').default
    },
    {
      path: '/about',
      name: 'about',
      meta: {
        title: '关于',
        withoutHeader: true,
        unresizable: true
      },
      component: require('@/components/pages/About').default
    },
    {
      path: '/qrcode-result',
      name: 'qrcode-result',
      meta: {
        withoutHeader: true
      },
      component: require('@/components/pages/QrcodeResult').default
    },
    loginRouter,
    registerRouter,
    profileRouter,
    ...developRouter.routes,
    ...mediaRouter.routes,
    {
      path: '*',
      redirect: '/'
    }
  ]
})
