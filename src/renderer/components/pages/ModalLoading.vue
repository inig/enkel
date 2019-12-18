<template>
  <div class="modal_loading_container">
    <Loading></Loading>
    <pre>识别中...</pre>
  </div>
</template>

<script>
export default {
  name: 'ModalLoading',
  components: {
    Loading: () => import('../custom/Loading')
  }
}
</script>

<style lang="less" scoped>
.modal_loading_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pre {
    margin-top: 8px;
    color: #eca054;
  }
}
</style>