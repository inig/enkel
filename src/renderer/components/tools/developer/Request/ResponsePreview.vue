<template>
  <div class="response_preview_container">
    <div class="response_preview"
         v-html="transformedValue">

    </div>
    <copy style="position: absolute; right: 15px; top: 0px;"
          :data="JSON.stringify(data)"></copy>
  </div>
</template>

<script>
import Copy from '../../../custom/Copy'
import '../../../../../../static/js/jquery.json'
import '../../../../../../static/js/json2'
import '../../../../../../static/js/jsonlint'
export default {
  name: 'ResponsePreview',
  components: {
    Copy
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      originValue: '',
      currentJson: '',
      currentJsonStr: ''
    }
  },
  computed: {
    transformedValue () {
      let result = ''
      let data = JSON.stringify(this.data)
      if (data !== '') {
        let originValue = data
        try {
          this.currentJson = jsonlint.parse(originValue)
          this.currentJsonStr = JSON.stringify(this.currentJson)
          result = new JSONFormat(originValue, 4).toString()
        } catch (e) {
          result = '<span style="color: #f1592a; font-weight: bold;">' + e + '</span>'
          this.currentJsonStr = result
        }
        return result
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.response_preview_container {
  height: 100%;
  .response_preview {
    position: relative;
    width: 100%;
    height: calc(100% - 30px);
    padding: 0 15px;
    box-sizing: border-box;
    overflow-y: auto;
  }
}
</style>