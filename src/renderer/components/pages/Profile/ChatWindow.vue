<template>
  <div class="chat_window">
    <div class="chat_window_header">
      <div class="chat_window_header_back"
           @click="hide">
        <Icon type="ios-arrow-back"
              style="pointer-events: none;"
              size="20" />
      </div>
      {{friendInfo.memo_name || friendInfo.nickname || friendInfo.username}}
    </div>
    <div class="chat_window_content">
      <div class="chat_window_content_wrapper"
           ref="chatWindowContentRef">
        <MsgBox v-for="(item, index) in messages"
                :key="item.msg_id"
                style="margin-top: 20px;"
                :user-info="userInfo"
                :friend-info="friendInfo"
                :ref="'msgBoxRef-' + index"
                :info="item"></MsgBox>
      </div>
    </div>
    <div class="chat_window_footer">
      <div class="msg_send_input">
        <Input placeholder="消息"
               type="textarea"
               style="width: 100%;"
               :autosize="{minRows: 1, maxRows: 4}"
               v-model="sendData.content"></Input>
      </div>
      <transition name="send-btn-transition"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut faster">
        <Button type="success"
                v-if="sendData.content"
                @click="send">发送</Button>
      </transition>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Icon, Input, Button } from 'view-design'
import MsgBox from './MsgBox'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('./store/modules')
require('../../../assets/js/scrollTo.js')

export default {
  name: 'ProfileChatWindow',
  components: {
    Icon, Input, Button,
    MsgBox
  },
  props: {
    info: {
      type: [Object, Array],
      default () {
        return []
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
      scrollerTimeout: null,
      messages: [],
      sendData: {
        type: 'text',
        content: ''
      }
    }
  },
  mounted () {
    ipcRenderer.on('im-on-msg-receive', this.imOnMsgReceive)
    this.$nextTick(() => {
      this.scrollToEnd()
    })
  },
  methods: {
    ...mapActions([
      'moduleIM'
    ]),
    hide () {
      this.$emit('hide')
    },
    imOnMsgReceive (event, data) {
      let message = data.messages[0]
      if (message.msg_type == 3) {
        this.scrollToEnd()
      }
    },
    scrollToEnd () {
      let scrollToEndTimeout = setTimeout(() => {
        let targetRef = this.$refs['msgBoxRef-' + (this.messages.length - 1)]
        if (targetRef) {
          targetRef = targetRef[0].$el
          this.initScroller(targetRef)
        }
        clearTimeout(scrollToEndTimeout)
      }, 100)
    },
    initScroller (scrollTo) {
      if (this.scrollerTimeout) {
        clearTimeout(this.scrollerTimeout)
      }
      this.scrollerTimeout = setTimeout(() => {
        animateScrollTo(scrollTo, {
          elementToScroll: document.querySelector('.chat_window_content'),
          minDuration: 400
        }).then(res => {
          console.log('+++++++', res)
          clearTimeout(this.scrollerTimeout)
        })
      }, 300)
    },
    async send () {
      await this.$store.dispatch('moduleIM/sendSingleMsg', {
        target_username: this.friendInfo.username,
        target_nickname: this.friendInfo.nickname,
        content: this.sendData.content.replace(/[\r\n]/g, "\\n")
      }).then(res => {
        if (res.code == 0) {
          this.messages.push({
            content: {
              create_time: res.ctime_ms,
              from_appkey: res.appkey,
              from_id: this.userInfo.username,
              from_platform: 'web',
              from_type: 'user',
              msg_body: {
                text: this.sendData.content.replace(/[\r\n]/g, "\\n"),
                extras: {}
              },
              msg_type: 'text',
              sui_mtime: 0,
              target_type: 'single',
              version: 1
            },
            custom_notification: {
              alert: '',
              at_prefix: '',
              enabled: false,
              title: ''
            },
            ctime_ms: new Date().getTime(),
            msg_id: res.msg_id,
            msg_level: 0,
            msg_type: 3,
            need_receipt: false
          })
          this.sendData.content = ''
          this.scrollToEnd()
        }
      }).catch(err => {
        console.log('发送消息失败：', err)
      })
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler (val) {
        this.messages = val
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../../themes/index.less");
.chat_window {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &_header {
    position: relative;
    width: 100%;
    height: 48px;
    background-color: @primary-color;
    color: #fff;
    font-size: 14px;
    // border-bottom: 1px solid #f5f5f5;
    box-sizing: border-box;
    box-shadow: 0 1px 10px 1px #888;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &_back {
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 1;
      transition: all 0.2s ease-in-out;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  &_content {
    width: 100%;
    // height: calc(~"100% - 40px - 48px");
    flex: 1;
    overflow-y: auto;
    padding-bottom: 15px;
    box-sizing: border-box;
  }
  &_footer {
    width: 100%;
    min-height: 48px;
    background-color: #f8f8f8;
    padding: 8px 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .msg_send_input {
      text-align: left;
      width: 100%;
      padding: 0 10px 0 0;
      box-sizing: border-box;
    }
  }
}
</style>