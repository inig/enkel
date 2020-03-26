<template>
  <div class="request_form">
    <div class="request_send_box">
      <div class="request_method_box">
        <Select class="request_method_select"
                v-model="currentRequest.method"
                :style="{color: methodColors[(currentRequest.method || 'GET').toLowerCase()]}">
          <Option v-for="(item, index) in requestMethods"
                  :style="{color: item.color}"
                  :key="index"
                  :value="item.name"
                  :label="item.name"></Option>
        </Select>
      </div>
      <Input class="request_url_input"
             placeholder="请输入请求地址"
             v-model="currentRequest.url"
             @on-change="changeUrl" />
      <div class="request_btn_box">
        <Button type="text"
                :disabled="!currentRequest.url"
                @click="request">发送</Button>
      </div>
    </div>
    <div class="request_send_form">
      <Tabs :animated="true">
        <TabPane label="Query">
          <JsonForm v-model="formatedParams"
                    :url="currentRequest.url"></JsonForm>
        </TabPane>
        <TabPane label="Body">
          <RequestBody v-model="currentRequest.body"></RequestBody>
        </TabPane>
        <TabPane label="Header">
          <JsonForm v-model="formatedHeaders"></JsonForm>
        </TabPane>
        <TabPane label="Cookie">
          <JsonForm v-model="formatedCookies"></JsonForm>
        </TabPane>
        <div slot="extra"
             style="width: 120px; height: 36px; display: flex; flex-direction: row; align-items: center; justify-content: center;">
          <!-- <Checkbox v-model="useBaseParams"
                    style="color: rgb(94, 160, 33); font-size: 13px;">使用基础参数</Checkbox> -->
          <Dropdown trigger="click"
                    @on-click="changeBaseParamsSettings">
            <a href="javascript:void(0)"
               style="color: rgb(94, 160, 33); font-size: 13px;">
              {{allBaseParamsPriorities[baseParamsPriority].label}}
              <!-- <Icon type="ios-arrow-down"></Icon> -->
            </a>
            <DropdownMenu slot="list">
              <DropdownItem class="drop_down_item"
                            v-for="(item, index) in allBaseParamsPriorities"
                            :key="index"
                            :name="index">
                <!-- <Icon type="md-add-circle"></Icon> -->
                {{item.label}}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import { Select, Option, Input, Button, Tabs, TabPane, Icon, Dropdown, DropdownMenu, DropdownItem } from 'view-design'
  import { ipcRenderer } from 'electron'
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'RequestForm',
    props: {
      requestMethods: {
        type: Array,
        default () {
          return [
            {
              name: 'GET',
              color: 'rgb(167, 149, 251)'
            },
            {
              name: 'POST',
              color: 'rgb(94, 160, 33)'
            }
          ]
        }
      },
      activeRequest: {
        type: Object,
        default () {
          return {
            "id": "",
            "url": "",
            "method": "GET",
            "label": "",
            "type": "request"
          }
        }
      }
    },
    components: {
      Select, Option, Input, Button, Tabs, TabPane, Icon, Dropdown, DropdownMenu, DropdownItem,
      JsonForm: () => import('./JsonForm'),
      RequestBody: () => import('./RequestBody')
    },
    data () {
      return {
        currentMethod: 'GET',
        currentRequest: {
          "id": "",
          "url": "",
          "method": "GET",
          "body": {},
          "label": "",
          "type": "request",
          "header": {},
          "cookie": {}
        },
        formatedParams: [],
        formatedHeaders: [],
        formatedCookies: [],
        labelForUsageOfBaseParams: '基础参数优先',
        usageOfBaseParams: 1
      }
    },
    computed: {
      store () {
        return this.$store
      },
      methodColors () {
        return this.store.state.methodColors
      },
      allBaseParamsPriorities () {
        return this.store.state.allBaseParamsPriorities
      },
      baseParamsPriority () {
        return this.store.state.baseParamsPriority
      }
    },
    mounted () {
      // alert(this.currentRequest.url)
      // this.formatedParams = this.formatParams(this.currentRequest.url)
      // global.eventHub.$on('request-modified', this.requestModified)
      ipcRenderer.on('request-modified', this.requestModified)
    },
    methods: {
      changeBaseParamsSettings (name) {
        this.store.commit(types.CACHE_BASE_PARAMS_PRIORITY, {
          priority: Number(name)
        })
        // if (name === 'non-base-params') {
        //   // 不使用基础参数
        //   this.labelForUsageOfBaseParams = '不使用基础参数'
        //   global.eventHub.$emit('change-base-params-priority', 0)
        // } else if (name === 'base-params-first') {
        //   // 基础参数优先
        //   this.labelForUsageOfBaseParams = '基础参数优先'
        //   global.eventHub.$emit('change-base-params-priority', 1)
        // } else if (name === 'user-params-first') {
        //   // 用户参数优先
        //   this.labelForUsageOfBaseParams = '用户参数优先'
        //   global.eventHub.$emit('change-base-params-priority', 2)
        // }
      },
      requestModified (event, request) {
        if (request.id === this.currentRequest.id) {
          this.currentRequest = JSON.parse(JSON.stringify(request))
        }
      },
      formatParams (str) {
        if (!str || !str.trim() || (str.indexOf('?') < 0)) {
          return []
        }
        let search = str.replace(/^([^?]*)(\?)(.*)$/, '$3')
        if (!search || !search.trim()) {
          return []
        }
        return search.split('&').map(item => {
          return {
            key: item.split('=')[0],
            value: item.split('=')[1],
            status: true
          }
        })
      },
      formatObjectToArray (obj) {
        return Object.keys(obj).map(item => {
          return {
            key: item,
            value: obj[item] || '',
            status: true
          }
        })
      },
      setUrlStr (data) {
        let params = JSON.parse(JSON.stringify(data))
        let i = 0
        let outArr = []
        for (i; i < params.length; i++) {
          if (params[i].status && params[i].key && params[i].key.trim()) {
            outArr.push(params[i].key.trim() + '=' + (params[i].value ? params[i].value.trim() : ''))
          }
        }
        this.currentRequest.url = this.currentRequest.url ? this.currentRequest.url.replace(/^([^?]*)(\?)(.*)$/, '$1') + (outArr.length > 0 ? ('?' + outArr.join('&')) : outArr.join('&')) : ''
        // let list = val.filter(item => item.status).map(item => item.key + '=' + item.value)
        // this.currentRequest.url = this.currentRequest.url.split('?')[0] + (list.length > 0 ? '?' : '' + list.join('&'))
      },
      changeUrl () {
        this.formatedParams = this.formatParams(this.currentRequest.url)
      },
      request () {
        let headers = {}
        this.formatedHeaders.forEach(item => {
          if (item.status && !headers.hasOwnProperty(item.key)) {
            headers[item.key] = item.value
          }
        })
        ipcRenderer.send('request', {
          method: this.currentRequest.method,
          url: this.currentRequest.url,
          data: this.currentRequest.body || {},
          headers: headers
        })
      }
    },
    watch: {
      activeRequest: {
        immediate: true,
        handler (val) {
          if (val.url) {
            this.currentRequest = JSON.parse(JSON.stringify(val))
            this.formatedParams = this.formatParams(this.currentRequest.url)
          }
        }
      },
      'currentRequest.url': {
        immediate: true,
        handler (val) {
          // this.formatedParams = this.formatParams(val)
        }
      },
      'currentRequest.header': {
        immediate: true,
        handler (val) {
          if (val && (Object.keys(val).length > 0)) {
            this.formatedHeaders = this.formatObjectToArray(val)
          }
        }
      },
      'currentRequest.cookie': {
        immediate: true,
        handler (val) {
          if (val && (Object.keys(val).length > 0)) {
            this.formatedCookies = this.formatObjectToArray(val)
          }
        }
      },
      'formatedParams': {
        deep: true,
        handler (val) {
          this.setUrlStr(val)
          // console.log('>>>>>>>', this.currentRequest.url)
          // let list = val.filter(item => item.status).map(item => item.key + '=' + item.value)
          // this.currentRequest.url = this.currentRequest.url.split('?')[0] + (list.length > 0 ? '?' : '' + list.join('&'))
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .request_form {
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
    box-sizing: border-box;
    .request_send_box {
      width: 100%;
      height: 46px;
      background-color: #ffffff;
      border-bottom: 1px solid rgb(211, 211, 211);
      color: rgb(105, 105, 105);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .request_method_box {
        width: 75px;
        height: 46px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #f0f0f0;
        }
        .request_method_select {
          font-weight: bolder;
          font-size: 10px;
          width: 75px;
          border: none;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
      }
      .request_url_input {
        width: calc(100% - 75px - 64px);
      }
      .request_btn_box {
        width: 64px;
        height: 32px;
      }
    }
    .request_send_form {
      height: 100%;
      // height: calc(100% - 46px);
    }
  }
</style>