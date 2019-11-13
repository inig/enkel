<template>
  <div class="request_panel_list">
    <div class="list_filter_container">
      <Input placeholder="搜索"
             class="request"
             clearable />
      <div class="request_panel_operation">
        <Dropdown trigger="click"
                  @on-click="panelOperate">
          <a href="javascript:void(0)"
             style="color: #c8c8c8;">
            <Icon type="md-add-circle"></Icon>
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="new-request"
                          class="drop_down_item">
              <Icon type="md-add-circle"></Icon>
              新建请求
            </DropdownItem>
            <DropdownItem name="new-folder"
                          class="drop_down_item">
              <Icon type="md-folder" />
              新建文件夹
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <Modal v-model="requestModal.shown"
           title="新建请求">
      <Form :label-width="80">
        <FormItem label="请求地址">
          <Input placeholder="请输入请求地址"
                 v-model="requestModal.formatData.url">
          <Button type="text"
                  slot="append"
                  @click="toggleParamsFormat">参数</Button>
          </Input>
        </FormItem>
        <transition name="fade">
          <FormItem :label-width="10"
                    v-if="requestModal.paramFormatShown">
            <div class="format_param_container">
              <!-- <div class="format_param_item sticky">
                <div class="params_item_status"></div>
                <div class="params_item_label"></div>
                <div class="params_item_value"></div>
              </div> -->
              <div class="format_param_item"
                   v-for="(item, index) in formatedParams"
                   :key="index"
                   @mouseenter="hoverInItem"
                   @mouseleave="hoverOutItem">
                <div class="params_item_status">
                  <Checkbox v-model="item.status"
                            size="small"
                            @on-change="disableParamItem"></Checkbox>
                </div>
                <div class="params_item_label">
                  <Input class="w100p fs12"
                         v-model="item.key"
                         size="small" />
                </div>
                <div class="params_item_value">
                  <Input class="w100p"
                         v-model="item.value"
                         size="small" />
                </div>
                <div class="params_item_delete"
                     @click="deleteItem(index)">
                  <Icon type="md-close"
                        size="20"
                        color="#ed4014" />
                </div>
              </div>
            </div>
          </FormItem>
        </transition>
        <FormItem label="请求方式">
          <Select v-model="currentMethod">
            <Option v-for="(item, index) in requestMethods"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                    :style="{color: item.color}"></Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { Input, Dropdown, DropdownMenu, DropdownItem, Button, Icon, Modal, Form, FormItem, Select, Option, Checkbox } from 'view-design'
export default {
  name: 'RequestPanelList',
  components: {
    Input, Dropdown, DropdownMenu, DropdownItem, Button, Icon, Modal, Form, FormItem, Select, Option, Checkbox
  },
  props: {
    requestMethods: {
      type: Array,
      default () {
        return [
          {
            name: 'GET',
            color: '#745be6'
          },
          {
            name: 'POST',
            color: 'rgb(94, 160, 33)'
          }
        ]
      }
    }
  },
  data () {
    return {
      requestModal: {
        shown: true,
        paramFormatShown: false,
        formatData: {
          url: 'https://www.baidu.com/s?wd=electron-vue&rsv_spt=1&rsv_iqid=0xd48fba0d0008c655&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&rsv_sug3=19&rsv_sug2=0&inputT=4798&rsv_sug4=4799',
          label: '',
          method: ''
        }
      },
      formatedParams: [],
      folderModal: {
        shown: false
      },
      defaultMethod: 'GET',
      currentMethod: 'GET'
    }
  },
  methods: {
    openRequestModal () {
      this.requestModal.shown = true
    },
    openFolderModal () {
      this.folderModal.shown = true
    },
    panelOperate (name) {
      if (name === 'new-request') {
        this.openRequestModal()
      } else if (name === 'new-folder') {
        this.openFolderModal()
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
    toggleParamsFormat () {
      if (!this.requestModal.formatData.url) {
        alert('url不能为空')
        return
      }
      if (!this.requestModal.paramFormatShown) {
        // 格式化参数
        this.formatedParams = this.formatParams(this.requestModal.formatData.url)
      }
      this.requestModal.paramFormatShown = !this.requestModal.paramFormatShown
    },
    hoverInItem (e) {
      if (!e.target.classList.contains('active')) {
        e.target.classList.add('active')
      }
    },
    hoverOutItem (e) {
      if (e.target.classList.contains('active')) {
        e.target.classList.remove('active')
      }
    },
    deleteItem (index) {
      this.formatedParams.splice(Number(index), 1)
      this.setUrlStr(this.formatedParams)
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
      this.requestModal.formatData.url = this.requestModal.formatData.url.replace(/^([^?]*)(\?)(.*)$/, '$1') + (outArr.length > 0 ? ('?' + outArr.join('&')) : outArr.join('&'))
    },
    disableParamItem () {
      this.setUrlStr(this.formatedParams)
    }
  },
  watch: {
    'requestModal.formatData.url': {
      immediate: true,
      handler (val) {
        if (this.requestModal.paramFormatShown) {
          this.formatedParams = this.formatParams(val)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.w100p {
  width: 100%;
}
.fs12 {
  font-size: 12px;
}
.request_panel_list {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  .list_filter_container {
    width: 100%;
    height: 36px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: space-around;
    .request_panel_operation {
      width: 48px;
      height: 32px;
      margin-left: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
}
.drop_down_item {
  display: flex;
  flex-direction: row;
  align-items: center;
  i {
    margin-right: 8px;
  }
}
.format_param_container {
  width: 100%;
  max-height: 300px;
  padding: 15px 0;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f8f8fa;
  .format_param_item {
    width: 100%;
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    &.sticky {
      position: sticky;
      left: 0;
      top: 0;
      background-color: #ffffff;
    }
    .params_item_status {
      width: 32px;
      height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    .params_item_label {
      width: 150px;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .params_item_value {
      flex: 1;
      margin-left: 20px;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .params_item_delete {
      width: 32px;
      height: 32px;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    &.active {
      .params_item_delete {
        opacity: 1;
      }
    }
  }
}
</style>