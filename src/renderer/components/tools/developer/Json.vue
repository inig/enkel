<template>
  <div class="tool_container json_container">
    <ESplit v-model="split">
      <div slot="left"
           class="input_box origin_box"
           ref="originBoxRef">
        <Input v-model="originValue"
               type="textarea"
               class="custom_textarea"
               placeholder="待编码内容" />
        <copy style="position: absolute; right: 25px; top: 25px;"
              :data="originValue"></copy>
      </div>
      <div slot="trigger"
           class="trigger_area_trigger">
        <div class="trigger_area_trigger_item">
          <svg>
            <use :xlink:href="'#drag-move-horizontal'"></use>
          </svg>
        </div>
      </div>
      <div slot="right"
           class="input_box">
        <!-- <div class="json_target"
             v-html="transformedValue"></div> -->
        <div class="transformed_box">
          <json-view class="json_target"
                     :data="targetValue"
                     v-if="originValue"></json-view>
          <copy style="position: absolute; right: 15px; top: 15px;"
                :data="JSON.stringify(targetValue, null, 2)"></copy>
        </div>
      </div>
    </ESplit>
  </div>
</template>

<script>
import { Input } from 'view-design'
import Copy from '../../custom/Copy'
import { remote } from 'electron'
import { FindInPage } from 'electron-find'
// import '../../../../../static/js/jquery.json'
// import '../../../../../static/js/json2'
// import '../../../../../static/js/jsonlint'
export default {
  name: 'Json',
  components: {
    Input,
    Copy,
    JsonView: () => import('../../custom/json-view'),
    ESplit: () => import('../../custom/ESplit')
  },
  data () {
    return {
      split: 0.5,
      originValue: '',
      findInPage: null,
      inputEvent: null
      // currentJson: '',
      // currentJsonStr: ''
    }
  },
  computed: {
    targetValue () {
      let out = {}
      try {
        out = JSON.parse(this.originValue)
      } catch (err) {
        out = {}
      }
      return out
    }
    // transformedValue () {
    //   let result = ''
    //   if (this.originValue !== '') {
    //     let originValue = this.originValue
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
  },
  mounted () {
    this.findInPage = new FindInPage(remote.getCurrentWebContents(), {
      parentElement: document.querySelector('.transformed_box'),
      boxBgColor: '#333',
      boxShadowColor: '#000',
      inputColor: '#aaa',
      inputBgColor: '#222',
      inputFocusColor: '#555',
      textColor: '#aaa',
      textHoverBgColor: '#555',
      caseSelectedColor: '#555',
      offsetTop: 63,
      offsetRight: 18,
      preload: true
    })

    this.inputEvent = document.createEvent('HTMLEvents')
    this.inputEvent.initEvent('input', true, true)

    this.$nextTick(() => {
      let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
      isMac && (this.platform = 'mac')
      window.onkeydown = (ev) => {
        if (this.$route.name === 'json') {
          if (this.platform === 'mac') {
            if (ev.metaKey && ev.keyCode === 70) {
              // mac下 command + shift + s
              this.toggleFilterInput()
            }
          } else {
            if (ev.ctrlKey && ev.keyCode === 70) {
              // windows下  control + shift + s 保存
              this.toggleFilterInput()
            }
          }
        }
      }
    })
  },
  methods: {
    toggleFilterInput () {
      var txt = window.getSelection ? window.getSelection() : document.selection.createRange().text
      let input = document.querySelector('.find-input')
      if (input) {
        input.value = txt

        input.dispatchEvent(this.inputEvent)
      }
      this.findInPage.openFindWindow()
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
    .transformed_box {
      position: relative;
      width: 100%;
      height: 100%;
      -webkit-user-select: text;
      overflow-y: auto;
      background-color: #282926;
    }
  }
}
.trigger_area_trigger {
  width: 20px;
  height: 100%;
  // margin-left: -10px;
  cursor: ew-resize;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .trigger_area_trigger_item {
    width: 20px;
    height: 20px;
    background-color: #333;
    border-radius: 3px;
    transition: all 0.2s ease-in-out;
    margin: 8px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &:hover {
      transform: scale(1.1);
    }
    svg {
      width: 16px;
      height: 16px;
      fill: #ffffff;
    }
  }
}
</style>