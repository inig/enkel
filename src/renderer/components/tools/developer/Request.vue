<template>
  <div class="tool_container base64_container">
    <Button type="primary"
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
    </Drawer>

  </div>
</template>

<script>
import { Drawer, Button } from 'view-design'
export default {
  name: 'Request',
  components: {
    Drawer, Button
  },
  data () {
    return {
      drawerShown: false
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
}
</style>