<template>
  <div class="request_result request_send_form">
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
      <div class="json_result_search">
        <Input autofocus
               size="small"
               class="custom_input">
        <span slot="prepend">搜索</span>
        </Input>
      </div>
    </transition>
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
  import { ipcRenderer } from 'electron'
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
        requesting: false
      }
    },
    created () {
      ipcRenderer.on('start-request', this.startRequest)
      ipcRenderer.on('response', this.responseHandler)
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