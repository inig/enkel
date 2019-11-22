<template>
  <div class="shell_container">
    <Input placeholder="npm包名"
           v-model="moduleName" />
    <Button type="primary"
            @click="npmInstall">安装</Button>
  </div>
</template>

<script>
  import { Input, Button } from 'view-design'
  import { ipcRenderer } from 'electron'
  export default {
    name: 'Shell',
    components: {
      Input, Button
    },
    data () {
      return {
        moduleName: ''
      }
    },
    methods: {
      npmInstall () {
        if (!this.moduleName || !this.moduleName.trim()) {
          this.$Message.error('请输入NPM包名')
        } else {
          ipcRenderer.send('shell-npm-install', {
            moduleName: this.moduleName
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
</style>