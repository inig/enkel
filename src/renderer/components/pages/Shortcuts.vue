<template>
  <div class="settings_shortcuts"
       :style="{left: show ? 0 : '100%'}">
    <div class="settings_shortcuts_header">
      <div class="settings_shortcuts_header_back"
           @click="back">
        <Icon type="ios-arrow-back"
              color="#fff"
              size="20" />
      </div>
    </div>

    <div class="settings_shortcuts_content">
      <p>全局快捷键</p>
      <Table :columns="globalShortcutsColumns"
             :data="globalShortcuts"
             border
             stripe></Table>

      <p>局部快捷键</p>
      <Table :columns="globalShortcutsColumns"
             :data="shortcuts"
             border
             stripe></Table>
    </div>
  </div>
</template>

<script>
  import { Button, Icon, Table, Input } from 'view-design'
  export default {
    name: 'SettingsShortcuts',
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Button, Icon, Table, Input
    },
    data () {
      return {
        globalShortcuts: [
          {
            command: '打开/关闭菜单',
            key: 'Command + Shift + S'
          },
          {
            command: '识别屏幕中二维码',
            key: 'Command + Shift + E'
          },
          {
            command: '网络请求',
            key: 'Command + Shift + R'
          }
        ],
        shortcuts: [
          {
            command: '打开设置面板',
            key: 'Command + ,'
          }
        ],
        globalShortcutsColumns: [
          {
            title: '命令',
            key: 'command'
          },
          {
            title: '快捷键',
            key: 'key',
            width: 200,
            align: 'center'
          }
        ]
      }
    },
    methods: {
      back () {
        this.$emit('hide')
      }
    }
  }
</script>

<style lang="less" scoped>
  .settings_shortcuts {
    position: absolute;
    z-index: 9999;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #eee;
    transition: left 0.25s ease-in-out;
    .settings_shortcuts_header {
      position: relative;
      width: 100%;
      height: 48px;
      background-color: #2e2f2b;
      .settings_shortcuts_header_back {
        position: absolute;
        width: 48px;
        height: 48px;
        left: 0;
        top: 0;
        opacity: 0.8;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        &:hover {
          opacity: 1;
        }
      }
    }
    .settings_shortcuts_content {
      width: 100%;
      height: calc(~"100% - 48px");
      overflow-y: auto;
      overflow-x: hidden;
      p {
        position: sticky;
        left: 0;
        top: 0;
        z-index: 9999;
        background-color: #eee;
        color: #333;
        font-weight: bold;
        font-size: 14px;
        line-height: 42px;
        padding: 0 15px;
      }
    }
  }
</style>