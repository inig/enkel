<template>
  <div class="app_header">

  </div>
</template>

<script>
  export default {
    name: 'AppHeader'
  }
</script>

<style lang="less" scoped>
  @import url("../../themes/index.less");
  .app_header {
    width: 100%;
    height: 48px;
    background-color: @primary-color;
    -webkit-app-region: drag;
  }
</style>