<template>
  <div class="tool_container base64_container">
    <ESplit v-model="split">
    </ESplit>
  </div>
</template>

<script>
// import { Split } from 'view-design'
export default {
  name: 'Base64',
  components: {
    ESplit: () => import('../../custom/ESplit')
  },
  data () {
    return {
      split: 0.5
    }
  }
}
</script>

<style lang="less" scoped>
.tool_container {
  height: 100%;
}
</style>