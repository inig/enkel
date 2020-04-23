import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import mixins from './mixins'
import * as filters from './filters'
import './themes/index.less'

import { Notice, Message, Modal } from 'view-design'

import '../../static/css/font-awesome/css/font-awesome.min.css'

import VueLazyload from 'vue-lazyload'

Vue.prototype.$Notice = Notice
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  observer: true,
  loading: '../../static/images/loading.gif',
  attempt: 1
})

Vue.mixin(mixins)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

global.eventHub = new Vue()

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
