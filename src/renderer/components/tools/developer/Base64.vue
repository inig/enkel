<template>
  <div class="tool_container base64_container">
    <ESplit v-model="split">
      <div slot="left"
           class="input_box origin_box"
           ref="originBoxRef">
        <Input v-model="originValue"
               type="textarea"
               class="no_resize ta_h_100p ta_bg_gray custom_textarea"
               placeholder="待编码内容" />
        <copy style="position: absolute; right: 25px; top: 25px;"
              :data="originValue"></copy>
      </div>
      <div slot="right"
           class="input_box transformed_box"></div>
    </ESplit>
  </div>
</template>

<script>
  import { Input } from 'view-design'
  import Copy from '../../custom/Copy'
  export default {
    name: 'Base64',
    components: {
      Input,
      Copy,
      ESplit: () => import('../../custom/ESplit')
    },
    data () {
      return {
        split: 0.5,
        originValue: '',
        transformedValue: ''
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