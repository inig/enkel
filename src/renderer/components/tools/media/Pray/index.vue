<template>
  <div class="media_pray">
    Media Pray
  </div>
</template>

<script>
export default {
  name: 'MediaPray'
}
</script>

<style lang="less">
.media_pray {
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