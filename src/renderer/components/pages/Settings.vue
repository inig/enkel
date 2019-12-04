<template>
  <div class="settings_container">
    <div class="settings_items">
      暂无设置
      <!-- <div class="settings_item_title">
        快捷键设置
      </div>
      <div class="settings_item_content">
        <Form :label-width="130">
          <FormItem label="识别屏幕中二维码">
            <Input placeholder="快捷键"
                   :value="qrcodeShortcut"
                   @on-keydown="changeShortcutKey" />
          </FormItem>
        </Form>
      </div> -->
    </div>
  </div>
</template>

<script>
import { Form, FormItem, Input } from 'view-design'
export default {
  name: 'Settings',
  components: {
    Form, FormItem, Input
  },
  data () {
    return {
      qrcodeShortcut: ''
    }
  },
  methods: {
    changeShortcutKey (e) {
      console.log(e.key)
      if (e.key === 'Backspace') {
        this.qrcodeShortcut = ''
      } else {
        this.qrcodeShortcut = (!this.qrcodeShortcut ? '' : ' + ') + this.qrcodeShortcut
      }
    }
  }
}
</script>

<style lang="less" scoped>
.settings_container {
  overflow-x: hidden;
  overflow-y: auto;
  .settings_item_title {
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
  .settings_item_content {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #f8f8f8;
    .settings_item {
      width: 100%;
      height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>