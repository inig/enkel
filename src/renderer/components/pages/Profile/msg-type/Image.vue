<template>
  <div class="msg_text"
       :style="[containerStyles]">
    <div class="msg_text_time"
         :style="[timeStyles]">
      <span style="color: #888;"
            :style="[nameStyles]"
            v-if="info.content.from_name">{{info.content.from_name}}</span>
      {{info.ctime_ms | msgTimeFilter}}</div>
    <div class="msg_text_box"
         :style="[theme, boxStyles]">
      <img v-lazy="renderInfo.content && renderInfo.content.msg_body && renderInfo.content.msg_body.imageUrl">
    </div>
    <div class="msg_text_arrow"
         :style="[arrowStyles]">
      <div class="triangle"
           :style="[theme]"></div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('./store/modules')
export default {
  name: 'MsgBoxImage',
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    userInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      leftTheme: {
        backgroundColor: '#eee',
        color: '#555'
      },
      rightTheme: {
        backgroundColor: '#19be6b',
        color: '#fff'
      },
      renderInfo: {}
    }
  },
  computed: {
    getImageUrl () {
      return function (media_id) {

      }
    },
    theme () {
      return (this.userInfo.phonenum !== this.info.content.from_id) ? this.leftTheme : this.rightTheme
    },
    containerStyles () {
      return (this.userInfo.phonenum !== this.info.content.from_id) ? {
        alignItems: 'flex-start'
      } : {
          alignItems: 'flex-end'
        }
    },
    nameStyles () {
      return (this.userInfo.phonenum !== this.info.content.from_id) ? {
        marginRight: '10px'
      } : {
          marginLeft: '10px'
        }
    },
    timeStyles () {
      return (this.userInfo.phonenum !== this.info.content.from_id) ? {
        marginLeft: '10px'
      } : {
          marginRight: '10px',
          display: 'flex',
          flexDirection: 'row-reverse'
        }
    },
    boxStyles () {
      return (this.userInfo.phonenum !== this.info.content.from_id) ? {
        marginLeft: '10px'
      } : {
          marginRight: '10px'
        }
    },
    arrowStyles () {
      return (this.userInfo.phonenum !== this.info.content.from_id) ? {
        left: '5px',
        transform: 'rotate(30deg)'
      } : {
          right: '2px',
          transform: 'rotate(-30deg)'
        }
    }
  },
  async created () {

  },
  methods: {
    ...mapActions([
      'moduleIM'
    ]),
    getResource (id) {
      return new Promise(async (resolve) => {
        let resourceResponse = await this.$store.dispatch('moduleIM/getResourceUrl', {
          id: id
        })
        if (resourceResponse.code === 0) {
          resolve(resourceResponse.url)
        } else {
          resolve('')
        }
      })
    },
    async formatInfo (val) {
      let info = JSON.parse(JSON.stringify(val))
      info.content.msg_body.imageUrl = await this.getResource(info.content.msg_body.media_id)
      this.renderInfo = info
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      async handler (val) {
        await this.formatInfo(val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.msg_text {
  position: relative;
  width: 260px;
  min-height: 34px;
  display: flex;
  flex-direction: column;
  &_time {
    max-width: 250px;
    height: 18px;
    font-size: 11px;
    line-height: 14px;
    color: #c8c8c8;
  }
  &_box {
    // max-width: 250px;
    // max-height: 250px;
    border-radius: 4px;
    line-height: 1.5;
    padding: 3px;
    box-sizing: border-box;
    font-size: 13px;
    color: #555;
    -webkit-user-select: text;
    -webkit-app-region: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    img {
      max-width: 240px;
      max-height: 240px;
    }
  }
  &_arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 25px;
    // background-color: red;
  }
}

.triangle {
  position: relative;
  // background-color: orange;
  text-align: left;
}
.triangle:before,
.triangle:after {
  content: "";
  position: absolute;
  background-color: inherit;
}
.triangle,
.triangle:before,
.triangle:after {
  width: 5px;
  height: 5px;
  border-top-right-radius: 30%;
}

.triangle {
  transform: rotate(-60deg) skewX(-30deg) scale(1, 0.866);
}
.triangle:before {
  transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707)
    translate(0, -50%);
}
.triangle:after {
  transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
}
</style>