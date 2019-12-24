<template>
  <div class="request_result request_send_form"
       id="jsonResult">
    <Tabs :animated="true">
      <TabPane label="Preview">
        <ResponsePreview :data="response.data"></ResponsePreview>
      </TabPane>
      <TabPane label="Header">
        <ResponsePreview :data="response.headers"></ResponsePreview>
      </TabPane>
      <TabPane label="Cookie">
        <ResponsePreview :data="response.cookies"></ResponsePreview>
      </TabPane>
    </Tabs>
    <transition name="fade">
      <div class="loading_container"
           v-if="requesting">
        <Loading></Loading>
      </div>
    </transition>
  </div>
</template>

<script>
import { Tabs, TabPane, Input } from 'view-design'
import { ipcRenderer, remote } from 'electron'
import { FindInPage } from 'electron-find'
export default {
  name: 'RequestResult',
  components: {
    Tabs, TabPane, Input,
    ResponsePreview: () => import('./ResponsePreview'),
    Loading: () => import('../../../custom/Loading')
  },
  data () {
    return {
      response: {},
      requesting: false,
      findInPage: null,
      inputEvent: null
    }
  },
  created () {
    ipcRenderer.on('start-request', this.startRequest)
    ipcRenderer.on('response', this.responseHandler)
  },
  mounted () {
    this.findInPage = new FindInPage(remote.getCurrentWebContents(), {
      parentElement: document.querySelector('#jsonResult'),
      boxBgColor: '#333',
      boxShadowColor: '#000',
      inputColor: '#aaa',
      inputBgColor: '#222',
      inputFocusColor: '#555',
      textColor: '#aaa',
      textHoverBgColor: '#555',
      caseSelectedColor: '#555',
      offsetTop: 95,
      preload: true
    })

    this.inputEvent = document.createEvent('HTMLEvents')
    this.inputEvent.initEvent('input', true, true)

    this.$nextTick(() => {
      let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
      isMac && (this.platform = 'mac')
      window.onkeydown = (ev) => {
        if (this.$route.name === 'request') {
          if (this.platform === 'mac') {
            if (ev.metaKey && ev.keyCode === 70) {
              // mac下 command + shift + s
              this.toggleFilterInput()
            }
          } else {
            if (ev.ctrlKey && ev.keyCode === 70) {
              // windows下  control + shift + s 保存
              this.toggleFilterInput()
            }
          }
        }
      }
    })
  },
  methods: {
    startRequest () {
      this.requesting = true
    },
    responseHandler (event, response) {
      this.response = response
      setTimeout(() => {
        this.requesting = false
      }, 800)
    },
    toggleFilterInput () {
      var txt = window.getSelection ? window.getSelection() : document.selection.createRange().text
      let input = document.querySelector('.find-input')
      if (input) {
        input.value = txt

        input.dispatchEvent(this.inputEvent)
      }
      this.findInPage.openFindWindow()
    }
  }
}
</script>

<style lang="less" scoped>
.request_result {
  position: relative;
  height: 100%;
  .json_result_search {
    position: absolute;
    left: 0;
    top: 46px;
    width: 100%;
    height: 36px;
    background-color: rgba(0, 0, 0, 0.7);
    // background-color: rgba(94, 160, 33, 0.7);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .filter_result {
      position: absolute;
      right: 15px;
      top: 0;
      height: 36px;
      padding: 0 15px;
      color: #c8c8c8;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  .loading_container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>