<template>
  <div class="response_preview_container">
    <!-- <div class="response_preview"
         v-html="transformedValue">

    </div> -->
    <div class="response_preview"
         style="padding-left: 15px;"
         v-if="typeof data === 'string'">{{data}}</div>
    <json-view class="response_preview"
               :data="data"
               v-if="typeof data !== 'string' && (Object.keys(data).length > 0)"></json-view>
    <copy style="position: absolute; right: 15px; top: 0px;"
          :data="JSON.stringify(data, null, 2)"
          v-if="typeof data !== 'string' && (Object.keys(data).length > 0)"></copy>
    <transition name="fade">
      <div class="empty_container"
           v-if="!data || (Object.keys(data).length === 0)">
        <svg>
          <use xlink:href="#empty"></use>
        </svg>
      </div>
    </transition>
  </div>
</template>

<script>
import Copy from '../../../custom/Copy'
// import '../../../../../../static/js/jquery.json'
// import '../../../../../../static/js/json2'
// import '../../../../../../static/js/jsonlint'
export default {
  name: 'ResponsePreview',
  components: {
    Copy,
    JsonView: () => import('../../../custom/json-view')
  },
  props: {
    data: {
      type: [Object, String],
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // originValue: '',
      // currentJson: '',
      // currentJsonStr: ''
    }
  },
  computed: {
    // transformedValue () {
    //   let result = ''
    //   let data = JSON.stringify(this.data)
    //   if (data !== '') {
    //     let originValue = data
    //     try {
    //       this.currentJson = jsonlint.parse(originValue)
    //       this.currentJsonStr = JSON.stringify(this.currentJson)
    //       result = new JSONFormat(originValue, 4).toString()
    //     } catch (e) {
    //       result = '<span style="color: #f1592a; font-weight: bold;">' + e + '</span>'
    //       this.currentJsonStr = result
    //     }
    //     return result
    //   } else {
    //     return ''
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.response_preview_container {
  position: relative;
  -webkit-user-select: text;
  height: 100%;
  .response_preview {
    position: relative;
    width: 100%;
    height: calc(100% - 30px);
    padding: 0 10px 0 0;
    box-sizing: border-box;
    overflow-y: auto;
    color: #c8c8c8;
  }
  .empty_container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 64px;
      height: 64px;
      fill: #444;
    }
  }
}
</style>