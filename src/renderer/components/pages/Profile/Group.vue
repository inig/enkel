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
                  v-lazy='item.headIcon'
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
               v-html="lastMessage(item.gid, item.desc)">
          </div>
        </div>
      </div>
    </div>

    <div class="fixed_btn">
      <Button shape="circle"
              type="success"
              icon="md-people"
              @click="openGroupCreateModal"></Button>
    </div>

    <transition name="chat-window-transition"
                enter-active-class="animated fadeInRightBig faster"
                leave-active-class="animated fadeOutRightBig faster">
      <GroupChatWindow v-if="chatWindow.shown"
                       :info="chatWindow.info"
                       :msgs="chatWindow.messages"
                       :user-info="userInfo"
                       :friends="friends"
                       @hide="hideChatWindow"></GroupChatWindow>
    </transition>

    <Modal v-model="createGroupModal.shown"
           title="新建群"
           :styles="{top: '20px'}"
           @on-ok="createGroup">
      <Form :label-width="80"
            :model="createGroupModal.data"
            :rules="createGroupModal.rules">
        <FormItem label="群名称"
                  prop="group_name">
          <Input v-model="createGroupModal.data.group_name"
                 placeholder="请输入群名称"></Input>
        </FormItem>
        <FormItem label="群描述">
          <Input v-model="createGroupModal.data.group_description"
                 placeholder="请输入群描述"></Input>
        </FormItem>
        <FormItem label="群头像">
          <div class="group_avatar">
            <input type="file"
                   class="group_avatar_input"
                   @change="chooseImg">
            <div class="group_avatar_preview">
              <img class="group_avatar_preview_img"
                   :src="avatarPreviewerSrc"
                   v-if="avatarPreviewerSrc">
            </div>
          </div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { Button, Avatar, Modal, Form, FormItem, Input } from 'view-design'
import { ipcRenderer } from 'electron'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('./store/modules')
export default {
  name: 'ProfileGroup',
  components: {
    Button, Avatar, Modal, Form, FormItem, Input,
    GroupChatWindow: () => import('./GroupChatWindow')
  },
  props: {
    friends: {
      type: Array,
      default () {
        return []
      }
    },
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
  computed: {
    lastMessage () {
      return function (gid, desc) {
        if (!this.conversations) {
          return desc || '什么内容也没有'
        }
        let msgItem = this.conversations.filter(item => gid == item.from_gid)
        if (msgItem.length && msgItem[0].msgs.length) {
          let _msg = msgItem[0].msgs
          _msg = _msg[_msg.length - 1]
          return (_msg.content.msg_type == 'text' ? _msg.content.msg_body.text.replace(/\\n/g, ' ') : '<span style="margin-left: -6px;">【其他消息类型】</span>')
        } else {
          return desc || '什么内容也没有'
        }
      }
    }
  },
  data () {
    const validateGroupName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('群名称不能为空'))
      } else if (!(/^[a-zA-Z0-9\u4E00-\u9FA5]*$/.test(value))) {
        callback(new Error('群名称不合法，只能包括大小写字母、数字、中文'))
      } else {
        callback()
      }
    }
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
      },
      createGroupModal: {
        shown: false,
        data: {
          'group_name': '',
          'group_description': '',
          'avatar': '',
          'is_limit': true
        },
        rules: {
          group_name: [
            {
              validator: validateGroupName,
              trigger: 'blur'
            }
          ]
        }
      },
      avatarPreviewerSrc: '',
      avatarPreviewerFile: null
    }
  },
  async mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.query.group = 43509061
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
    chooseImg (evt) {
      const that = this
      let file = evt.target.files[0]
      if (file) {
        let reader = new FileReader()
        reader.onload = function () {
          that.avatarPreviewerFile = file
          that.avatarPreviewerSrc = this.result
        }
        reader.readAsDataURL(file)
      }
    },
    openGroupCreateModal () {
      this.createGroupModal.shown = true
    },
    findGroup (gid) {
      let _f = this.groups.filter(item => item.gid == gid)
      if (_f.length) {
        return _f[0]
      } else {
        return null
      }
    },
    async createGroup () {
      let requestParams = {
        group_name: this.createGroupModal.data.group_name,
        group_description: this.createGroupModal.data.group_description,
        is_limit: this.createGroupModal.data.is_limit
      }
      if (this.avatarPreviewerFile) {
        requestParams.avatar = this.$createFileFormData(this.avatarPreviewerFile)
      }
      // ipcRenderer.send('im-create-group', requestParams)
      let response = await this.$store.dispatch('moduleIM/createGroup', requestParams)

      if (response.code == 0) {
        this.$Message.success(`群组【${requestParams.group_name}】创建成功`)
        // this.renderGroups.push(response)
        this.$emit('change')
      } else {
        this.$Message.error(`群组【${requestParams.group_name}】创建失败：${this.$translateErrorCode(response.code)}`)
      }
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
.group_avatar {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  &_input {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 160px;
    outline: none;
    opacity: 0;
  }
  &_preview {
    width: 160px;
    height: 160px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    &_img {
      max-width: 160px;
      max-height: 160px;
    }
  }
}
</style>