<template>
  <div class="home">
    <AppHeader></AppHeader>

    <Button type="primary"
            @click="openMenu">打开菜单</Button>
  </div>
</template>

<script>
import { Button } from 'view-design'
const { ipcRenderer } = require('electron')

export default {
  name: 'Home',
  components: {
    Button,
    AppHeader: () => import('./parts/AppHeader')
  },
  mounted () {
    ipcRenderer.on('opened-menu', (event, arg) => {
      console.log('opened menu: ', arg)
    })
  },
  methods: {
    openMenu (evt) {
      ipcRenderer.send('open-menu', { name: 'ls' })
    }
  }
}
</script>

<style scoped>
</style>