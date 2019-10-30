<template>
  <div class="page_menu">
    <AppHeader>菜单</AppHeader>
    <Button type="error"
            size="small"
            @click="closeMenu">关闭</Button>
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