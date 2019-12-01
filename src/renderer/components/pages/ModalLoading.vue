<template>
  <div class="modal_loading_container">
    <Loading></Loading>
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>