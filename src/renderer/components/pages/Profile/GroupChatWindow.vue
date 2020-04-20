<template>
  <div class="chat_window">
    <div class="chat_window_header">
      <div class="chat_window_header_back"
           @click="hide">
        <Icon type="ios-arrow-back"
              style="pointer-events: none;"
              size="20" />
      </div>
      <div class="chat_window_header_title">{{info.name}}</div>
    </div>
    <div class="chat_window_content">
      <div class="chat_window_content_wrapper"
           ref="chatWindowContentRef">
        <GroupMsgBox v-for="(item, index) in renderMessages"
                     :key="item.msg_id"
                     style="margin-top: 20px;"
                     :user-info="userInfo"
                     :member-info="membersInfo[item.content.from_id]"
                     :ref="'msgBoxRef-' + index"
                     :info="item"></GroupMsgBox>
      </div>
      <transition name="fade">
        <div class="chat_window_mask"
             v-if="operationShown"
             @click="hideOperation"></div>
      </transition>
    </div>
    <div class="chat_window_footer">
      <div class="msg_send_input">
        <Input placeholder="消息"
               type="textarea"
               style="width: 100%;"
               :autosize="{minRows: 1, maxRows: 4}"
               v-model="sendData.content"
               @on-focus="hideOperation"></Input>
      </div>
      <transition name="send-btn-transition"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut faster">
        <div class="msg_send_operation"
             v-if="sendData.content">
          <Button type="success"
                  @click="send">发送</Button>
        </div>
      </transition>

      <transition name="send-btn-transition"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut faster">
        <div class="msg_send_operation"
             v-if="!sendData.content">
          <Button type="primary"
                  shape="circle"
                  icon="md-add"
                  @click="toggleOperation"></Button>
        </div>
      </transition>
    </div>
    <div class="chat_window_operation"
         :style="{minHeight: operationShown ? '180px' : '0px', height: operationShown ? '180px' : '0px'}">
      <div class="chat_window_operation_wrapper">
        <component v-for="(item, index) in customItems"
                   :key="index"
                   :is="'custom-item-' + item.name"
                   :icon="item.icon"
                   :text="item.text"
                   :user-info="userInfo"
                   @click="sendCustom"
                   type="group"></component>
      </div>
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
    GroupMsgBox,
    CustomItem: () => import('./items/index'),
    CustomItemSurvey: () => import('./items/Survey')
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
      membersInfo: {},
      operationShown: false,
      customItems: [
        {
          name: 'survey',
          icon: 'survey',
          text: '调查'
        }
      ]
    }
  },
  computed: {
    renderMessages () {
      return this.messages // .filter(item => !item.content.msg_body.hasOwnProperty('answer'))
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
    toggleOperation () {
      this.operationShown = !this.operationShown
    },
    hideOperation () {
      this.operationShown = false
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
            arr[i].avatar = await this.getResource(arr[i].avatar)
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
        let targetRef = this.$refs['msgBoxRef-' + (this.renderMessages.length - 1)][0].$el
        this.initScroller(targetRef)
        clearTimeout(scrollToEndTimeout)
      }, 80)
    },
    initScroller (scrollTo) {
      if (this.scrollerTimeout) {
        clearTimeout(this.scrollerTimeout)
      }
      this.scrollerTimeout = setTimeout(() => {
        animateScrollTo(scrollTo, {
          elementToScroll: document.querySelector('.chat_window_content_wrapper'),
          minDuration: 400
        }).then(res => {
          clearTimeout(this.scrollerTimeout)
        })
      }, 300)
    },
    async send () {
      await this.$store.dispatch('moduleIM/sendGroupMsg', {
        target_gid: this.info.gid,
        content: this.sendData.content.replace(/[\r\n]/g, "\\n")
      }).then(res => {
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
    },
    async sendCustom (data) {
      this.$Message.loading('正在发送中...')
      let response = ipcRenderer.sendSync('survey-create', {
        uuid: data.id,
        auth_id: data.userInfo.phonenum,
        auth_name: data.userInfo.nickname || data.userInfo.username || data.userInfo.phonenum,
        auth_avatar: data.userInfo.avatar,
        auth_headIcon: data.userInfo.headIcon,
        name: data.name,
        desc: data.desc,
        target_type: 'group',
        target_id: this.info.gid,
        target_name: this.info.name
      })

      if (response.status == 200) {
        this.$Message.destroy()
        this.$Message.success('发送成功')
        this.hideOperation()
        await this.$store.dispatch('moduleIM/sendGroupCustom', {
          target_gid: this.info.gid,
          target_gname: this.info.name,
          custom: data
        }).then(res => {
          if (res.data.code == 0) {
            console.log('SEND >>>>>>>', res.msg)
            let msg = JSON.parse(JSON.stringify(res.msg))
            msg.content.from_name = this.userInfo.nickname || this.userInfo.username
            msg.ctime_ms = msg.content.create_time
            this.messages.push(msg)
            // this.messages.push({
            //   content: {
            //     create_time: res.ctime_ms,
            //     from_appkey: '',
            //     from_id: this.userInfo.username,
            //     from_name: this.userInfo.nickname,
            //     from_platform: 'web',
            //     from_type: 'user',
            //     msg_body: data,
            //     msg_type: 'custom',
            //     sui_mtime: 0,
            //     target_type: 'group',
            //     target_name: this.info.name,
            //     target_id: this.info.gid,
            //     version: 1
            //   },
            //   custom_notification: {
            //     alert: '',
            //     at_prefix: '',
            //     enabled: false,
            //     title: ''
            //   },
            //   ctime_ms: new Date().getTime(),
            //   msg_id: res.msg_id,
            //   msg_level: 0,
            //   msg_type: 4,
            //   need_receipt: false
            // })
            this.sendData.content = ''
            this.scrollToEnd()
          }
        }).catch(err => {
          console.log('自定义消息发送失败：', err)
        })
      } else {
        this.$Message.error('发送失败')
      }
    }
  },
  watch: {
    msgs: {
      deep: true,
      immediate: true,
      handler (val) {
        this.messages = val
        this.scrollToEnd()
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
  overflow: hidden;
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
    &_title {
      height: 48px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  &_content {
    position: relative;
    width: 100%;
    height: calc(~"100% - 48px - 48px");
    // flex: 1;
    // overflow-y: auto;

    &_wrapper {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding-bottom: 15px;
      box-sizing: border-box;
    }
  }
  &_footer {
    position: relative;
    width: 100%;
    min-height: 48px;
    z-index: 1;
    background-color: #f8f8f8;
    padding: 8px 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #eee;
    box-shadow: 0 -1px 20px 1px #eee;
    .msg_send_input {
      text-align: left;
      width: calc(~"100% - 60px");
      padding: 0;
      box-sizing: border-box;
    }
    .msg_send_operation {
      position: absolute;
      right: 10px;
      top: 0;
      width: 60px;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  &_operation {
    width: 100%;
    background-color: #f5f5f5;
    transition: all 0.2s ease-in-out;
    &_wrapper {
      width: 100%;
      height: 100%;
      padding: 10px 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
  &_mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>