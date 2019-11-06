import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import mixins from './mixins'

import './themes/index.less'

import { Notice, Message } from 'view-design'

import { ipcRenderer } from 'electron'

Vue.prototype.$Notice = Notice
Vue.prototype.$Message = Message

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.mixin(mixins)

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
