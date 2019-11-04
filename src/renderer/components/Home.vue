<template>
  <div class="home">
    <AppHeader></AppHeader>

    <Button type="primary"
            @click="openMenu">打开菜单</Button>
  </div>
</template>

<script>
  import { Button } from 'view-design'
  const { ipcRenderer, remote } = require('electron')

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

      // this.initMenu()
    },
    methods: {
      initMenu () {
        const Menu = remote.Menu
        const MenuItem = remote.MenuItem

        let menuTemplate = [
          {
            label: '帮助',
            role: 'help',
            submenu: [
              {
                label: 'Learn More',
                click: function () { require('electron').shell.openExternal('http://electron.atom.io') }
              },
            ]
          }
        ]

        if (process.platform == 'darwin') {
          var name = remote.app.name;
          menuTemplate.unshift({
            label: name,
            submenu: [
              {
                label: 'About ' + name,
                role: 'about'
              },
              {
                type: 'separator'
              },
              {
                label: 'Services',
                role: 'services',
                submenu: []
              },
              {
                type: 'separator'
              },
              {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
              },
              {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
              },
              {
                label: 'Show All',
                role: 'unhide'
              },
              {
                type: 'separator'
              },
              {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function () { app.quit(); }
              },
            ]
          });
          // Window menu.
          menuTemplate[3].submenu.push(
            {
              type: 'separator'
            },
            {
              label: 'Bring All to Front',
              role: 'front'
            }
          );
        }

        let menu = Menu.buildFromTemplate(menuTemplate)
        Menu.setApplicationMenu(menu)
      },
      openMenu (evt) {
        ipcRenderer.send('open-menu', { name: 'ls' })
      }
    }
  }
</script>

<style scoped>
</style>