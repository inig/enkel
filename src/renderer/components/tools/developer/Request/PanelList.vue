<template>
  <div class="request_panel_list">
    <div class="list_filter_container">
      <Input placeholder="搜索"
             class="request"
             v-model="filterText"
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
    <div class="requests_list">
      <div class="requests_item"
           v-for="(item, index) in requestsList"
           :key="index">
        <div class="requests_item_inner"
             :class="[activeItem[0] === index ? 'active' : '']"
             @click="setActiveItem(index)"
             @contextmenu="showContextMenu(item)"
             v-if="(item.type === 'request') && (item.url.toLowerCase().indexOf(filterText.toLowerCase()) > -1 || item.label.toLowerCase().indexOf(filterText.toLowerCase()) > -1)">
          <div class="requests_item_method"
               :style="{color: methodColors[item.method.toLowerCase()]}">{{item.method}}</div>
          <div class="requests_item_content">【{{item.label}}】{{item.url}}</div>
        </div>
        <div class="requests_item_folder_inner"
             :class="[activeItem[0] === index ? 'active' : '', openedItem.indexOf(item.id) > -1 ? 'opened' : '']"
             v-if="(item.type === 'folder') || (item.label.toLowerCase().indexOf(filterText.toLowerCase()) > -1)"
             @contextmenu="showContextMenu(item)">
          <div class="requests_item_folder_header"
               @click="toggleOpenedItem(item.id)">
            <div class="requests_item_folder_header_icon">
              <svg v-if="(activeItem[0] !== index) && (openedItem.indexOf(item.id) > -1)">
                <use xlink:href="#folder-open-outline"></use>
              </svg>
              <svg v-else-if="(activeItem[0] !== index) && (openedItem.indexOf(item.id) < 0)">
                <use xlink:href="#folder-outline"></use>
              </svg>
              <svg v-else-if="(activeItem[0] === index) && (openedItem.indexOf(item.id) > -1)">
                <use xlink:href="#folder-open"></use>
              </svg>
              <svg v-else-if="(activeItem[0] === index) && (openedItem.indexOf(item.id) < 0)">
                <use xlink:href="#folder"></use>
              </svg>
            </div>
            <div class="requests_item_folder_header_content">{{item.label}}</div>
          </div>
          <div class="requests_item_folder_content"
               :style="{height: openedItem.indexOf(item.id) > -1 ? (item.label.toLowerCase().indexOf(filterText) > -1 ? item.children.length * 36 + 'px' : item.children.filter(i => (i.url.toLowerCase().indexOf(filterText) > -1 || i.label.toLowerCase().indexOf(filterText) > -1)).length * 36 + 'px') : '0px'}">
            <div class="requests_item"
                 v-for="(itm, idx) in item.children"
                 :key="idx">
              <div class="requests_item_inner"
                   :class="[(activeItem[0] === index && activeItem[1] === idx) ? 'active' : '']"
                   style="padding-left: 40px;"
                   @click="setActiveItem(index, idx)"
                   @contextmenu="showContextMenu(itm)"
                   v-if="(itm.type === 'request') && ((item.label.toLowerCase().indexOf(filterText.toLowerCase()) > -1) || (itm.url.toLowerCase().indexOf(filterText.toLowerCase()) > -1 || itm.label.toLowerCase().indexOf(filterText.toLowerCase()) > -1))">
                <div class="requests_item_method"
                     :style="{color: colors[itm.method.toLowerCase()]}">{{itm.method}}</div>
                <div class="requests_item_content">【{{itm.label}}】{{itm.url}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div class="empty_container"
             v-if="requestsList.length === 0">
          <svg>
            <use xlink:href="#empty"></use>
          </svg>
        </div>
      </transition>
    </div>

    <Modal v-model="requestModal.shown"
           title="新建请求"
           @on-ok="saveRequest">
      <Form :label-width="80">
        <FormItem label="请求描述">
          <Input placeholder="请输入请求描述"
                 v-model="requestModal.formatData.label" />
        </FormItem>
        <FormItem label="请求地址">
          <Input placeholder="请输入请求地址"
                 v-model="requestModal.formatData.url"
                 @on-change="changeUrl">
          <Button type="text"
                  slot="append"
                  @click="toggleParamsFormat">参数</Button>
          </Input>
        </FormItem>
        <transition name="fade">
          <FormItem :label-width="10"
                    v-if="requestModal.paramFormatShown && formatedParams.length > 0">
            <div class="format_param_container">
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
                         @on-change="changeFormatedParams"
                         size="small" />
                </div>
                <div class="params_item_value">
                  <Input class="w100p"
                         v-model="item.value"
                         @on-change="changeFormatedParams"
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
          <Select v-model="requestModal.formatData.method">
            <Option v-for="(item, index) in requestMethods"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                    :style="{color: item.color}"></Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="folderModal.shown"
           title="新建文件夹"
           @on-ok="createFolder">
      <Form :label-width="80">
        <FormItem label="名称">
          <Input placeholder="请输入文件夹名称"
                 v-model="folderModal.formatData.label" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { Input, Dropdown, DropdownMenu, DropdownItem, Button, Icon, Modal, Form, FormItem, Select, Option, Checkbox } from 'view-design'
import { ipcRenderer } from 'electron'
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
            color: 'rgb(167, 149, 251)'
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
      filterText: '',
      requestModal: {
        shown: false,
        paramFormatShown: false,
        formatData: {
          url: 'https://www.baidu.com/s?wd=electron-vue',
          label: '',
          method: 'GET',
          header: {},
          cookie: {}
        }
      },
      formatedParams: [],
      folderModal: {
        shown: false,
        formatData: {
          label: ''
        }
      },
      requestsList: [],
      defaultMethod: 'GET',
      colors: {
        get: 'rgb(167, 149, 251)',
        post: 'rgb(94, 160, 33)'
      },
      activeItem: [-1, -1],
      openedItem: ['0d29ed42e3ec']
    }
  },
  computed: {
    methodColors () {
      return this.$store.state.methodColors
    }
  },
  created () {
    this.getRequestsList()
    this.$emit('active', this.getActiveObj())
    ipcRenderer.on('context-menu-delete', this.requestItemDelete)
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
    },
    changeFormatedParams (e) {
      this.setUrlStr(this.formatedParams)
    },
    changeUrl () {
      this.formatedParams = this.formatParams(this.requestModal.formatData.url)
    },
    createFolder () {
      let responseData = ipcRenderer.sendSync('set-requests-folder', {
        label: this.folderModal.formatData.label
      })
    },
    getRequestsList () {
      this.requestsList = ipcRenderer.sendSync('get-requests')
    },
    toggleOpenedItem (id) {
      let index = this.openedItem.indexOf(id)
      if (index > -1) {
        this.openedItem.splice(index, 1)
      } else {
        this.openedItem.push(id)
      }
    },
    setActiveItem (index, subindex = -1) {
      this.activeItem = [index, subindex]
    },
    getActiveObj () {
      let activeObj = {}
      if (this.activeItem[1] === -1) {
        activeObj = this.requestsList[this.activeItem[0]] || {}
      } else {
        activeObj = this.requestsList[this.activeItem[0]] ? this.requestsList[this.activeItem[0]].children[this.activeItem[1]] : {}
      }
      return activeObj
    },
    saveRequest () {
      this.requestsList = ipcRenderer.sendSync('set-requests', {
        request: this.requestModal.formatData
      })
    },
    showContextMenu (item) {
      ipcRenderer.send('context-menu-request-item', item)
    },
    requestItemDelete (event, data) {
      this.requestsList = data.requests
      this.$Message.success('【' + data.deleted.label + '】删除成功')
    }
  },
  watch: {
    activeItem: {
      immediate: true,
      handler (val) {
        this.$emit('active', this.getActiveObj())
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
      height: 36px;
      margin-left: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  .requests_list {
    position: relative;
    width: 100%;
    height: calc(100% - 36px);
    padding-top: 15px;
    box-sizing: border-box;
    .requests_item {
      width: 100%;
      // min-height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .requests_item_inner {
        width: 100%;
        height: 36px;
        padding: 0 8px;
        box-sizing: border-box;
        background-color: rgba(54, 55, 53, 0);
        transition: all 0.2s ease-in-out;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .requests_item_method {
          font-size: 10px;
          font-weight: bold;
          width: 36px;
          height: 36px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .requests_item_content {
          font-size: 13px;
          // margin-left: 8px;
          width: calc(100% - 40px);
          height: 36px;
          line-height: 36px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: rgb(141, 141, 141);
        }
        &:hover {
          background-color: rgba(54, 55, 53, 1);
          .requests_item_content {
            color: rgb(234, 234, 234);
          }
        }
        &.active {
          background-color: rgba(54, 55, 53, 1);
          .requests_item_content {
            color: rgb(234, 234, 234);
          }
        }
      }
      .requests_item_folder_inner {
        width: 100%;
        min-height: 36px;
        background-color: rgba(54, 55, 53, 0);
        transition: all 0.2s ease-in-out;
        display: flex;
        flex-direction: column;
        color: rgb(141, 141, 141);
        &:hover {
          .requests_item_folder_header {
            color: rgb(234, 234, 234);
          }
        }
        &.active {
          .requests_item_folder_header {
            color: rgb(234, 234, 234);
          }
        }
        .requests_item_folder_header {
          width: 100%;
          height: 36px;
          padding: 0 8px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          // color: rgb(145, 146, 145);
          .requests_item_folder_header_icon {
            width: 36px;
            height: 36px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            svg {
              width: 14px;
              height: 14px;
              fill: rgb(145, 146, 145);
            }
          }
          .requests_item_folder_header_content {
            font-size: 13px;
            margin-left: 8px;
            width: calc(100% - 40px);
            height: 36px;
            line-height: 36px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            // color: rgb(141, 141, 141);
          }
          &:hover {
            background-color: rgba(54, 55, 53, 1);
            .requests_item_folder_header_content {
              color: rgb(234, 234, 234);
            }
          }
          &.active {
            background-color: rgba(54, 55, 53, 1);
            .requests_item_folder_header_content {
              color: rgb(234, 234, 234);
            }
          }
        }
        .requests_item_folder_content {
          width: 100%;
          // height: 120px;
          background-color: rgb(40, 40, 40);
          overflow: hidden;
          transition: all 0.15s ease-in-out;
        }
      }
    }
    .empty_container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      svg {
        width: 48px;
        height: 48px;
        fill: #444;
      }
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
    height: 36px;
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
      height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
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
      height: 36px;
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