<template>
  <transition name="fade">
    <div class="copy_icon"
         :style="containerStyles"
         @click="clickFunc"
         v-if="show">
      <Tooltip content="复制"
               placement="left"
               transfer
               :style="svgStyles">
        <svg :style="svgStyles">
          <use xlink:href="#copy"></use>
        </svg>
      </Tooltip>
    </div>
  </transition>
</template>

<script>
  import { clipboard } from 'electron'
  import { Tooltip } from 'view-design'
  export default {
    name: 'Copy',
    components: {
      Tooltip
    },
    props: {
      size: {
        type: [String, Number],
        default: 20
      },
      color: {
        type: String,
        default: '#888'
      },
      bgColor: {
        type: String,
        default: 'transparent'
      },
      data: {
        type: String,
        default: ''
      },
      alwaysShow: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      containerStyles () {
        return {
          width: parseInt(this.size) + 'px',
          height: parseInt(this.size) + 'px',
          backgroundColor: this.bgColor
        }
      },
      svgStyles () {
        return {
          width: parseInt(this.size) + 'px',
          height: parseInt(this.size) + 'px',
          fill: this.color
        }
      }
    },
    data () {
      return {
        show: false
      }
    },
    created () {
      this.show = this.alwaysShow
    },
    mounted () {
      if (!this.alwaysShow) {
        this.$el.parentNode.removeEventListener('mouseenter', this.showFunc)
        this.$el.parentNode.removeEventListener('mouseleave', this.hideFunc)

        this.$el.parentNode.addEventListener('mouseenter', this.showFunc, false)
        this.$el.parentNode.addEventListener('mouseleave', this.hideFunc, false)
      }
    },
    methods: {
      showFunc () {
        this.show = true
      },
      hideFunc () {
        setTimeout(() => {
          this.show = this.alwaysShow
        }, 300)
      },
      clickFunc () {
        // if (this.data) {
        clipboard.writeText(this.data)
        this.$Message.success({
          content: '复制成功'
        })
        // }
      }
    }
  }
</script>

<style lang="less" scoped>
  .copy_icon {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
</style>