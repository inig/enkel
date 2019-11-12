<template>
  <div class="home">
    <!-- <AppHeader></AppHeader> -->

    <Button type="primary"
            @click="openMenu">打开菜单</Button>

    <!-- <Button type="primary"
            @click="capture">屏幕截图</Button> -->
  </div>
</template>

<script>
import { Button } from 'view-design'
import { ipcRenderer, remote, screen, desktopCapturer } from 'electron'

export default {
  name: 'Home',
  components: {
    Button
  },
  mounted () {
    ipcRenderer.on('navigate-to', (event, arg) => {
      if (this.$route.name !== arg.path) {
        this.$router.replace({
          name: arg.path
        })
      }
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
    },
    capture () {
      const displays = screen.getAllDisplays()

      const getDesktopCapturer = displays.map((display, i) => {
        return new Promise((resolve, reject) => {
          desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: display.size
          }, (error, sources) => {
            if (!error) {
              return resolve({
                display,
                thumbnail: sources[i].thumbnail.toDataURL()
              })
            }
            return reject(error)
          })
        })
      })
      Promise.all(getDesktopCapturer).then(sources => {
        ipcRenderer.send('shortcut-capture', sources)
      }).catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>
</style>