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
      <div class="chat_window_header_operation">
        <Button type="primary"
                shape="circle"
                icon="md-settings"
                @click="openGroupModal"></Button>
      </div>
    </div>
    <div class="chat_window_content">
      <div class="chat_window_content_wrapper"
           ref="chatWindowContentRef">
        <GroupMsgBox v-for="(item, index) in renderMessages"
                     :key="item.msg_id"
                     style="margin-top: 20px;"
                     :user-info="userInfo"
                     :member-info="membersInfo[item.content ? item.content.from_id : item.from_username]"
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
                   :info="info"
                   @click="sendCustom"
                   @change="addNewGroupMessage"
                   type="group"></component>
      </div>
    </div>

    <Drawer title="群管理"
            :closable="false"
            v-model="groupModal.shown">
      <div class="member_container">
        <div class="member_item"
             v-for="(item, index) in members"
             :key="item.username"
             :title="item.nickName || item.username">
          <Badge :text="item.flag == 2 ? '管理员' : '群主'"
                 class-name="group_master"
                 :type="item.flag == 2 ? 'success' : 'info'"
                 :offset="[0, 5]"
                 v-if="item.flag > 0">
            <Avatar size="48"
                    shape="square"
                    style="background-color: #fff;"
                    :src="item.avatar"
                    v-if="item.avatar"></Avatar>
            <Avatar size="48"
                    shape="square"
                    icon="ios-person"
                    style="background-color: #87d068"
                    v-else></Avatar>
          </Badge>
          <Avatar size="48"
                  shape="square"
                  style="background-color: #fff;"
                  :src="item.avatar"
                  v-else-if="item.avatar"></Avatar>
          <Avatar size="48"
                  shape="square"
                  icon="ios-person"
                  style="background-color: #87d068"
                  v-else></Avatar>
        </div>
        <div class="member_item">
          <div class="member_item_add"
               @click="openMemberAddModal">
            <Icon type="md-add"
                  size="48"
                  color="#f0f0f0" />
          </div>
        </div>
        <div class="member_item_blank"></div>
        <div class="member_item_blank"></div>
        <div class="member_item_blank"></div>
      </div>
    </Drawer>

    <Modal v-model="memberAddModal.shown"
           width="250"
           :styles="{height: '400px', top: '50px'}"
           class='group_member_add_form'
           footer-hide
           title="邀请好友">
      <div class="friends_list">
        <div class="friends_list_header"></div>
        <div class="friends_list_content">
          <div class="friends_list_content_item"
               v-for="(item, index) in formatFriends"
               :key="item.username">
            <div class="friends_list_content_item_avatar">
              <Avatar size="34"
                      shape="square"
                      style="background-color: #fff;"
                      :src="item.headIcon"
                      v-if="item.headIcon"></Avatar>
              <Avatar size="34"
                      shape="square"
                      icon="ios-person"
                      style="background-color: #87d068"
                      v-else></Avatar>
            </div>
            <div class="friends_list_content_item_nickname">{{item.memo_name || item.nickname || item.username}}</div>
            <div class="friends_list_content_item_operation">
              <Checkbox v-if="item.inGroup"
                        :value="true"
                        disabled></Checkbox>
              <Checkbox v-else
                        :value="memberAddModal.data.username.indexOf(item.username) > -1"
                        @on-change="chooseFriend($event, item.username)"></Checkbox>
            </div>
          </div>
        </div>
        <div class="friends_list_footer">
          <Button type="success"
                  :disabled="memberAddModal.data.username.length < 1"
                  size="small"
                  @click="invite">邀请</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Icon, Input, Button, Drawer, Avatar, Badge, Modal, Checkbox } from 'view-design'
import GroupMsgBox from './GroupMsgBox'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('./store/modules')
require('../../../assets/js/scrollTo.js')

export default {
  name: 'ProfileGroupChatWindow',
  components: {
    Icon, Input, Button, Drawer, Avatar, Badge, Modal, Checkbox,
    GroupMsgBox,
    CustomItem: () => import('./items/index'),
    CustomItemSurvey: () => import('./items/Survey'),
    CustomItemSteganography: () => import('./items/Steganography')
  },
  props: {
    friends: {
      type: Array,
      default () {
        return []
      }
    },
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
      groupModal: {
        shown: false
      },
      memberAddModal: {
        shown: false,
        data: {
          username: []
        }
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
        ,
        {
          name: 'steganography',
          icon: 'steganography',
          text: '隐写术'
        }
      ],
      formatFriends: []
    }
  },
  computed: {
    renderMessages () {
      // let i = 0
      // let messages = JSON.parse(JSON.stringify(this.messages))
      // for (i; i < messages.length; i++) {
      //   if (messages[i].content.msg_type == 'image') {
      //     messages[i].content.msg_body.imageUrl = await this.getResource(messages[i].content.msg_body.media_id)
      //   }
      // }
      return this.messages // .filter(item => !item.content.msg_body.hasOwnProperty('answer'))
    }
  },
  async mounted () {
    ipcRenderer.on('im-on-msg-receive', this.imOnMsgReceive)
    this.$nextTick(() => {
      this.scrollToEnd()
      // document.querySelector('.chat_window_content_wrapper').scrollTop = 10000000000
    })
    // await this.imGetGroupMembers()
  },
  methods: {
    ...mapActions([
      'moduleIM'
    ]),
    async invite () {
      let users = this.memberAddModal.data.username.map(item => {
        return {
          username: item
        }
      })
      let response = await this.$store.dispatch('moduleIM/addGroupMembers', {
        gid: this.info.gid,
        member_usernames: users
      })
      if (response.code == 0) {
        this.$Message.success('邀请成功')
        await this.imGetGroupMembers()
        this.friendsFilter(this.friends)
        this.closeMemberAddModal()
      } else {
        this.$Message.error('邀请失败，请稍后再试')
      }
    },
    findIndexInMembers (username) {
      return this.members.some(item => item.username == username)
    },
    friendsFilter (val) {
      // 判断好友是否是群成员
      let friends = JSON.parse(JSON.stringify(val))
      friends.map(item => {
        if (this.findIndexInMembers(item.username)) {
          item.inGroup = true
        } else {
          item.inGroup = false
        }
        return item
      })
      this.formatFriends = friends
    },
    chooseFriend (value, username) {
      let choosedUsername = this.memberAddModal.data.username
      if (value) {
        if (choosedUsername.indexOf(username) < 0) {
          choosedUsername.push(username)
        }
      } else {
        if (choosedUsername.indexOf(username) > -1) {
          choosedUsername.splice(choosedUsername.indexOf(username), 1)
        }
      }
    },
    openMemberAddModal () {
      this.memberAddModal.shown = true
    },
    closeMemberAddModal () {
      this.memberAddModal.shown = false
    },
    openGroupModal () {
      this.groupModal.shown = true
    },
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
    scrollToEnd (immediate) {
      let scrollToEndTimeout = setTimeout(() => {
        let targetRef = this.$refs['msgBoxRef-' + (this.renderMessages.length - 1)]
        if (targetRef && targetRef[0]) {
          targetRef = targetRef[0].$el
          this.initScroller(targetRef)
        }
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
              from_id: this.userInfo.phonenum,
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
        })
      } else {
        this.$Message.error('发送失败')
      }
    },
    addNewGroupMessage (msg) {
      this.hideOperation()
      let _msg = JSON.parse(JSON.stringify(msg.msg))
      _msg.content.from_name = this.userInfo.nickname || this.userInfo.username
      _msg.ctime_ms = _msg.content.create_time
      this.messages.push(Object.assign({}, _msg, {
        msg_type: 4
      }))
      this.scrollToEnd()
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
    },
    friends: {
      deep: true,
      immediate: true,
      async handler (val) {
        await this.imGetGroupMembers()
        if (val && val.length) {
          this.friendsFilter(val)
        }
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
    &_operation {
      position: absolute;
      right: 0;
      top: 0;
      width: 48px;
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

.member_container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  .member_item {
    width: 56px;
    height: 56px;
    // margin-right: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .member_item_add {
      width: 48px;
      height: 48px;
      border: 1px solid #f0f0f0;
      box-sizing: border-box;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #f0f0f0;
        i {
          color: #ccc !important;
        }
      }
    }
  }
  .member_item_blank {
    width: 56px;
    height: 0;
  }
}
.friends_list {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  &_header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 36px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  &_content {
    position: absolute;
    left: 0;
    top: 36px;
    width: 100%;
    height: calc(~"100% - 36px - 30px");
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    &_item {
      width: 100%;
      height: 36px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &_avatar {
        width: 36px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      &_nickname {
        width: calc(~"100% - 36px - 36px");
        height: 36px;
        line-height: 36px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 13px;
        margin-left: 5px;
      }
      &_operation {
        width: 36px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
  }
  &_footer {
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>