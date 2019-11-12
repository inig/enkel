<template>
  <div class="tool_container base64_container">
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
        <Button type="primary"
                size="small"
                @click="encode">编码</Button>
        <div class="trigger_area_trigger_item">
          <svg>
            <use :xlink:href="'#drag-move-horizontal'"></use>
          </svg>
        </div>
        <Button type="primary"
                size="small"
                @click="decode">解码</Button>
      </div>
      <div slot="right"
           class="input_box transformed_box">
        <Input v-model="transformedValue"
               type="textarea"
               class="custom_textarea disabled"
               readonly
               placeholder="解码内容" />
        <copy style="position: absolute; right: 25px; top: 25px;"
              :data="transformedValue"></copy>
      </div>
    </ESplit>
  </div>
</template>

<script>
import { Input, Button } from 'view-design'
import Copy from '../../custom/Copy'
import { Base64 } from 'js-base64'
export default {
  name: 'Base64',
  components: {
    Input, Button,
    Copy,
    ESplit: () => import('../../custom/ESplit')
  },
  data () {
    return {
      split: 0.5,
      originValue: '',
      transformedValue: ''
    }
  },
  methods: {
    encode () {
      if (this.originValue.trim()) {
        this.transformedValue = Base64.encode(this.originValue.trim())
      }
    },
    decode () {
      if (this.originValue.trim()) {
        this.transformedValue = Base64.decode(this.originValue.trim())
      }
    }
  },
  watch: {
    originValue (val) {
      if (val.trim()) {
        this.transformedValue = Base64.encode(val.trim())
      } else {
        this.transformedValue = ''
      }
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