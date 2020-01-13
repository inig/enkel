<template>
  <div class="encrypt_container">
    <h1>encrypt</h1>
  </div>
</template>

<script>
import { Button, Input, Upload } from 'view-design'
import { ipcRenderer } from 'electron'
import QRCode from 'qrcode'
// const qrcodeParser = require('qrcode-parser')
// import '@/assets/js/qrcode'
export default {
  name: 'Qrcode',
  components: {
    Button, Input, Upload
  },
  data () {
    return {
      captureBtnDisabled: false,
      qrcodeMessage: '',
      qrcodeFile: null,
      accept: 'image/png,image/jpeg',
      format: ['png', 'jpeg', 'jpg']
    }
  },
  computed: {
    previewQrcodeFile () {
      return this.qrcodeFile ? URL.createObjectURL(this.qrcodeFile) : ''
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
          width: 300,
          heihgt: 300,
          margin: 3
        }, function (err) {
          if (err) {
            throw err
          }
        })
        // let q = qrcode('qrcodeWrapperRef', {
        //   text: this.qrcodeMessage,
        //   width: 300,
        //   heihgt: 300,
        //   colorDark: "#000000",
        //   colorLight: "#ffffff"
        // })
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
      this.qrcodeFile = null
      this.clearFileInput()
    },
    changeQrcodeFile (event) {
      if (event.target.files.length > 0) {
        this.qrcodeFile = event.target.files[0]
        this.qrcodeMessage = ''
        this.decodeQrcodeFile()
      }
    },
    clearFileInput () {
      let fileInput = document.getElementById('qrcodeFileInput')
      fileInput.value = ''
    },
    decodeQrcodeFile () {
      qrcode.decode(this.getObjectURL(this.qrcodeFile))
      qrcode.callback = (imgMsg) => {
        this.qrcodeMessage = imgMsg
      }
    },
    getObjectURL (file) {
      var url = null
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    downloadFile () {
      if (!this.previewQrcodeFile) {
        let content = document.getElementById('qrcodeWrapperRef').toDataURL('image/png')
        let aLink = document.createElement('a')

        aLink.download = 'qrcode.png'
        aLink.href = content

        aLink.click()
      } else {

      }
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
.pen {
  pointer-events: none;
}
.qrcode_container {
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .qrcode_container_left {
    width: 300px;
    height: 100%;
    .qrcode_wrapper {
      position: relative;
      width: 100%;
      height: 300px;
      font-size: 16px;
      color: #bbb;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      overflow: hidden;
      .qrocde_wrapper_blank {
        position: absolute;
        width: 100%;
        height: 300px;
        left: 0;
        top: 0;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .qrcode_drag_container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 300px;
        opacity: 0;
      }
      .qrcode_img_previewer {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
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
    width: calc(~"100% - 315px");
    height: 100%;
  }
}
</style>