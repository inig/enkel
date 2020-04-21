<template>
  <div class="container">
    <div class="container_header">群</div>

    <div class="container_content">
      <div class="group_item"
           v-for="(item, index) in groups"
           :key="item.gid"
           @click="showChatWindow(item)">
        <div class="group_item_left">
          <Avatar size="34"
                  shape="square"
                  style="background-color: #fff;"
                  :src="item.headIcon"
                  v-if="item.headIcon"></Avatar>
          <Avatar size="34"
                  shape="square"
                  icon="md-people"
                  style="background-color: #87d068"
                  v-else></Avatar>
        </div>
        <div class="group_item_right">
          <div class="group_item_right_title">
            {{item.name}}
          </div>
          <div class="group_item_right_desc"
               v-if="item.desc">
            <!-- {{lastMessages.hasOwnProperty(item.username) ? lastMessages[item.username].content.msg_body.text : '什么内容也没有'}} -->
            <!-- {{lastMessage(item.username) ? lastMessage(item.username).content.msg_body.text: '什么内容也没有'}} -->
            {{item.desc}}
          </div>
        </div>
      </div>
    </div>

    <div class="fixed_btn">
      <Button shape="circle"
              type="success"
              icon="md-people"
              @click="imGetConversation"></Button>
    </div>

    <transition name="chat-window-transition"
                enter-active-class="animated fadeInRightBig faster"
                leave-active-class="animated fadeOutRightBig faster">
      <GroupChatWindow v-if="chatWindow.shown"
                       :info="chatWindow.info"
                       :msgs="chatWindow.messages"
                       :user-info="userInfo"
                       @hide="hideChatWindow"></GroupChatWindow>
    </transition>
  </div>
</template>

<script>
import { Button, Avatar } from 'view-design'
import { ipcRenderer } from 'electron'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('./store/modules')
export default {
  name: 'ProfileGroup',
  components: {
    Button, Avatar,
    GroupChatWindow: () => import('./GroupChatWindow')
  },
  props: {
    userInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    conversations: {
      type: Array,
      default () {
        return []
      }
    },
    groups: {
      type: Array,
      default () {
        return []
      }
    },
    query: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formData: {
        'group_name': '',
        'group_description': '',
        'avatar': '',
        'is_limit': true
      },
      chatWindow: {
        shown: false,
        info: '',
        messages: []
      }
    }
  },
  async mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.query.group = 43377018
        if (this.query.hasOwnProperty('group')) {
          let _group = this.findGroup(this.query.group)
          if (_group) {
            this.showChatWindow(_group)
          }
        }
      }, 1500)
    })
  },
  methods: {
    ...mapActions([
      'moduleIM'
    ]),
    findGroup (gid) {
      let _f = this.groups.filter(item => item.gid == gid)
      if (_f.length) {
        return _f[0]
      } else {
        return null
      }
    },
    createGroup () {
      this.formData['group_name'] = '群组' + (Math.floor(Math.random() * 100))
      ipcRenderer.send('im-create-group', this.formData)
    },
    findMessagesByGid (gid) {
      let arr = this.conversations.filter(item => String(item.from_gid) == String(gid))
      if (arr && arr.length) {
        return arr[0].msgs
      } else {
        return []
      }
    },
    showChatWindow (data) {
      this.chatWindow.info = data
      this.chatWindow.messages = this.findMessagesByGid(data.gid)
      this.chatWindow.shown = true
    },
    hideChatWindow () {
      this.chatWindow.shown = false
    },
    async imGetConversation () {
      let response = await this.$store.dispatch('moduleIM/getConversation')
      console.log('imGetConversation>>>>>>', response)
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../../themes/index.less");
.container {
  position: relative;
  padding: 0 0 15px 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .container_header {
    width: 100%;
    height: 48px;
    background-color: @primary-color;
    color: #fff;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 10px 1px #888;
  }
  .container_content {
    width: 100%;
    height: calc(~"100% - 48px");
    .group_item {
      width: 100%;
      height: 48px;
      padding: 0 10px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      &:hover {
        background-color: #f8f8f8;
      }
      &_left {
        width: 64px;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      &_right {
        width: calc(~"100% - 64px");
        height: 48px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &_title {
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #333;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &_desc {
          width: 100%;
          height: 16px;
          line-height: 16px;
          font-size: 11px;
          color: #888;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
  .fixed_btn {
    position: fixed;
    width: 48px;
    height: 48px;
    right: 10px;
    bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>