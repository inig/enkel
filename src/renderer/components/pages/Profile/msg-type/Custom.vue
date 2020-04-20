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
         :style="[theme, boxStyles]"
         @click="clickHandler">
      <div class="msg_text_box_left">
        <div class="msg_text_box_left_title"
             :style="[leftTitleStyles]">{{info.content.msg_body.name || ''}}</div>
        <div class="msg_text_box_left_desc"
             :style="[leftDescStyles]">{{info.content.msg_body.desc || ''}}</div>
        <div class="msg_text_box_left_auth"
             :style="[leftAuthStyles]">{{info.content.from_name || ''}}</div>
      </div>
      <div class="msg_text_box_right">
        <svg :style="[svgStyles]">
          <use :xlink:href="'#profile-item-' + (info.content.msg_body.type || 'survey')"></use>
        </svg>
      </div>
    </div>
    <div class="msg_text_arrow"
         :style="[arrowStyles]">
      <div class="triangle"
           :style="[theme]"></div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'MsgBoxCustom',
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
        backgroundColor: '#2e2f2b',
        color: '#fff'
      }
    }
  },
  computed: {
    theme () {
      return (this.userInfo.username !== this.info.content.from_id) ? this.leftTheme : this.rightTheme
    },
    containerStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        alignItems: 'flex-start'
      } : {
          alignItems: 'flex-end'
        }
    },
    nameStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        marginRight: '10px'
      } : {
          marginLeft: '10px'
        }
    },
    timeStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        marginLeft: '10px'
      } : {
          marginRight: '10px',
          display: 'flex',
          flexDirection: 'row-reverse'
        }
    },
    boxStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        marginLeft: '10px'
      } : {
          marginRight: '10px'
        }
    },
    arrowStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        left: '5px',
        transform: 'rotate(30deg)'
      } : {
          right: '2px',
          transform: 'rotate(-30deg)'
        }
    },
    leftTitleStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        color: '#353535'
      } : {
          color: '#ccc'
        }
    },
    leftDescStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        color: '#888'
      } : {
          color: '#999'
        }
    },
    leftAuthStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        color: '#b2b2b2',
        borderTop: '1px dashed #ccc'
      } : {
          color: '#666',
          borderTop: '1px dashed #111'
        }
    },
    svgStyles () {
      return (this.userInfo.username !== this.info.content.from_id) ? {
        fill: '#888'
      } : {
          fill: '#bbb'
        }
    },
  },
  methods: {
    clickHandler () {
      let info = Object.assign({}, this.info)
      info.content.msg_body.userInfo = this.userInfo
      alert(JSON.stringify(info, null, 2))
      ipcRenderer.send('open-window', info)
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
  cursor: pointer;
  &_time {
    max-width: 250px;
    height: 18px;
    font-size: 11px;
    line-height: 14px;
    color: #c8c8c8;
  }
  &_box {
    width: 220px;
    height: 80px;
    border-radius: 4px;
    line-height: 1.5;
    padding: 8px 10px;
    box-sizing: border-box;
    font-size: 13px;
    color: #555;
    // -webkit-user-select: text;
    // -webkit-app-region: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    &_left {
      width: 160px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &_title {
        width: 100%;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // color: #ccc;
      }
      &_desc {
        width: 100%;
        height: 20px;
        font-size: 11px;
        // color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &_auth {
        width: 100%;
        height: 18px;
        font-size: 10px;
        line-height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // border-top: 1px dashed #111;
        box-sizing: border-box;
        // color: #666;
      }
    }
    &_right {
      width: 36px;
      height: 60px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      svg {
        width: 28px;
        height: 28px;
        // fill: #bbb;
      }
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