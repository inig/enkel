<template>
  <div class="qrcode_container">
    <!-- <Button type="primary"
            @click="captureScreenQrcode">识别屏幕中二维码</Button>
    <pre style="margin-top: 16px;">快捷键：<code style="color: green;">Command + Shift + E</code></pre> -->
    <div class="qrcode_container_left">
      <div class="qrcode_wrapper">
        <div class="qrocde_wrapper_blank"
             v-if="!qrcodeMessage">此处生成二维码</div>
        <canvas id="qrcodeWrapperRef"
                v-else></canvas>
      </div>
      <Button type="primary"
              long
              class="qrcode_download_btn"
              :disabled="!qrcodeMessage">下载</Button>
      <Button type="warning"
              ghost
              long
              class="capture_btn"
              :disabled="captureBtnDisabled"
              @click="captureScreenQrcode">识别屏幕中二维码</Button>
      <pre style="margin-top: 16px; font-size: 12px;">识别屏幕中二维码：<code style="color: green;">Command + Shift + E</code></pre>
    </div>
    <div class="qrcode_container_right">
      <Input placeholder="二维码内容"
             type="textarea"
             class=" custom_textarea"
             v-model="qrcodeMessage"
             autofocus
             @on-keydown="input"
             @on-change="change" />
    </div>
  </div>
</template>

<script>
  import { Button, Input } from 'view-design'
  import { ipcRenderer } from 'electron'
  import QRCode from 'qrcode'
  export default {
    name: 'Qrcode',
    components: {
      Button, Input
    },
    data () {
      return {
        captureBtnDisabled: false,
        qrcodeMessage: ''
      }
    },
    methods: {
      captureScreenQrcode () {
        this.captureBtnDisabled = true
        ipcRenderer.send('capture-screen-qrcode')
        setTimeout(() => {
          this.captureBtnDisabled = false
        }, 1500)
      },
      encodeQrcode () {
        if (this.qrcodeMessage) {
          QRCode.toCanvas(document.getElementById('qrcodeWrapperRef'), this.qrcodeMessage, {
            errorCorrectionLevel: 'H',
            width: 256,
            heihgt: 256,
            margin: 3
          }, function (err) {
            if (err) {
              throw err
            }
          })
        }
      },
      input (e) {
        let keycode = e.charCode || e.keyCode
        if (keycode === 13) {
          if (window.event) {
            window.event.returnValue = false;
          } else {
            e.preventDefault(); //for firefox
          }
        }
      },
      change (e) {
        e.target.value = e.target.value.replace(/\r/ig, '').replace(/\n|\s/ig, '')
        this.qrcodeMessage = e.target.value
      }
    },
    watch: {
      qrcodeMessage (val) {
        setTimeout(() => {
          this.encodeQrcode()
        }, 1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .qrcode_container {
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .qrcode_container_left {
      width: 256px;
      height: 100%;
      .qrcode_wrapper {
        position: relative;
        width: 100%;
        height: 256px;
        font-size: 16px;
        color: #bbb;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        overflow: hidden;
        .qrocde_wrapper_blank {
          position: absolute;
          width: 100%;
          height: 256px;
          left: 0;
          top: 0;
          background-color: #ffffff;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }
      }
      .qrcode_download_btn {
        margin-top: 15px;
      }
      .capture_btn {
        margin-top: 15px;
      }
    }
    .qrcode_container_right {
      width: calc(~"100% - 271px");
      height: 100%;
    }
  }
</style>