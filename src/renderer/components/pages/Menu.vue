<template>
  <div class="page_menu">
    <AppHeader>菜单</AppHeader>
    <!-- <Button type="error"
            size="small"
            @click="closeMenu">关闭</Button>
    <Button type="primary"
            @click="setBounds">setBounds</Button>

    <hr>
    <Button type="primary"
            ghost
            @click="goto('home')">Home</Button>
    <Button type="primary"
            ghost
            @click="goto('base64')">base64</Button> -->

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
               @click="goto(itm)">
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
  </div>
</template>

<script>
import { Button } from 'view-design'
import { ipcRenderer, desktopCapturer, remote, shell } from 'electron'
import { routes } from '../../router/routes'

const { screen } = remote
const fs = require('fs')
const path = require('path')
const os = require('os')
const qrcodeParser = require('qrcode-parser')

export default {
  name: 'PageMenu',
  components: {
    Button,
    AppHeader: () => import('../parts/AppHeader')
  },
  data () {
    return {
      routes: [],
      errorShown: false
    }
  },
  mounted () {
    this.routes = routes
    ipcRenderer.on('desktop-capturer', this.desktopCapturerHandler)
    ipcRenderer.on('update-message', this.updateMessage)
  },
  methods: {
    closeMenu () {
      ipcRenderer.send('close-menu')
    },
    setBounds () {
      // ipcRenderer.send('close-menu')
      ipcRenderer.send('set-bounds', { width: 300, x: 400 })
    },
    goto (data) {

      // let opt = {
      //   path: data.name
      // }
      // if (data.meta) {
      //   if (data.meta.windowOption) {
      //     opt.windowOption = data.meta.windowOption
      //   }
      // }
      // console.log('>>>>', opt)
      // this.$goto(opt)
      this.$goto(data)
    },
    determineScreenShotSize () {
      const screenSize = screen.getPrimaryDisplay().workAreaSize
      const maxDimension = Math.max(screenSize.width, screenSize.height)
      return {
        width: maxDimension * devicePixelRatio,
        height: maxDimension * devicePixelRatio
      }
    },
    desktopCapturerHandler () {
      let thumbSize = this.determineScreenShotSize()
      let scaled = 'normal'
      if (thumbSize.width > 3000) {
        thumbSize.width = thumbSize.width / devicePixelRatio / 2
        thumbSize.height = thumbSize.width
        scaled = 'small'
      } else if (thumbSize.width < 1000) {
        thumbSize.width = thumbSize.width * devicePixelRatio * 2
        thumbSize.height = thumbSize.width
        scaled = 'large'
      }
      let options = {
        types: ['screen'],
        thumbnailSize: thumbSize
      }
      desktopCapturer.getSources(options, (error, sources) => {
        this.errorShown = false
        if (error) {
          return console.log(error)
        }
        sources.forEach(source => {
          // if (source.name === 'Enntire screen' || source.name === 'Screen 1') {
          const screenshotPath = path.join(os.tmpdir(), `screenshot-${source.display_id}.png`)
          ipcRenderer.send('show-modal-loading')
          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (err) => {

            if (err) {
              return console.log(err)
            }
            // shell.openExternal(`file://${screenshotPath}`)
            // setTimeout(() => {
            qrcodeParser(`file://${screenshotPath}`).then(res => {
              // alert(res.data + '+++++' + JSON.stringify(res.location, null, 2))
              ipcRenderer.send('show-shortcuts', Object.assign({}, res.location, {
                dpr: devicePixelRatio || 2,
                message: res.data,
                screenId: source.display_id,
                scaled: scaled
              }))
              this.errorShown = true
            }).catch(err => {
              setTimeout(() => {
                if ((sources.length === 1) || !this.errorShown) {
                  this.errorShown = true
                  alert('未发现二维码')
                }
              }, 300)
              ipcRenderer.send('hide-modal-loading')
            })
            // }, 50)

          })
          // }
        })
      })
    },
    updateMessage (event, data) {
      console.log('update-message', JSON.stringify(data, null, 2))
    }
  }
}
</script>

<style lang="less" scoped>
.page_menu {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
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
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          &:hover {
            background-color: #eeeeee;
          }
          &:nth-child(even) {
            margin-left: 15px;
          }
          &:nth-child(n + 3) {
            margin-top: 15px;
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
              line-height: 16px;
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
}
</style>