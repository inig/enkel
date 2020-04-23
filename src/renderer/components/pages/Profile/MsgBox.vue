<template>
  <div class="msg_box">
    <!-- {{JSON.stringify(info)}} -->
    <div class="msg_box_left"
         v-if="userInfo.username !== info.content.from_id">
      <div class="msg_box_left_avatar">
        <Avatar size="34"
                shape="square"
                style="background-color: #fff;"
                :src="friendInfo.headIcon"
                v-if="friendInfo.headIcon"></Avatar>
        <Avatar size="34"
                shape="square"
                icon="ios-person"
                style="background-color: #87d068"
                v-else></Avatar>
      </div>
      <div class="msg_box_left_content">
        <div class="msg_box_left_content_time">
          <span style="color: #888; margin-right: 10px;"
                v-if="friendInfo.memo_name || friendInfo.nickname">{{friendInfo.memo_name || friendInfo.nickname}}</span>
          {{info.ctime_ms | msgTimeFilter}}</div>
        <div class="msg_box_left_content_box"
             :style="[leftTheme]"
             v-html="info.content.msg_body.text.split('\\n').map(item => `<p style='word-break: break-all;'>${item}</p>`).join('')"></div>
        <div class="msg_box_left_content_arrow">
          <div class="triangle"
               :style="[leftTheme]"></div>
        </div>
      </div>
    </div>
    <div class="msg_box_right"
         v-else>
      <div class="msg_box_right_content">
        <div class="msg_box_right_content_time">
          {{info.ctime_ms | msgTimeFilter}}
          <span style="color: #888; margin-left: 8px;"
                v-if="userInfo.memo_name || userInfo.nickname">{{userInfo.memo_name || userInfo.nickname}}</span>
        </div>
        <div class="msg_box_right_content_box"
             :style="[rightTheme]"
             v-html="info.content.msg_body.text.split('\\n').map(item => `<p style='word-break: break-all;'>${item}</p>`).join('')"></div>
        <div class="msg_box_right_content_arrow">
          <div class="triangle"
               :style="[rightTheme]"></div>
        </div>
      </div>
      <div class="msg_box_right_avatar">
        <Avatar size="34"
                shape="square"
                style="background-color: #fff;"
                :src="userInfo.headIcon"
                v-if="userInfo.headIcon"></Avatar>
        <Avatar size="34"
                shape="square"
                icon="ios-person"
                style="background-color: #87d068"
                v-else></Avatar>
      </div>
    </div>
  </div>
</template>

<script>
  import { Avatar } from 'view-design'
  export default {
    name: 'ChatWindowMsgBox',
    components: {
      Avatar
    },
    props: {
      info: {
        type: Object,
        default () {
          return {}
        }
      },
      friendInfo: {
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
        bgColor: '#eee',
        leftTheme: {
          backgroundColor: '#eee',
          color: '#555'
        },
        rightTheme: {
          backgroundColor: '#19be6b',
          color: '#fff'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .msg_box {
    width: 100%;
    min-height: 34px;
    overflow: hidden;
    &_left {
      width: 100%;
      min-height: 34px;
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      &_avatar {
        width: 34px;
        height: 34px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
      }
      &_content {
        position: relative;
        width: 260px;
        min-height: 34px;
        // background-color: lightseagreen;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        // justify-content: flex-start;
        &_time {
          max-width: 250px;
          margin-left: 10px;
          height: 18px;
          font-size: 11px;
          line-height: 14px;
          color: #c8c8c8;
        }
        &_box {
          max-width: 250px;
          min-height: 34px;
          border-radius: 4px;
          line-height: 1.5;
          padding: 8px 10px;
          box-sizing: border-box;
          font-size: 13px;
          color: #555;
          margin-left: 10px;
          -webkit-user-select: text;
          -webkit-app-region: none;
        }
        &_arrow {
          position: absolute;
          width: 10px;
          height: 10px;
          left: 5px;
          top: 25px;
          transform: rotate(30deg);
          // background-color: red;
        }
      }
    }
    &_right {
      width: 100%;
      min-height: 34px;
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-end;
      &_avatar {
        width: 34px;
        height: 34px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
      }
      &_content {
        position: relative;
        width: 260px;
        min-height: 34px;
        // background-color: lightseagreen;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        // justify-content: flex-end;
        &_time {
          max-width: 250px;
          margin-right: 10px;
          height: 18px;
          font-size: 11px;
          line-height: 14px;
          color: #c8c8c8;
        }
        &_box {
          max-width: 250px;
          min-height: 34px;
          border-radius: 4px;
          line-height: 1.5;
          padding: 8px 10px;
          box-sizing: border-box;
          font-size: 13px;
          font-weight: 400;
          margin-right: 10px;
          -webkit-user-select: text;
          -webkit-app-region: none;
        }
        &_arrow {
          position: absolute;
          width: 10px;
          height: 10px;
          right: 2px;
          top: 25px;
          transform: rotate(-30deg);
          // background-color: red;
        }
      }
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