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
          <FormItem :label-width="20"
                    v-if="requestModal.paramFormatShown">
            <div class="format_param_container"></div>
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
  import { Input, Dropdown, DropdownMenu, DropdownItem, Button, Icon, Modal, Form, FormItem, Select, Option } from 'view-design'
  export default {
    name: 'RequestPanelList',
    components: {
      Input, Dropdown, DropdownMenu, DropdownItem, Button, Icon, Modal, Form, FormItem, Select, Option
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
            url: '',
            label: '',
            method: ''
          }
        },
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
      formatParams (str) { },
      toggleParamsFormat () {
        if (!this.requestModal.formatData.url) {
          alert('url不能为空')
          return
        }
        if (!this.requestModal.paramFormatShown) {
          // 格式化参数
        }
        this.requestModal.paramFormatShown = !this.requestModal.paramFormatShown
      }
    }
  }
</script>

<style lang="less" scoped>
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
  }
</style>