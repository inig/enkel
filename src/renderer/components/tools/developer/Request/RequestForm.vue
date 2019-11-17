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
        <Button type="text">发送</Button>
      </div>
    </div>
    <div class="request_send_form">
      <Tabs :animated="true">
        <TabPane label="body">
          <JsonForm v-model="formatedParams"></JsonForm>
        </TabPane>
        <TabPane label="Header">
          <JsonForm v-model="formatedHeaders"></JsonForm>
        </TabPane>
        <TabPane label="Cookie">
          <JsonForm v-model="formatedCookies"></JsonForm>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { Select, Option, Input, Button, Tabs, TabPane } from 'view-design'
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
    Select, Option, Input, Button, Tabs, TabPane,
    JsonForm: () => import('./JsonForm')
  },
  data () {
    return {
      currentMethod: 'GET',
      currentRequest: {
        "id": "",
        "url": "",
        "method": "GET",
        "label": "",
        "type": "request",
        "header": {},
        "cookie": {}
      },
      formatedParams: [],
      formatedHeaders: [],
      formatedCookies: []
    }
  },
  computed: {
    methodColors () {
      return this.$store.state.methodColors
    }
  },
  mounted () {
    // alert(this.currentRequest.url)
    // this.formatedParams = this.formatParams(this.currentRequest.url)
  },
  methods: {
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
        if (params[i].status) {
          outArr.push(params[i].key + '=' + params[i].value)
        }
      }
      this.currentRequest.url = this.currentRequest.url.replace(/^([^?]*)(\?)(.*)$/, '$1') + (outArr.length > 0 ? ('?' + outArr.join('&')) : outArr.join('&'))
      // let list = val.filter(item => item.status).map(item => item.key + '=' + item.value)
      // this.currentRequest.url = this.currentRequest.url.split('?')[0] + (list.length > 0 ? '?' : '' + list.join('&'))
    },
    changeUrl () {
      this.formatedParams = this.formatParams(this.currentRequest.url)
    }
  },
  watch: {
    activeRequest: {
      immediate: true,
      handler (val) {
        this.currentRequest = JSON.parse(JSON.stringify(val))
      }
    },
    'currentRequest.url': {
      immediate: true,
      handler (val) {
        this.formatedParams = this.formatParams(val)
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
      handler (val) {
        this.setUrlStr(val)
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
    height: calc(100% - 46px);
  }
}
</style>