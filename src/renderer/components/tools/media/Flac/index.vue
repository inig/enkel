<template>
  <div class="container">
    <Button type="primary"
            @click="getRealPath">获取真实地址</Button>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import { Button } from 'view-design'
  export default {
    name: 'MediaFlac',
    components: {
      Button
    },
    data () {
      return {
        url: 'https://pan.baidu.com/s/1bo9Rajl', // 资源地址
        code: 't864' // 提取码
      }
    },
    methods: {
      getPlayList () {

      },
      getRealPath () {
        ipcRenderer.send('flac-get-real-path', {
          url: this.url,
          code: this.code
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    position: relative;
    -webkit-app-region: drag;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>