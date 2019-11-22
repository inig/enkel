<template>
  <div class="home">
    <!-- <AppHeader></AppHeader> -->

    <Button type="primary"
            @click="openMenu">打开菜单</Button>

    <div class="page_menu_content">
      <div class="menu_item"
           v-for="(item, index) in routes"
           :key="index">
        <div class="menu_item_title">{{item.name}}</div>
        <div class="menu_item_content">
          <div class="menu_card_item"
               v-for="(itm, idx) in item.routes"
               :key="idx"
               v-if="itm.meta"
               @click="goto(itm.name)">
            <div class="menu_card_item_left">
              <svg>
                <use :xlink:href="itm.meta.icon"></use>
              </svg>
            </div>
            <div class="menu_card_item_right">
              <div class="menu_card_item_title">{{itm.meta.label}}</div>
              <div class="menu_card_item_desc">{{itm.meta.desc}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <Button type="primary"
            @click="capture">屏幕截图</Button> -->
  </div>
</template>

<script>
  import { Button } from 'view-design'
  import { ipcRenderer, remote, screen, desktopCapturer } from 'electron'
  import { routes } from '../router/routes'

  export default {
    name: 'Home',
    components: {
      Button
    },
    data () {
      return {
        routes: []
      }
    },
    created () {
      this.routes = routes
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
      },
      goto (name) {
        this.$goto(name)
      }
    }
  }
</script>

<style lang="less" scoped>
  .page_menu_content {
    width: 100%;
    height: calc(~"100% - 48px");
    overflow-x: hidden;
    overflow-y: auto;
    .menu_item {
      cursor: pointer;
      width: 100%;
      .menu_item_title {
        position: sticky;
        width: 100%;
        height: 32px;
        left: 0;
        top: 0;
        border-bottom: 1px solid #f8f8f8;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: #ffffff;
        color: #333;
      }
      .menu_item_content {
        width: 100%;
        background-color: #fafafa;
        padding: 15px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        .menu_card_item {
          width: 165px;
          height: 64px;
          border: 1px solid #eeeeee;
          border-radius: 4px;
          margin: 8px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          &:hover {
            background-color: #eeeeee;
          }
          &:nth-child(even) {
            // margin-left: 15px;
          }
          &:nth-child(n + 3) {
            // margin-top: 15px;
          }
          .menu_card_item_left {
            width: 48px;
            height: 64px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            svg {
              width: 32px;
              height: 32px;
              fill: #888;
            }
          }
          .menu_card_item_right {
            width: 117px;
            height: 64px;
            padding: 0 5px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .menu_card_item_title {
              width: 100%;
              height: 28px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            }
            .menu_card_item_desc {
              width: 100%;
              height: 36px;
              font-size: 10px;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              -webkit-line-clamp: 2;
              word-break: break-all;
              color: #888;
              // display: flex;
              // flex-direction: row;
              // align-items: center;
              // justify-content: flex-start;
            }
          }
        }
      }
    }
  }
</style>