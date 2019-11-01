<template>
  <div class="page_menu">
    <AppHeader>菜单</AppHeader>
    <Button type="error"
            size="small"
            @click="closeMenu">关闭</Button>
    <Button type="primary"
            @click="setBounds">setBounds</Button>
  </div>
</template>

<script>
  import { Button } from 'view-design'
  const { ipcRenderer } = require('electron')

  export default {
    name: 'PageMenu',
    components: {
      Button,
      AppHeader: () => import('../parts/AppHeader')
    },
    methods: {
      closeMenu () {
        ipcRenderer.send('close-menu')
      },
      setBounds () {
        // ipcRenderer.send('close-menu')
        ipcRenderer.send('set-bounds', { width: 300, x: 400 })
      }
    }
  }
</script>

<style scoped>
  .page_menu {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
</style>