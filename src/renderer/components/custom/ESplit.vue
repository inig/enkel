<template>
  <Split v-model="split"
         :min="min"
         :max="max"
         :mode="mode"
         @on-moving="changeSplit"
         @on-move-start="moveStart"
         @on-move-end="moveEnd">
    <div slot="left"
         v-if="mode === 'horizontal'"
         class="left">
      <slot name="left">
        Left Pane
      </slot>
    </div>

    <div slot="trigger"
         class="trigger_area">
      <slot name="trigger">
        <div class="trigger_area_item">
          <svg>
            <use :xlink:href="'#drag-move-' + mode"></use>
          </svg>
        </div>
      </slot>
    </div>

    <div slot="right"
         v-if="mode === 'horizontal'"
         class="right">
      <slot name="right">
        Right Pane
      </slot>
    </div>
  </Split>
</template>

<script>
import { Split } from 'view-design'
export default {
  name: 'ESplit',
  components: {
    Split
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Number, String],
      default: 0.5
    },
    mode: {
      type: String,
      default: 'horizontal'
    },
    min: {
      type: [Number, String],
      default: '40px'
    },
    max: {
      type: [Number, String],
      default: '40px'
    }
  },
  data () {
    return {
      split: 0.5
    }
  },
  created () {
    this.split = this.value
  },
  methods: {
    changeSplit (event) {
      this.$emit('change', this.split)
      this.$emit('on-moving', event)
    },
    moveStart (event) {
      this.$emit('on-move-start', event)
    },
    moveEnd (event) {
      this.$emit('on-move-end', event)
    }
  }
}
</script>

<style lang="less" scoped>
.left {
  height: 100%;
  // padding-right: 15px;
  box-sizing: border-box;
}
.right {
  height: 100%;
  // padding-left: 15px;
  box-sizing: border-box;
}
.trigger_area {
  width: 20px;
  height: 100%;
  margin-left: -10px;
  cursor: ew-resize;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  &:hover {
    .trigger_area_item {
      transform: scale(1.1);
    }
  }
  .trigger_area_item {
    width: 20px;
    height: 20px;
    background-color: #333;
    border-radius: 3px;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 16px;
      height: 16px;
      fill: #ffffff;
    }
  }
}
</style>