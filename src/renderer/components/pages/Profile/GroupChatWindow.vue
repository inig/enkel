<template>
  <div class="chat_window">
    <div class="chat_window_header">
      <div class="chat_window_header_back"
           @click="hide">
        <Icon type="ios-arrow-back"
              style="pointer-events: none;"
              size="20" />
      </div>
      {{info.name}}
    </div>
    <div class="chat_window_content">
      <div class="chat_window_content_wrapper"
           ref="chatWindowContentRef">
        <GroupMsgBox v-for="(item, index) in messages"
                     :key="item.msg_id"
                     style="margin-top: 20px;"
                     :user-info="userInfo"
                     :member-info="membersInfo[item.content.from_id]"
                     :ref="'msgBoxRef-' + index"
                     :info="item"></GroupMsgBox>
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
import GroupMsgBox from './GroupMsgBox'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('./store/modules')
require('../../../assets/js/scrollTo.js')

export default {
  name: 'ProfileGroupChatWindow',
  components: {
    Icon, Input, Button,
    GroupMsgBox
  },
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
    },
    msgs: {
      types: Array,
      default () {
        return []
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
      },
      members: [],
      membersInfo: {}
    }
  },
  async mounted () {
    ipcRenderer.on('im-on-msg-receive', this.imOnMsgReceive)
    this.$nextTick(() => {
      this.scrollToEnd()
    })
    await this.imGetGroupMembers()
  },
  methods: {
    ...mapActions([
      'moduleIM'
    ]),
    hide () {
      this.$emit('hide')
    },
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
    async imGetGroupMembers () {
      await this.$store.dispatch('moduleIM/getGroupMembers', {
        gid: this.info.gid
      }).then(async (res) => {
        if (res.code == 0) {
          let arr = JSON.parse(JSON.stringify(res.member_list))
          let membersInfo = {}
          for (let i = 0; i < arr.length; i++) {
            arr[i].headIcon = await this.getResource(arr[i].avatar)
            if (!membersInfo.hasOwnProperty(arr[i].username)) {
              membersInfo[arr[i].username] = arr[i]
            }
          }
          this.members = arr
          this.membersInfo = membersInfo
        } else {
          this.members = []
        }
      }).catch(err => {
        this.members = []
      })
    },
    imOnMsgReceive (event, data) {
      let message = data.messages[0]
      if (message.msg_type == 4) {
        this.scrollToEnd()
      }
    },
    scrollToEnd () {
      let scrollToEndTimeout = setTimeout(() => {
        let targetRef = this.$refs['msgBoxRef-' + (this.messages.length - 1)][0].$el
        this.initScroller(targetRef)
        clearTimeout(scrollToEndTimeout)
      }, 20)
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
      await this.$store.dispatch('moduleIM/sendGroupMsg', {
        target_gid: this.info.gid,
        content: this.sendData.content.replace(/[\r\n]/g, "\\n")
      }).then(res => {
        console.log('send >>>>>', res)
        if (res.code == 0) {
          this.messages.push({
            content: {
              create_time: res.ctime_ms,
              from_appkey: '',
              from_id: this.userInfo.username,
              from_name: this.userInfo.nickname,
              from_platform: 'web',
              from_type: 'user',
              msg_body: {
                text: this.sendData.content.replace(/[\r\n]/g, "\\n"),
                extras: {}
              },
              msg_type: 'text',
              sui_mtime: 0,
              target_type: 'group',
              target_name: this.info.name,
              target_id: this.info.gid,
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
            msg_type: 4,
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
    msgs: {
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