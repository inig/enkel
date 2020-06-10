<template>
  <div class="encrypt_container">
    <e-split v-model="split">
      <!-- <Input slot="left"
             class="no_resize encrypt_text encrypt_container_left"
             type="textarea"
             placeholder="明文"
             :value="originStr"
             @on-change="changeOriginStr" />

      <Input slot="right"
             class="no_resize encrypt_text encrypt_container_right"
             type="textarea"
             placeholder="密文"
             :value="targetStr"
             readonly /> -->
      <div slot="left"
           class="input_box origin_box"
           ref="originBoxRef">
        <Input class="no_resize encrypt_text encrypt_container_left"
               type="textarea"
               placeholder="明文"
               v-model="originStr"
               @on-change="changeOriginStr" />
        <copy style="position: absolute; right: 25px; top: 25px;"
              :data="originStr"></copy>
      </div>
      <div slot="right"
           class="input_box origin_box">
        <div class="transformed_box">
          <json-view class="json_target"
                     :data="targetJson"
                     v-if="showJsonView"></json-view>
          <Input slot="right"
                 class="no_resize encrypt_text encrypt_container_right"
                 type="textarea"
                 placeholder="密文"
                 :value="targetStr"
                 readonly
                 v-else />
        </div>
        <copy style="position: absolute; right: 30px; top: 30px;"
              :data="JSON.stringify(targetJson, null, 2)"></copy>
      </div>
    </e-split>
  </div>
</template>

<script>
import { Input } from "view-design"
export default {
  name: 'EncryptContent',
  props: {
    targetStr: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {
    Input,
    ESplit: () => import('../../../custom/ESplit'),
    JsonView: () => import('../../../custom/json-view'),
    Copy: () => import('../../../custom/Copy')
  },
  data () {
    return {
      split: 0.5,
      originStr: '',
      targetJson: {}
    }
  },
  computed: {
    showJsonView () {
      let f = false
      if (!this.targetStr || !this.targetStr.trim()) {
        f = false
      } else {
        try {
          this.targetJson = JSON.parse(this.targetStr)
          f = true
        } catch (err) {
          f = false
        }
      }
      return f
    }
  },
  methods: {
    changeOriginStr (data) {
      this.$emit('change', data.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.encrypt_container {
  width: 100%;
  height: 100%;

  .encrypt_text {
    width: 100%;
    height: 100%;
    background: #fff;
  }

  &_left {
    // padding-right: 15px;
  }

  &_right {
    // padding-left: 15px;
  }
}
</style>
<style lang="less">
.encrypt_container .encrypt_text textarea.ivu-input {
  height: 100%;
  transition: none;
  &:hover {
    border-color: #dcdee2;
  }
  &:focus {
    border-color: #dcdee2;
    box-shadow: none;
  }
}

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
</style>