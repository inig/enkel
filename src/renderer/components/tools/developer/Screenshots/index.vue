<template>
  <div class="screenshots_container">
    <ESplit v-model="split1"
            min="550px">
      <div slot="left"
           class="custom_left">
        <div class="address_header">
          <div class="address_header_innner">
            <Input placeholder="地址"
                   v-model="url">
            <Button slot="append">浏览</Button>
            </Input>
            <!-- <Tooltip placement="bottom"
                     :offset="4"
                     content="设置页面属性">
              <div class="address_header_settings">
                <Icon type="ios-cog"
                      size="28" />
              </div>
            </Tooltip> -->
          </div>
        </div>
        <div class="emulator_settings">
          <Select v-model="options.name"
                  size="small"
                  style="width: 150px;">
            <Option v-for="(item, index) in devices"
                    :key="item.name"
                    :value="item.name"
                    :label="item.name">
              <span style="margin-right: 15px;">{{item.name}}</span>
              <span style="float:right; color:#ccc;">{{item.viewport.width}} &times; {{item.viewport.height}} dpr: {{item.viewport.deviceScaleFactor}}</span>
            </Option>
          </Select>
          <Input placeholder="宽"
                 size="small"
                 style="width: 50px;"
                 :readonly="options.name != 'Responsive'"
                 :disabled="options.name != 'Responsive'"
                 v-model="options.viewport.width" />
          <span style="margin: 0 8px;">&times;</span>
          <Input placeholder="高"
                 size="small"
                 style="width: 50px;"
                 :readonly="options.name != 'Responsive'"
                 :disabled="options.name != 'Responsive'"
                 v-model="options.viewport.height" />
          <Input size="small"
                 placeholder="dpr"
                 type="number"
                 v-model="options.viewport.deviceScaleFactor"
                 :readonly="options.name != 'Responsive'"
                 :disabled="options.name != 'Responsive'"
                 style="width: 100px; margin-left: 15px;">
          <span slot="prepend">dpr</span>
          </Input>
          <Input v-model="emulatorScale"
                 size="small"
                 placeholder="缩放比例"
                 style="width: 120px; margin-left: 15px;">
          <span slot="prepend">缩放</span>
          <span slot="append">%</span>
          </Input>
        </div>
        <div class="address_content">
          <div class="emulator_wrapper"
               :style="{width: options.viewport.width * parseFloat(emulatorScale / 100) + 'px', height: options.viewport.height * parseFloat(emulatorScale / 100) + 'px'}">
            <iframe :src="url"
                    frameborder="0"
                    width="100%"
                    height="100%"></iframe>
          </div>
        </div>
      </div>
      <div slot="trigger"
           class="custom_trigger">
      </div>
      <div slot="right"
           class="custom_right">
        <div class="right_header">
          <Button type="primary"
                  class="screenshot_btn"
                  @click="screenshot">截图</Button>
          设置
        </div>
        <Tabs :animated="true">
          <TabPane label="模拟器设置">
            <Form :label-width="80"
                  style="padding: 15px; box-sizing: border-box;">
              <FormItem label="模拟器">
                <Select v-model="options.name">
                  <Option v-for="(item, index) in devices"
                          :key="item.name"
                          :value="item.name"
                          :label="item.name">
                    <span style="margin-right: 15px;">{{item.name}}</span>
                    <span style="float:right; color:#ccc;">{{item.viewport.width}} &times; {{item.viewport.height}} dpr: {{item.viewport.deviceScaleFactor}}</span>
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="宽">
                <Input v-model="options.viewport.width"
                       :readonly="options.name != 'Responsive'"
                       :disabled="options.name != 'Responsive'"
                       placeholder="模拟器宽度" />
              </FormItem>
              <FormItem label="高">
                <Input v-model="options.viewport.height"
                       :readonly="options.name != 'Responsive'"
                       :disabled="options.name != 'Responsive'"
                       placeholder="模拟器高度" />
              </FormItem>
              <FormItem label="设备像素比dpr">
                <Input v-model="options.viewport.deviceScaleFactor"
                       :readonly="options.name != 'Responsive'"
                       :disabled="options.name != 'Responsive'"
                       placeholder="设备像素比 dpr" />
              </FormItem>
              <FormItem>
                <div slot="label">
                  <Tooltip placement="top"
                           content="仅用于预览页面，不作截图参数"
                           :transfer="true">缩放</Tooltip>
                </div>
                <Slider v-model="emulatorScale"
                        :min="30"
                        :max="200"
                        :step="1"
                        :tip-format="(v) => v + '%'"
                        show-tip="always"></Slider>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="Cookie">
            <div class="screenshot_form_item"
                 v-for="(item, index) in cookies"
                 :key="index"
                 @mouseenter="hoverInItem"
                 @mouseleave="hoverOutItem">
              <div class="screenshot_form_item_select">
                <Checkbox size="small"
                          v-model="item.status"
                          @on-change="disableParamItem"></Checkbox>
              </div>

              <div class="screenshot_form_item_key">
                <Input placeholder="key"
                       v-model="item.key"
                       @on-keydown="noEmptyInput" />
              </div>

              <div class="screenshot_form_item_value">
                <Input placeholder="value"
                       v-model="item.value"
                       @on-keydown="noEmptyInput" />
              </div>

              <div class="screenshot_form_item_delete"
                   @click="deleteItem(index)">
                <Icon type="md-close"
                      size="20"
                      color="#ed4014" />
              </div>
            </div>
            <div class="screenshot_form_item">
              <div class="screenshot_form_item_select">
              </div>
              <div class="screenshot_form_item_key"
                   @click="addNewItem">
                <Input placeholder="New key"
                       readonly />
              </div>

              <div class="screenshot_form_item_value"
                   @click="addNewItem">
                <Input placeholder="New value"
                       readonly />
              </div>

              <div class="screenshot_form_item_delete">
              </div>
            </div>
          </TabPane>
          <TabPane label="LocalStorage">
          </TabPane>
          <TabPane label="Js脚本">
            <div class="scripts_wrapper">
              <div class="scripts_item_label">注入脚本</div>
              <div class="scripts_item_value">
                <Input placeholder="注入脚本"
                       v-model="scripts"
                       type="textarea" />
              </div>
            </div>
          </TabPane>
        </Tabs>
        <!-- <Form :label-width="80"
              style="padding: 15px; box-sizing: border-box;">
          <FormItem label="模拟器">
            <Select v-model="options.name">
              <Option v-for="(item, index) in allDevices"
                      :key="item.label"
                      :value="item.label"
                      :label="item.label">
                <span style="margin-right: 15px;">{{item.label}}</span>
                <span style="float:right; color:#ccc;">{{item.width}} &times; {{item.height}} dpr: {{item.dpr}}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem label="宽">
            <Input v-model="options.width"
                   :readonly="options.name != 'Responsive'"
                   :disabled="options.name != 'Responsive'"
                   placeholder="模拟器宽度" />
          </FormItem>
          <FormItem label="高">
            <Input v-model="options.height"
                   :readonly="options.name != 'Responsive'"
                   :disabled="options.name != 'Responsive'"
                   placeholder="模拟器高度" />
          </FormItem>
          <FormItem label="设备像素比dpr">
            <Input v-model="options.dpr"
                   :readonly="options.name != 'Responsive'"
                   :disabled="options.name != 'Responsive'"
                   placeholder="设备像素比 dpr" />
          </FormItem>
          <FormItem>
            <div slot="label">
              <Tooltip>缩放</Tooltip>
            </div>
            <Slider v-model="emulatorScale"
                    :min="30"
                    :max="200"
                    :step="1"
                    :tip-format="(v) => v + '%'"
                    show-tip="always"></Slider>
          </FormItem>
        </Form>
        <div class="cookies_contaner">
          <div class="cookies_container_label">Cookies</div>
          <div class="cookies_items">
            <div class="cookies_item">s</div>
          </div>
        </div>
        <div class="footer_operation">
          <Button type="primary"
                  @click="screenshot">截图</Button>
        </div> -->
      </div>
    </ESplit>
  </div>
</template>

<script>
import { Input, Button, Icon, Tooltip, Select, Option, Form, FormItem, Slider, Tabs, TabPane, Checkbox } from 'view-design'
import { ipcRenderer } from 'electron'
const devices = require('puppeteer/DeviceDescriptors')
export default {
  name: 'Screenshots',
  components: {
    Input, Button, Icon, Tooltip, Select, Option, Form, FormItem, Slider, Tabs, TabPane, Checkbox,
    ESplit: () => import('../../../custom/ESplit')
  },
  data () {
    let _devices = JSON.parse(JSON.stringify(devices))
    _devices.unshift({
      name: 'Responsive',
      userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Mobile Safari/537.36',
      viewport: {
        width: 800,
        height: 600,
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
      }
    })
    return {
      split1: 0.5,
      url: 'http://m.zhaopin.com',
      emulatorScale: 100,
      options: {
        name: 'iPhone 6',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false
        }
      },
      cookies: [
        {
          key: 'at',
          value: '567b08bb841d4c718e563e38d1bc2e9f',
          status: true
        },
        {
          key: 'rt',
          value: '7e465863c1364038a0864722e40dc67d',
          status: true
        }
      ],
      // scripts: `let warningSpan = document.querySelector('.warning-span')\nwarningSpan && warningSpan.click()`,
      scripts: `let warningSpan = document.querySelector('.risk-warning__content button')\nwarningSpan && warningSpan.click()`,
      devices: _devices
    }
  },
  methods: {
    screenshot () {
      ipcRenderer.send('open-save', {
        type: 'screenshot',
        url: this.url,
        viewport: this.options.viewport,
        cookies: this.getCookies(),
        scripts: this.scripts
      })
    },
    getCookies () {
      return this.cookies.filter(item => item.status)
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
    addNewItem () {
      this.cookies.push({
        key: '',
        value: '',
        status: true
      })
    },
    deleteItem (index) {
      this.cookies.splice(Number(index), 1)
    },
    disableParamItem () {
      this.$emit('change', this.cookies)
    },
    noEmptyInput (evt) {
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault()
      }
    }
  },
  watch: {
    'options.name': {
      // immediate: true,
      handler (val) {
        this.options = JSON.parse(JSON.stringify(this.devices.filter(item => item.name === val)[0]))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.screenshots_container {
  .custom_left {
    width: 100%;
    height: 100%;
    // background-color: rgb(46, 47, 43);
    .address_header {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: #f8f8f8;
      border-bottom: 1px solid #eee;
      .address_header_innner {
        width: calc(100% - 30px);
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .address_header_settings {
          width: 38px;
          height: 30px;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          i {
            margin-top: 10px;
          }
        }
      }
    }
    .emulator_settings {
      width: 100%;
      height: 32px;
      background-color: #f8f8f8;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .address_content {
      width: 100%;
      height: calc(100% - 48px - 32px);
      background-color: #f8f8f8;
      padding: 15px;
      box-sizing: border-box;
      overflow: auto;
      .emulator_wrapper {
        background-color: #c8c8c8;
        border: 1px solid #c8c8c8;
        margin: 0 auto;
        transform-origin: left top;
        transition: all 0.2s ease-in-out;
      }
    }
  }
  .custom_trigger {
    width: 1px;
    height: 100%;
    // background-color: rgb(71, 72, 70);
    background-color: #d0d0d0;
  }
  .custom_right {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    // background-color: rgba(0, 0, 0, 0.8);
    .custom_sub_left {
      height: 100%;
    }
    .custom_sub_right {
      height: 100%;
    }
    .right_header {
      position: relative;
      width: 100%;
      height: 48px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .screenshot_btn {
        position: absolute;
        left: 15px;
      }
    }
    .scripts_wrapper {
      width: 100%;
      min-height: 128px;
      padding: 15px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      .scripts_item_label {
        width: 80px;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      .scripts_item_value {
        width: calc(100% - 80px);
        min-height: 128px;
        padding-left: 12px;
        box-sizing: border-box;
      }
    }
    .cookies_contaner {
      width: 100%;
      min-height: 32px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      .cookies_container_label {
        width: 80px;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
      }
      .cookies_items {
        width: calc(100% - 80px);
        min-height: 32px;
        max-height: 160px;
        overflow-x: hidden;
        overflow-y: auto;
        padding-left: 12px;
        box-sizing: border-box;
        .cookies_item {
          width: 100%;
          height: 32px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .footer_operation {
      width: 100%;
      height: 36px;
      padding: 0 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
    .screenshot_form_item {
      width: 100%;
      height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .screenshot_form_item_select {
        width: 30px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
      }
      .screenshot_form_item_key {
        width: calc(40% - 35px);
      }
      .screenshot_form_item_value {
        width: calc(60% - 35px);
        margin-left: 10px;
      }
      .screenshot_form_item_delete {
        width: 30px;
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
        .screenshot_form_item_delete {
          opacity: 1;
        }
      }
    }
  }
}
</style>