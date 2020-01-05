<template>
  <div class="media_fm_recommend">
    <div class="media_fm_mood_header">推荐电台</div>
    <div class="media_fm_mood_content">
      本栏目暂无内容
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaFmRecommend'
}
</script>

<style lang="less" scoped>
.media_fm_recommend {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .media_fm_mood_header {
    width: 100%;
    height: 42px;
    background-color: #222629;
    color: #ffffff;
    border-left: 1px solid #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .media_fm_mood_content {
    width: 100%;
    height: calc(~"100% - 42px");
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
}
</style>