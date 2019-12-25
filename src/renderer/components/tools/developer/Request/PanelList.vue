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
    <div class="requests_list_top_blank"></div>
    <div class="requests_list"
         id="list">
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
          <div class="requests_item_content">【<span v-html="filterLabel(item.label, filterText)"></span>】<span v-html="filterLabel(item.url, filterText)"></span></div>
        </div>
        <div class="requests_item_folder_inner"
             :class="[activeItem[0] === index ? 'active' : '', openedItem.indexOf(item.id) > -1 ? 'opened' : '']"
             v-if="(item.type === 'folder')"
             @contextmenu="showContextMenu(item)">
          <!-- v-if="(item.type === 'folder') || (item.label.toLowerCase().indexOf(filterText.toLowerCase()) > -1)" -->
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
            <div class="requests_item_folder_header_content"><span v-html="filterLabel(item.label, filterText)"></span></div>
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
                   @contextmenu="showContextMenu(itm, item)"
                   v-if="(itm.type === 'request') && ((item.label.toLowerCase().indexOf(filterText.toLowerCase()) > -1) || (itm.url.toLowerCase().indexOf(filterText.toLowerCase()) > -1 || itm.label.toLowerCase().indexOf(filterText.toLowerCase()) > -1))">
                <div class="requests_item_method"
                     :style="{color: colors[itm.method.toLowerCase()]}">{{itm.method}}</div>
                <div class="requests_item_content">【<span v-html="filterLabel(itm.label, filterText)"></span>】<span v-html="filterLabel(itm.url, filterText)"></span></div>
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
    <div class="requests_footer">
      <ButtonGroup style="width: 100%;">
        <Button class="requests_footer_btn requests_footer_btn_export"
                type="primary"
                @click="exportRequests">
          <svg>
            <use xlink:href="#export"></use>
          </svg>
          导出
        </Button>
        <Button class="requests_footer_btn requests_footer_btn_import"
                type="primary"
                @click="importRequests">
          导入
          <svg>
            <use xlink:href="#import"></use>
          </svg>
        </Button>
      </ButtonGroup>
    </div>

    <Modal v-model="requestModal.shown"
           title="新建请求"
           @on-ok="saveRequest">
      <Form :label-width="90">
        <FormItem label="目录"
                  v-if="requestModal.parent">
          <Input placeholder="目录"
                 disabled
                 readonly
                 :value="requestModal.parent.label" />
        </FormItem>
        <FormItem label="请求描述">
          <Input placeholder="请输入请求描述"
                 v-model="requestModal.formatData.label" />
        </FormItem>
        <FormItem label="请求地址">
          <Input placeholder="请输入请求地址"
                 v-model="requestModal.formatData.url"
                 @on-change="changeUrl">
          <Button class="request_footer_btn"
                  type="text"
                  slot="append"
                  :disabled="formatedParams.length < 1"
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
        <transition name="fade">
          <FormItem v-if="requestModal.formatData.method.toLowerCase() === 'post'"
                    label="POST 参数">
            <RequestBody v-model="requestModal.formatData.body"
                         theme="light"
                         ref="newRequestJsonBodyRef"
                         style="height: 200px; width: 100%;"></RequestBody>
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

    <Modal v-model="modifyModal.shown"
           title="修改请求"
           @on-ok="modifyRequest">
      <Form :label-width="80">
        <FormItem label="请求描述">
          <Input placeholder="请输入请求描述"
                 v-model="modifyModal.formatData.label" />
        </FormItem>
        <FormItem label="请求地址">
          <Input placeholder="请输入请求地址"
                 v-model="modifyModal.formatData.url"
                 @on-change="changeModifyUrl">
          <Button class="request_footer_btn"
                  type="text"
                  slot="append"
                  @click="toggleModifyParamsFormat">参数</Button>
          </Input>
        </FormItem>
        <transition name="fade">
          <FormItem :label-width="10"
                    v-if="modifyModal.paramFormatShown && formatedModifyParams.length > 0">
            <div class="format_param_container">
              <div class="format_param_item"
                   v-for="(item, index) in formatedModifyParams"
                   :key="index"
                   @mouseenter="hoverInItem"
                   @mouseleave="hoverOutItem">
                <div class="params_item_status">
                  <Checkbox v-model="item.status"
                            size="small"
                            @on-change="disableModifyParamItem"></Checkbox>
                </div>
                <div class="params_item_label">
                  <Input class="w100p fs12"
                         v-model="item.key"
                         @on-change="changeModifyFormatedParams"
                         size="small" />
                </div>
                <div class="params_item_value">
                  <Input class="w100p"
                         v-model="item.value"
                         @on-change="changeModifyFormatedParams"
                         size="small" />
                </div>
                <div class="params_item_delete"
                     @click="deleteModifyItem(index)">
                  <Icon type="md-close"
                        size="20"
                        color="#ed4014" />
                </div>
              </div>
            </div>
          </FormItem>
        </transition>
        <transition name="fade">
          <FormItem v-if="modifyModal.formatData.method.toLowerCase() === 'post'"
                    label="POST 参数">
            <RequestBody v-model="modifyModal.formatData.body"
                         theme="light"
                         ref="modifyRequestJsonBodyRef"
                         style="height: 200px; width: 100%;"></RequestBody>
          </FormItem>
        </transition>
        <FormItem label="请求方式">
          <Select v-model="modifyModal.formatData.method">
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
                 clearable
                 @on-keyup.13="createFolder"
                 v-model="folderModal.formatData.label" />
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="modifyFolderModal.shown"
           title="修改文件夹"
           @on-ok="modifyFolder">
      <Form :label-width="80">
        <FormItem label="名称">
          <Input placeholder="请输入文件夹名称"
                 clearable
                 @on-keyup.13="modifyFolder"
                 v-model="modifyFolderModal.formatData.label" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { Input, Dropdown, DropdownMenu, DropdownItem, ButtonGroup, Button, Icon, Modal, Form, FormItem, Select, Option, Checkbox } from 'view-design'
  import { ipcRenderer, remote } from 'electron'
  import path from 'path'
  const { Menu, MenuItem } = remote
  export default {
    name: 'RequestPanelList',
    components: {
      Input, Dropdown, DropdownMenu, DropdownItem, ButtonGroup, Button, Icon, Modal, Form, FormItem, Select, Option, Checkbox,
      RequestBody: () => import('./RequestBody')
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
            url: '',
            label: '',
            method: 'GET',
            body: {},
            header: {},
            cookie: {}
          }
        },
        formatedParams: [],
        formatedModifyParams: [],
        folderModal: {
          shown: false,
          formatData: {
            label: ''
          }
        },
        modifyFolderModal: {
          shown: false,
          formatData: {
            label: ''
          }
        },
        modifyModal: {
          shown: false,
          paramFormatShown: false,
          formatData: {
            url: '',
            label: '',
            method: 'GET',
            body: {},
            header: {},
            cookie: {}
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
      },
      filterLabel () {
        return function (text, filter) {
          let outHtml = ''
          let reg = new RegExp(filter, 'ig')
          outHtml = text.replace(reg, item => '<span class="emphasize">' + item + '</span>')
          return outHtml
        }
      },
      allDirs () {
        return this.requestsList.filter(item => item.type === 'folder')
      }
    },
    created () {
      this.getRequestsList()
      this.$emit('active', this.getActiveObj())
      ipcRenderer.on('contextmenu-tool-request-delete', this.requestItemDelete)
      ipcRenderer.on('contextmenu-tool-request-modify', this.requestItemModify)
      ipcRenderer.on('requests-updated', this.requestsUpdated)
      ipcRenderer.on('import-requests-success', this.importRequestsSuccess)
    },
    methods: {
      exportRequests () {
        let result = ipcRenderer.sendSync('export-requests')
        if (result) {
          this.$Notice.success({
            desc: '请求列表导出成功'
          })
        }
      },
      importRequests () {
        this.requestsList = ipcRenderer.sendSync('import-requests')
      },
      importRequestsSuccess () {
        this.$Notice.success({
          desc: '导入成功'
        })
      },
      openRequestModal (args) {
        this.requestModal.shown = true
        if (args && args.parent) {
          this.requestModal.parent = args.parent
        } else {
          this.requestModal.parent = null
        }
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
      toggleModifyParamsFormat () {
        if (!this.modifyModal.formatData.url) {
          alert('url不能为空')
          return
        }
        if (!this.modifyModal.paramFormatShown) {
          // 格式化参数
          this.formatedModifyParams = this.formatParams(this.modifyModal.formatData.url)
        }
        this.modifyModal.paramFormatShown = !this.modifyModal.paramFormatShown
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
      deleteModifyItem (index) {
        this.formatedModifyParams.splice(Number(index), 1)
        this.setModifyUrlStr(this.formatedModifyParams)
      },
      setModifyUrlStr (data) {
        let params = JSON.parse(JSON.stringify(data))
        let i = 0
        let outArr = []
        for (i; i < params.length; i++) {
          if (params[i].status) {
            outArr.push(params[i].key + '=' + params[i].value)
          }
        }
        this.modifyModal.formatData.url = this.modifyModal.formatData.url.replace(/^([^?]*)(\?)(.*)$/, '$1') + (outArr.length > 0 ? ('?' + outArr.join('&')) : outArr.join('&'))
      },
      disableModifyParamItem () {
        this.setModifyUrlStr(this.formatedModifyParams)
      },
      changeModifyFormatedParams (e) {
        this.setModifyUrlStr(this.formatedModifyParams)
      },
      changeModifyUrl () {
        this.formatedModifyParams = this.formatParams(this.modifyModal.formatData.url)
      },
      createFolder () {
        this.folderModal.shown = false
        this.requestsList = ipcRenderer.sendSync('set-requests-folder', {
          label: this.folderModal.formatData.label
        })
        this.$Notice.success({
          desc: `创建目录【${this.folderModal.formatData.label}】成功`
        })
      },
      modifyFolder () {
        this.modifyFolderModal.shown = false
        this.requestsList = ipcRenderer.sendSync('modify-requests-folder', this.modifyFolderModal.formatData)
        this.$Notice.success({
          desc: `修改目录【${this.modifyFolderModal.formatData.label}】成功`
        })
      },
      getRequestsList () {
        this.requestsList = ipcRenderer.sendSync('get-requests')
      },
      openMenu (id) {
        let index = this.openedItem.indexOf(id)
        if (index < 0) {
          this.openedItem.push(id)
        }
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
        if (index > -1) {
          if (subindex > -1) {
            global.eventHub.$emit('set-title', {
              label: this.requestsList[index].children[subindex].label,
              url: this.requestsList[index].children[subindex].url.replace(/^([^?]*)(\?.*)$/, '$1')
            })
          } else {
            global.eventHub.$emit('set-title', {
              label: this.requestsList[index].label,
              url: this.requestsList[index].label.replace(/^([^?]*)(\?.*)$/, '$1')
            })
          }
        }
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
        if (this.requestModal.parent && this.requestModal.parent.id) {
          this.openMenu(this.requestModal.parent.id)
        }
        this.requestsList = ipcRenderer.sendSync('set-requests', {
          request: this.requestModal.formatData,
          parent: this.requestModal.parent
        })
        this.$Notice.success({
          desc: `创建请求【${this.requestModal.formatData.label}】成功`
        })
        this.resetAfterNewRequest()
      },
      resetAfterNewRequest () {
        this.requestModal = {
          shown: false,
          paramFormatShown: false,
          formatData: {
            url: '',
            label: '',
            method: 'GET',
            body: {},
            header: {},
            cookie: {}
          }
        }
      },
      modifyRequest () {
        this.requestsList = ipcRenderer.sendSync('modify-requests', {
          request: this.modifyModal.formatData
        })
        this.$Notice.success({
          desc: `修改请求【${this.modifyModal.formatData.label}】成功`
        })
        // global.eventHub.$emit('request-modified', this.modifyModal.formatData)
      },
      moveToDir (request, dir) {
        this.requestsList = ipcRenderer.sendSync('move-request-to-dir', {
          request: request,
          dir: dir
        })
        this.$Notice.success({
          desc: `请求【${request.label}】已经移至目录【${dir.label}】`
        })
      },
      moveOutFromDir (request, dir) {
        this.requestsList = ipcRenderer.sendSync('move-request-out-from-dir', {
          request: request,
          dir: dir
        })
        this.$Notice.success({
          desc: `请求【${request.label}】已经被移出目录【${dir.label}】`
        })
      },
      showContextMenu (item, parent) {
        // ipcRenderer.send('contextmenu-tool-request', item)
        const menu = new Menu()
        if (item.type === 'folder') {
          menu.append(new MenuItem({
            label: '新建请求',
            // icon: path.resolve(__dirname, '../../../../assets/add.png'),
            click: () => {
              this.openRequestModal({
                parent: item
              })
            }
          }))
          menu.append(new MenuItem({
            type: 'separator'
          }))
        } else {
          if (parent) {
            menu.append(new MenuItem({
              label: `移出目录【${parent.label}】`,
              click: () => {
                this.moveOutFromDir(item, parent)
              }
            }))
          } else {
            let submenus = this.allDirs.map(itm => {
              return {
                label: itm.label,
                click: () => {
                  this.moveToDir(item, itm)
                }
              }
            })
            menu.append(new MenuItem({
              label: '移动到',
              submenu: submenus
            }))
          }
          menu.append(new MenuItem({
            type: 'separator'
          }))
        }

        menu.append(new MenuItem({
          label: '删除',
          click: async () => {
            this.$Modal.confirm({
              title: `确定删除<span style="color: green;">【${item.label}】</span>吗`,
              render (h) {
                return h('div', {
                  style: {
                    paddingLeft: '40px',
                    boxSizing: 'border-box'
                  }
                }, [
                  h('span', {
                    style: {
                      color: '#ed4014'
                    }
                  }, '删除后将无法恢复，请确认后再操作')
                ])
              },
              onOk: () => {
                this.requestsList = ipcRenderer.sendSync('remove-request', item)
                this.$Notice.success({
                  desc: '【' + item.label + '】删除成功'
                })
              }
            })
          }
        }))
        menu.append(new MenuItem({
          label: '修改',
          click: () => {
            this.requestItemModify(null, item)
          }
        }))
        menu.popup({ window: remote.getCurrentWindow() })
      },
      requestItemDelete (event, data) {
        this.requestsList = data.requests
        // this.$Message.success('【' + data.deleted.label + '】删除成功')
        this.$Notice.success({
          desc: '【' + data.deleted.label + '】删除成功'
        })
      },
      requestItemModify (event, data) {
        if (data.type === 'folder') {
          this.modifyFolderModal.shown = true
          this.modifyFolderModal.formatData = JSON.parse(JSON.stringify(data))
        } else {
          this.modifyModal.shown = true
          this.modifyModal.formatData = JSON.parse(JSON.stringify(data))
        }
      },
      requestsUpdated (event, data) {
        this.requestsList = data
        this.$Notice.success({
          desc: '请求列表已经更新'
        })
      }
    },
    watch: {
      activeItem: {
        immediate: true,
        handler (val) {
          this.$emit('active', this.getActiveObj())
        }
      },
      'folderModal.shown': {
        handler (val) {
          if (val) {
            this.$nextTick(() => {
              this.$refs.newFolderInputRef.focus()
            })
          }
        }
      },
      'modifyFolderModal.shown': {
        handler (val) {
          if (val) {
            this.$nextTick(() => {
              this.$refs.modifyFolderInputRef.focus()
            })
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
    padding: 10px 0 0 0;
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
        white-space: nowrap;
      }
    }
    .requests_list_top_blank {
      position: absolute;
      left: 0;
      top: 61px;
      z-index: 1;
      width: 100%;
      height: 36px;
      background-color: #2e2f2b;
    }
    .requests_list {
      position: relative;
      width: 100%;
      height: calc(100% - 36px - 48px - 15px);
      // padding-top: 15px;
      margin-top: 15px;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
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
            border-left: 5px solid #5ea021;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
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
            z-index: 2;
            padding: 0 8px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: sticky;
            left: 0;
            top: 0;
            // background-color: #2e2f2b;
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
    .requests_footer {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .requests_footer_btn {
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        svg {
          width: 14px;
          height: 14px;
        }
        &.requests_footer_btn_export {
          width: 40%;
          border-top: 1px solid #474846;
          box-sizing: border-box;
          border-radius: 0;
          color: #2db7f5;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          svg {
            margin-right: 8px;
            transform: scale(0.9);
            fill: #2db7f5;
          }
        }
        &.requests_footer_btn_import {
          width: 60%;
          border-left: 1px solid #474846;
          border-top: 1px solid #474846;
          color: rgb(94, 160, 33);
          border-radius: 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          svg {
            margin-left: 8px;
            fill: rgb(94, 160, 33);
          }
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