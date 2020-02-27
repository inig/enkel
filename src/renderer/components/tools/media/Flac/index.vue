<template>
  <div class="container">
    <iframe src="https://www.baidu.com"
            style="width: 100%; height: 100%;"
            frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'MediaFlac'
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>