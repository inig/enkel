<template>
  <div class="container"
       @click="hide">
    <code>
      <pre>{{JSON.stringify(info, null, 2)}}</pre>
    </code>
  </div>
</template>

<script>
  export default {
    name: 'ProfileChatWindow',
    props: {
      info: {
        type: [Object, Array],
        default () {
          return {}
        }
      }
    },
    methods: {
      hide () {
        this.$emit('hide')
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>