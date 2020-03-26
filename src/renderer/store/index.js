import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production',
  mutations: mutations.mutations,
  state: {
    methodColors: {
      get: 'rgb(167, 149, 251)',
      post: 'rgb(94, 160, 33)'
    },
    allBaseParamsPriorities: [
      {
        label: '不使用基础参数',
        name: 'non-base-params'
      },
      {
        label: '基础参数优先',
        name: 'base-params-first'
      },
      {
        label: '用户参数优先',
        name: 'user-params-first'
      }
    ],
    baseParamsPriority: 1,
    baseParams: []
  }
})
