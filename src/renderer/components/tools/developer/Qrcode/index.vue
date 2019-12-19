<template>
  <div class="qrcode_container">
    <Button type="primary"
            @click="captureScreenQrcode">识别屏幕中二维码</Button>
    <pre style="margin-top: 16px;">快捷键：<code style="color: green;">Command + Shift + E</code></pre>
  </div>
</template>

<script>
  import { Button } from 'view-design'
  import { ipcRenderer } from 'electron'
  export default {
    name: 'Qrcode',
    components: {
      Button
    },
    methods: {
      captureScreenQrcode () {
        ipcRenderer.send('capture-screen-qrcode')
      }
    }
  }
</script>

<style scoped>
  .qrcode_container {
    padding: 15px;
    box-sizing: border-box;
  }
</style>