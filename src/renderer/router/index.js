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
      component: require('@/components/pages/Menu').default
    },
    ...developRouter.routes,
    {
      path: '*',
      redirect: '/'
    }
  ]
})
