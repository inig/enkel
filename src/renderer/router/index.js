import Vue from 'vue'
import Router from 'vue-router'
import { developRouter } from './routes'

Vue.use(Router)

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
        withoutHeader: true
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
        closable: true
      },
      component: require('@/components/pages/Settings').default
    },
    {
      path: '/about',
      name: 'about',
      meta: {
        title: '关于',
        withoutHeader: true
      },
      component: require('@/components/pages/About').default
    },
    ...developRouter.routes,
    {
      path: '*',
      redirect: '/'
    }
  ]
})
