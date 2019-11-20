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
            <Tooltip placement="bottom"
                     :offset="4"
                     content="设置页面属性">
              <div class="address_header_settings">
                <Icon type="ios-cog"
                      size="28" />
              </div>
            </Tooltip>
          </div>
        </div>
        <div class="emulator_settings">
          <Select v-model="options.deviceType"
                  size="small"
                  style="width: 150px;">
            <Option v-for="(item, index) in allDevices"
                    :key="item.label"
                    :value="item.label"
                    :label="item.label">
              <span style="margin-right: 15px;">{{item.label}}</span>
              <span style="float:right; color:#ccc;">{{item.width}} &times; {{item.height}} dpr: {{item.dpr}}</span>
            </Option>
          </Select>
          <Input placeholder="宽"
                 size="small"
                 style="width: 50px;"
                 :readonly="options.deviceType != 'Responsive'"
                 :disabled="options.deviceType != 'Responsive'"
                 v-model="options.width" />
          <span style="margin: 0 8px;">&times;</span>
          <Input placeholder="高"
                 size="small"
                 style="width: 50px;"
                 :readonly="options.deviceType != 'Responsive'"
                 :disabled="options.deviceType != 'Responsive'"
                 v-model="options.height" />
          <Input size="small"
                 placeholder="dpr"
                 type="number"
                 v-model="options.dpr"
                 :readonly="options.deviceType != 'Responsive'"
                 :disabled="options.deviceType != 'Responsive'"
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
               :style="{width: options.width * parseFloat(emulatorScale / 100) + 'px', height: options.height * parseFloat(emulatorScale / 100) + 'px'}">
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
        <div class="right_header">设置</div>
        <Form :label-width="80"
              style="padding: 15px; box-sizing: border-box;">
          <FormItem label="模拟器">
            <Select v-model="options.deviceType">
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
                   :readonly="options.deviceType != 'Responsive'"
                   :disabled="options.deviceType != 'Responsive'"
                   placeholder="模拟器宽度" />
          </FormItem>
          <FormItem label="高">
            <Input v-model="options.height"
                   :readonly="options.deviceType != 'Responsive'"
                   :disabled="options.deviceType != 'Responsive'"
                   placeholder="模拟器高度" />
          </FormItem>
          <FormItem label="设备像素比dpr">
            <Input v-model="options.dpr"
                   :readonly="options.deviceType != 'Responsive'"
                   :disabled="options.deviceType != 'Responsive'"
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
        </div>
      </div>
    </ESplit>
  </div>
</template>

<script>
  import { Input, Button, Icon, Tooltip, Select, Option, Form, FormItem, Slider } from 'view-design'
  import { ipcRenderer } from 'electron'
  export default {
    name: 'Screenshots',
    components: {
      Input, Button, Icon, Tooltip, Select, Option, Form, FormItem, Slider,
      ESplit: () => import('../../../custom/ESplit')
    },
    data () {
      return {
        split1: 0.5,
        url: 'http://m.zhaopin.com',
        allDevices2: {
          'Responsive': {
            width: 800,
            height: 600,
            dpr: 2,
            deviceType: 'Responsive'
          },
          'iPhone 5/SE': {
            deviceType: 'iPhone 5/SE',
            width: 320,
            height: 568,
            dpr: 2
          },
          'iPhone 6/7/8': {
            deviceType: 'iPhone 6/7/8',
            width: 375,
            height: 667,
            dpr: 2
          },
          'iPhone 6/7/8 Plus': {
            deviceType: 'iPhone 6/7/8 Plus',
            width: 414,
            height: 736,
            dpr: 3
          },
          'iPhone X': {
            deviceType: 'iPhone X',
            width: 375,
            height: 812,
            dpr: 3
          },
          'iPad': {
            deviceType: 'iPad',
            width: 768,
            height: 1024,
            dpr: 2
          },
          'iPad Pro': {
            deviceType: 'iPad Pro',
            width: 1024,
            height: 1366,
            dpr: 2
          }
        },
        allDevices: [
          {
            label: 'Responsive',
            width: 800,
            height: 600,
            dpr: 2
          },
          {
            label: 'iPhone 5/SE',
            width: 320,
            height: 568,
            dpr: 2
          },
          {
            label: 'iPhone 6/7/8',
            width: 375,
            height: 667,
            dpr: 2
          },
          {
            label: 'iPhone 6/7/8 Plus',
            width: 414,
            height: 736,
            dpr: 3
          },
          {
            label: 'iPhone X',
            width: 375,
            height: 812,
            dpr: 3
          },
          {
            label: 'iPad',
            width: 768,
            height: 1024,
            dpr: 2
          },
          {
            label: 'iPad Pro',
            width: 1024,
            height: 1366,
            dpr: 2
          }
        ],
        emulatorScale: 100,
        options: {
          width: 800,
          height: 600,
          dpr: 2,
          deviceType: 'Responsive'
        }
      }
    },
    methods: {
      screenshot () {
        // ipcRenderer.send('screenshot', {
        //   url: this.url,
        //   width: this.options.width,
        //   height: this.options.height,
        //   dpr: this.options.dpr
        // })
        ipcRenderer.send('open-save', {
          type: 'screenshot',
          options: {
            url: this.url,
            width: this.options.width,
            height: this.options.height,
            dpr: this.options.dpr
          }
        })
      }
    },
    watch: {
      'options.deviceType': {
        // immediate: true,
        handler (val) {
          this.options = JSON.parse(JSON.stringify(this.allDevices2[val]))
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
      // background-color: rgb(40, 41, 38);
      .custom_sub_left {
        height: 100%;
      }
      .custom_sub_right {
        height: 100%;
      }
      .right_header {
        width: 100%;
        height: 48px;
        background-color: #f8f8f8;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
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
    }
  }
</style>