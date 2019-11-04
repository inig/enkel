<template>
  <div class="app_header">
    <slot>
      Enkel
    </slot>
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
  color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  -webkit-user-select: none;
}
</style>