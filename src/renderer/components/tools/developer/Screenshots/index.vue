<template>
  <div class="screenshots_container">
    <ESplit v-model="split1"
            min="475px"
            max="500px">
      <div slot="left"
           class="custom_left">
        <div class="address_header">
          <div class="address_header_innner">
            <Input placeholder="地址"
                   v-model="url">
            <Button slot="append">浏览</Button>
            </Input>
          </div>
        </div>
        <div class="address_content">
          <div class="address_content_wrapper">
            <img class="address_content_img"
                 src="~@/assets/phone.png" />
            <div class="address_content_inner">
              <iframe :src="url"
                      frameborder="0"
                      width="100%"
                      height="100%"></iframe>
            </div>
          </div>
        </div>
      </div>
      <div slot="trigger"
           class="custom_trigger">
      </div>
      <div slot="right"
           class="custom_right">
        <Button type="primary"
                @click="screenshot">截图</Button>
      </div>
    </ESplit>
  </div>
</template>

<script>
import { Input, Button } from 'view-design'
import { ipcRenderer } from 'electron'
export default {
  name: 'Screenshots',
  components: {
    Input, Button,
    ESplit: () => import('../../../custom/ESplit')
  },
  data () {
    return {
      split1: 0.5,
      url: 'http://m.zhaopin.com'
    }
  },
  methods: {
    screenshot () {
      ipcRenderer.send('screenshot', {
        url: this.url
      })
    }
  }
}
</script>

<style lang="less" scoped>
.screenshots_container {
  .custom_left {
    width: 100%;
    height: 100%;
    // background-color: rgb(46, 47, 43);
    .address_header {
      width: 100%;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: #f8f8f8;
      border-bottom: 1px solid #eee;
      .address_header_innner {
        width: 90%;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
    .address_content {
      width: 100%;
      height: calc(100% - 48px);
      background-color: #f8f8f8;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
      overflow-y: auto;
      .address_content_wrapper {
        position: relative;
        width: 368px;
        height: 761px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .address_content_img {
          width: 368px;
          margin-top: 4px;
        }
        .address_content_inner {
          position: absolute;
          // width: 300px;
          // height: 620px;
          // width: 260px;
          // height: 462px;
          width: 320px;
          height: 567px;
          background-color: #ffffff;
        }
        iframe {
          // position: absolute;
        }
      }
    }
  }
  .custom_trigger {
    width: 1px;
    height: 100%;
    // background-color: rgb(71, 72, 70);
    background-color: #d0d0d0;
  }
  .custom_right {
    width: 100%;
    height: 100%;
    // background-color: rgb(40, 41, 38);
    .custom_sub_left {
      height: 100%;
    }
    .custom_sub_right {
      height: 100%;
    }
  }
}
</style>