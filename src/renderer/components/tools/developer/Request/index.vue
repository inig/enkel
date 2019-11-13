<template>
  <div class="tool_container base64_container">
    <!-- <Button type="primary"
            @click="openDrawer">历史</Button>

    <Drawer placement="left"
            class-name="custom_drawer"
            v-model="drawerShown">
      <div class="custom_header"
           slot="header">
        headers
      </div>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer> -->
    <ESplit v-model="split1"
            max="300px">
      <div slot="left"
           class="custom_left">
        <PanelList :request-methods="requestMethods"></PanelList>
      </div>
      <div slot="trigger"
           class="custom_trigger">
      </div>
      <div slot="right"
           class="custom_right">
        <ESplit v-model="split2"
                min="60px">
          <div slot="left"
               class="custom_sub_left"></div>
          <div slot="trigger"
               class="custom_trigger">
          </div>
          <div slot="right"
               class="custom_sub_right"></div>
        </ESplit>
      </div>
    </ESplit>
  </div>
</template>

<script>
  import { Drawer, Button } from 'view-design'
  export default {
    name: 'Request',
    components: {
      Drawer, Button,
      ESplit: () => import('../../../custom/ESplit'),
      PanelList: () => import('./PanelList')
    },
    data () {
      return {
        drawerShown: false,
        split1: 0.5,
        split2: 0.5,
        requestMethods: [
          {
            name: 'GET',
            color: '#745be6'
          },
          {
            name: 'POST',
            color: 'rgb(94, 160, 33)'
          }
        ]
      }
    },
    methods: {
      openDrawer () {
        this.drawerShown = true
      }
    }
  }
</script>

<style lang="less" scoped>
  .tool_container {
    height: 100%;
    .input_box {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding: 15px;
      box-sizing: border-box;
    }
    .custom_left {
      width: 100%;
      height: 100%;
      background-color: rgb(46, 47, 43);
    }
    .custom_trigger {
      width: 1px;
      height: 100%;
      background-color: rgb(71, 72, 70);
    }
    .custom_right {
      width: 100%;
      height: 100%;
      background-color: rgb(40, 41, 38);
    }
  }
</style>