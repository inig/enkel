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
  </div>
</template>

<script>
import { Button } from 'view-design'
import { ipcRenderer } from 'electron'
import { routes } from '../../router/routes'

export default {
  name: 'PageMenu',
  components: {
    Button,
    AppHeader: () => import('../parts/AppHeader')
  },
  data () {
    return {
      routes: []
    }
  },
  mounted () {
    this.routes = routes
  },
  methods: {
    closeMenu () {
      ipcRenderer.send('close-menu')
    },
    setBounds () {
      // ipcRenderer.send('close-menu')
      ipcRenderer.send('set-bounds', { width: 300, x: 400 })
    },
    goto (name) {
      this.$goto(name)
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