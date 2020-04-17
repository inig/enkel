<template>
  <div class="profile_container">
    <div class="profile_inner">
      <div class="profile_menu">
        <div class="profile_menu_item"
             :style="0 === activeMenuIndex ? profileMenuActiveStyles : profileMenuStyles"
             @click="chooseProfileMenu(0)">个人资料</div>
        <div class="profile_menu_item"
             :style="1 === activeMenuIndex ? profileMenuActiveStyles : profileMenuStyles"
             @click="chooseProfileMenu(1)">修改密码</div>

        <div class="profile_menu_item"
             :style="2 === activeMenuIndex ? profileMenuActiveStyles : profileMenuStyles"
             @click="chooseProfileMenu(2)">好友</div>

        <div class="profile_menu_item"
             :style="3 === activeMenuIndex ? profileMenuActiveStyles : profileMenuStyles"
             @click="chooseProfileMenu(3)">群</div>

        <div class="profile_menu_item"
             :style="4 === activeMenuIndex ? profileMenuActiveStyles : profileMenuStyles"
             @click="chooseProfileMenu(4)">聊天室</div>

        <div class="profile_menu_item"
             :style="5 === activeMenuIndex ? profileMenuActiveStyles : profileMenuStyles"
             @click="chooseProfileMenu(5)">消息</div>

        <div class="header-btns">
          <Icon type="ios-close"
                size="30"
                color="white"
                @click="closeWindow" />
        </div>

        <div class="pin"
             :class="[isPin ? 'active' : '']"
             title="置顶显示"
             @click="setAlwaysOnTop">
          <svg>
            <use xlink:href="#pin"></use>
          </svg>
        </div>
      </div>
      <div class="profile_content">
        <transition name="profile-content-inner-transition"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut faster">
          <div class="profile_content_inner"
               v-if="activeMenuIndex === 0">
            <CellGroup>
              <Cell>
                <p>头像</p>
                <upload-avatar slot="extra"
                               width="32"
                               height="32"
                               :login-info="loginInfo"
                               @success="modifyAvatar">
                  <Avatar :src="cachedLoginInfo.headIcon || (cachedLoginInfo.gender == 1 ? assets.maleAvatar : assets.femaleAvatar)" />
                </upload-avatar>
              </Cell>
              <Cell>
                <p>用户名</p>
                <Input slot="extra"
                       placeholder="暂无用户名"
                       v-model="cachedLoginInfo.username" />
              </Cell>
              <Cell>
                <p>手机号</p>
                <p slot="extra"
                   style="padding-right: 7px;"
                   :style="{color: cachedLoginInfo.phonenum ? '#515a6e' : '#c8c8c8'}"
                   v-text="cachedLoginInfo.phonenum || '暂无手机号'"></p>
              </Cell>
              <Cell>
                <p>昵称</p>
                <Input slot="extra"
                       placeholder="暂无昵称"
                       v-model="cachedLoginInfo.nickname" />
              </Cell>
              <Cell>
                <p>官职</p>
                <p slot="extra"
                   style="padding-right: 7px;"
                   :style="{color: cachedLoginInfo.enkel_role ? '#515a6e' : '#c8c8c8'}"
                   v-text="cachedLoginInfo.enkel_role ? cachedLoginInfo.enkel_role.name : '暂无官职'"></p>
              </Cell>
              <Cell>
                <p>官阶</p>
                <p slot="extra"
                   style="padding-right: 7px;"
                   :style="{color: cachedLoginInfo.enkel_role ? '#515a6e' : '#c8c8c8'}"
                   v-text="cachedLoginInfo.enkel_role ? cachedLoginInfo.enkel_role.desc : '暂无官阶'"></p>
              </Cell>
              <Cell>
                <p>邮箱</p>
                <Input slot="extra"
                       placeholder="暂无邮箱"
                       v-model="cachedLoginInfo.email" />
              </Cell>
              <Cell>
                <p>出生日期</p>
                <DatePicker slot="extra"
                            type="date"
                            :transfer="true"
                            placeholder="Select date"
                            :value="cachedLoginInfo.birthday | date"
                            @on-change="changeBirthDay"
                            style="width: 200px"></DatePicker>
              </Cell>
              <Cell>
                <p>性别</p>
                <div class="sex_box"
                     slot="extra">
                  <Tooltip placement="top"
                           content="男"
                           :transfer="true">
                    <div class="sex_item"
                         @click="changeSex(1)">
                      <Icon type="md-male"
                            :color="cachedLoginInfo.gender === 1 ? '#19be6b' : '#c8c8c8'"
                            size="18" />
                    </div>
                  </Tooltip>
                  <Tooltip placement="top"
                           content="女"
                           :transfer="true">
                    <div class="sex_item"
                         @click="changeSex(2)">
                      <Icon type="md-female"
                            :color="cachedLoginInfo.gender === 2 ? '#19be6b' : '#c8c8c8'"
                            size="18" />
                    </div>
                  </Tooltip>
                </div>
              </Cell>
              <Cell style="height: 32px;">
                <Button slot="extra"
                        type="primary"
                        size="small"
                        :disabled="!needSave"
                        :loading="saving"
                        @click="saveProfile">
                  <span style="font-size: 13px;"
                        v-if="!saving">保存</span>
                  <span style="font-size: 13px;"
                        v-else>保存中...</span>
                </Button>
              </Cell>
            </CellGroup>
          </div>
        </transition>
        <transition name="profile-content-inner-2-transition"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut faster">
          <div class="profile_content_inner"
               v-if="activeMenuIndex === 1">
            <CellGroup>
              <Cell>
                <p>旧密码</p>
                <Input slot="extra"
                       placeholder="旧密码"
                       type="password"
                       v-model="modifyPasswordForm.old" />
              </Cell>
              <Cell>
                <p>新密码</p>
                <Input slot="extra"
                       placeholder="新密码"
                       type="password"
                       v-model="modifyPasswordForm.newPass" />
              </Cell>
              <Cell>
                <p>确认密码</p>
                <Input slot="extra"
                       placeholder="确认密码"
                       type="password"
                       v-model="modifyPasswordForm.rePass" />
              </Cell>
              <Cell style="height: 32px;">
                <Button slot="extra"
                        type="primary"
                        size="small"
                        :disabled="!needModifyPassword"
                        :loading="modifyPasswordLoading"
                        @click="modifyPassword">
                  <span style="font-size: 13px;"
                        v-if="!modifyPasswordLoading">修改</span>
                  <span style="font-size: 13px;"
                        v-else>修改中...</span>
                </Button>
              </Cell>
            </CellGroup>
          </div>
        </transition>
        <transition name="profile-content-inner-2-transition"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut faster">
          <ProfileFriends :friends="friends"
                          :user-info="cachedLoginInfo"
                          :conversations="conversations"
                          :query="query"
                          v-if="activeMenuIndex === 2"></ProfileFriends>
        </transition>
        <transition name="profile-content-inner-2-transition"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut faster">
          <ProfileGroup :groups="groups"
                        :user-info="cachedLoginInfo"
                        :conversations="groupConversations"
                        v-if="activeMenuIndex === 3"></ProfileGroup>
        </transition>
        <transition name="profile-content-inner-2-transition"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut faster">
          <ProfileChatRoom v-if="activeMenuIndex === 4"></ProfileChatRoom>
        </transition>
        <transition name="profile-content-inner-2-transition"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut faster">
          <ProfileMessage :event-notifications="eventNotifications"
                          @accept="acceptFriendByIndex"
                          v-if="activeMenuIndex === 5"></ProfileMessage>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'blueimp-md5'
  import { Avatar, CellGroup, Cell, Input, DatePicker, Tooltip, Icon, Button } from 'view-design'
  import { ipcRenderer, remote } from 'electron'
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions } = createNamespacedHelpers('./store/modules')
  export default {
    name: 'Profile',
    components: {
      Avatar, CellGroup, Cell, Input, DatePicker, Tooltip, Icon, Button,
      UploadAvatar: () => import('../../custom/UploadAvatar.vue'),
      ProfileFriends: () => import('./Friends.vue'),
      ProfileGroup: () => import('./Group.vue'),
      ProfileChatRoom: () => import('./ChatRoom.vue'),
      ProfileMessage: () => import('./Message.vue')
    },
    data () {
      const valideRePassword = (rule, value, callback) => {
        if (value !== this.modifyPasswordForm.newPass) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      const valideNewPassword = (rule, value, callback) => {
        if (value === this.modifyPasswordForm.oldPass) {
          callback(new Error('新密码不能和原密码一致'))
        } else {
          callback()
        }
      }
      return {
        activeMenuIndex: 3,
        targets: ['profile', 'password', 'friend', 'group', 'room', 'message'],
        cachedLoginInfo: {},
        saving: false,
        modifyPasswordForm: {
          old: '',
          newPass: '',
          rePass: ''
        },
        modifyPasswordLoading: false,
        loginInfo: {},
        assets: {
          femaleAvatar: '/static/images/avatar_female.jpg',
          maleAvatar: '/static/images/avatar_male.jpg'
        },
        isPin: false, // 是否置顶
        query: {},
        friends: [],
        eventNotifications: [],
        conversations: [],
        groups: [], // 群列表
        groupConversations: [] // 群 离线消息
      }
    },
    computed: {
      profileMenuActiveStyles () {
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#ffffff',
          fontSize: '13px'
        }
      },
      profileMenuStyles () {
        return {}
      },
      needSave () {
        return (JSON.stringify(this.cachedLoginInfo) !== JSON.stringify(this.loginInfo))
      },
      requestInfo () {
        return this.$store.state.requestInfo
      },
      needModifyPassword () {
        return this.modifyPasswordForm.old && this.modifyPasswordForm.newPass && this.modifyPasswordForm.rePass && (this.modifyPasswordForm.newPass === this.modifyPasswordForm.rePass)
      },
      hasLogin () {
        return !!this.loginInfo.token
      }
    },
    async mounted () {
      await this.initLoginInfo()
      this.setAlwaysOnTop()
      ipcRenderer.on('change-query', (event, params) => {
        this.query = params
        console.log('change-query', params)
        this.activeMenuIndex = 0
        setTimeout(() => {
          if (params.hasOwnProperty('target')) {
            this.activeMenuIndex = Math.max(0, this.targets.indexOf(params.target))
          }
        }, 10)
      })

      ipcRenderer.on('im-login', this.imLogin)
      ipcRenderer.on('im-register', this.imRegister)
      ipcRenderer.on('login-info-updated', this.loginInfoUpdated)
      ipcRenderer.on('login-out', this.imLoginOut)
      ipcRenderer.on('save-profile-response', this.saveProfileResponse)
      ipcRenderer.on('modify-password-response', this.modifyPasswordResponse)

      ipcRenderer.on('im-on-event-notification', this.imOnEventNotification)
      ipcRenderer.on('im-on-sync-event', this.imOnSyncEvent)

      ipcRenderer.on('im-on-msg-receive', this.imOnMsgReceive)
      ipcRenderer.on('im-on-sync-conversation', this.imOnSyncConversation)

      // await this.imGetFriendList()
      await Promise.all([this.imGetFriendList(), this.imGetGroups()])
    },
    methods: {
      ...mapActions([
        'moduleIM'
      ]),
      imOnMsgReceive (event, data) {
        // 接收到新消息
        let message = data.messages[0]
        if (message.msg_type == 3) {
          // 单聊消息
          let targetItemIndex = -1
          this.conversations.some((item, index) => {
            if (item.from_username == message.from_username) {
              targetItemIndex = index
            }
          })
          if (targetItemIndex > -1) {
            this.conversations[targetItemIndex].msgs.push(message)
          }
          let win = remote.getCurrentWindow()
          if (!win.isVisible()) {
            // 当前窗口不可见
            if (message.from_username != this.cachedLoginInfo.phonenum) {
              ipcRenderer.send('notification', {
                title: '新消息',
                body: `${message.from_username}: ${message.content.msg_body.text.replace(/\\n/g, ' ')}`,
                redirect: 'https://dei2.com?p=profile&target=friend&friend=' + message.from_username
              })
            }
          }
        } else if (message.msg_type == 4) {
          // 群消息
          let targetGroupItemIndex = -1
          this.groupConversations.some((item, index) => {
            if (item.from_gid == message.from_gid) {
              targetGroupItemIndex = index
            }
          })
          if (targetGroupItemIndex > -1) {
            this.groupConversations[targetGroupItemIndex].msgs.push(message)
          }
          let win = remote.getCurrentWindow()
          if (!win.isVisible()) {
            // 当前窗口不可见
            ipcRenderer.send('notification', {
              title: `${message.content.target_name}`,
              body: `${message.content.from_name}: ${message.content.msg_body.text.replace(/\\n/g, ' ')}`,
              redirect: 'https://dei2.com?p=profile&target=group&group=' + message.from_gid
            })
          }
        }
      },
      imOnSyncConversation (event, data) {
        // 离线消息同步监听
        this.conversations = data.filter(item => item.from_username)
        this.groupConversations = data.filter(item => item.from_gid)
        console.log('>>>>>>>>imOnSyncConversation: ', data)
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
      async imGetFriendList () {
        // ipcRenderer.send('im-get-friend-list')
        await this.$store.dispatch('moduleIM/getFriendList').then(async (res) => {
          if (res.code == 0) {
            let arr = JSON.parse(JSON.stringify(res.friend_list))
            if (arr.length > 0) {
              for (let i = 0; i < arr.length; i++) {
                arr[i].headIcon = await this.getResource(arr[i].avatar)
              }
              this.friends = arr
            } else {
              this.friends = []
            }
            // this.friends = res.friend_list
          } else {
            this.friends = []
          }
        }).catch(err => {
          this.friends = []
        })
      },
      async imGetGroups () {
        await this.$store.dispatch('moduleIM/getGroups').then(async (res) => {
          if (res.code == 0) {
            let arr = JSON.parse(JSON.stringify(res.group_list))
            if (arr.length > 0) {
              for (let i = 0; i < arr.length; i++) {
                arr[i].headIcon = await this.getResource(arr[i].avatar)
              }
              this.groups = arr
            } else {
              this.groups = []
            }
          } else {
            this.groups = []
          }
        }).catch(err => {
          this.groups = []
        })
      },
      closeWindow () {
        ipcRenderer.send('hide-profile')
      },
      setAlwaysOnTop () {
        this.isPin = !this.isPin
        ipcRenderer.send('set-always-on-top', this.isPin)
      },
      async addFriendHandler (data) {
        let _data = JSON.parse(JSON.stringify(data))
        _data.headIcon = await this.getResource(data.media_id)
        this.eventNotifications.unshift(_data)
        ipcRenderer.send('notification', {
          title: '请求添加好友',
          body: `${data.from_nickname || data.from_username}: ${data.description}`,
          redirect: 'https://dei2.com?p=profile&target=message'
        })
      },
      async acceptFriendHandler (data) {
        let _data = JSON.parse(JSON.stringify(data))
        _data.username = _data.from_username
        _data.nickname = _data.from_nickname
        _data.headIcon = await this.getResource(data.media_id)
        this.friends.unshift(_data)
      },
      async imOnEventNotification (event, data) {
        console.log('imOnEventNotification: ', data)
        switch (data.event_type) {
          case 2:
            // 密码被修改，被迫下线
            this.$Message.info('密码已经修改，请重新登录')
            ipcRenderer.send('login-out')
            break
          case 5:
            // 添加好友
            if (data.extra == 1) {
              // 被邀请添加好友
              this.addFriendHandler(data)
            } else if (data.extra == 2) {
              // 同意添加好友
              this.acceptFriendHandler(data)
            }
            break
          case 6:
            // 被 好友删除
            this.$Message.info(`${data.memo_name || data.from_nickname || data.from_username}与您解除了好友关系`)
            await this.imGetFriendList()
            break
          case 7:
            // 好友更新事件
            console.log('>>>>>好友更新事件: ', data)
            break
          default:
            break
        }
      },
      imOnSyncEvent (evet, data) {
        console.log('imOnSyncEvent: ', data)
      },
      async imLogin (event, args) {
        await this.initLoginInfo()
        // if (this.hasLogin) {
        //   await this.$store.dispatch('moduleIM/login', {
        //     username: args.username,
        //     password: md5(args.password),
        //     is_md5: true
        //   }).then((data) => {
        //     alert('>>>' + JSON.stringify(data, null, 2))
        //     let _data = JSON.parse(JSON.stringify(data))
        //     if (_data.code === 0) {
        //       if (_data.user_info) {
        //         let _updateObj = {}
        //         if (_data.user_info.avatar) {
        //           _updateObj.headIcon = _data.user_info.avatar
        //         }
        //         if (_data.user_info.nickname) {
        //           _updateObj.nickname = _data.user_info.nickname
        //         }
        //         this.loginInfo = Object.assign({}, this.loginInfo, _updateObj)
        //       }
        //       ipcRenderer.send('update-user-info', this.loginInfo)
        //     }
        //   }).catch(err => {
        //   })
        // } else {
        // }
      },
      async imRegister (event, args) {
        await this.$store.dispatch('moduleIM/register', args).then((data) => {
          // let _data = JSON.parse(JSON.stringify(data))
          // if (_data.code === 0) {
          //   if (_data.user_info) {
          //     let _updateObj = {}
          //     if (_data.user_info.avatar) {
          //       _updateObj.headIcon = _data.user_info.avatar
          //     }
          //     if (_data.user_info.nickname) {
          //       _updateObj.nickname = _data.user_info.nickname
          //     }
          //     this.loginInfo = Object.assign({}, this.loginInfo, _updateObj)
          //   }
          //   ipcRenderer.send('update-user-info', this.loginInfo)
          // }
        }).catch(err => {
        })
      },
      async imLoginOut () {
        await this.$store.dispatch('moduleIM/loginOut')
        ipcRenderer.send('login-out-response')
        this.loginInfo = {}
        this.$Message.success('已经退出登录')
        // this.closeWindow()
      },
      async imGetSelfInfo () {
        return new Promise(async (resolve, reject) => {
          if (this.hasLogin) {
            await this.$store.dispatch('moduleIM/getUserInfo', {
              username: this.loginInfo.phonenum
            }).then(data => {
              resolve(data)
            }).catch(err => {
              reject(err)
            })
          } else {
            reject(new Error('未登录'))
          }
        })
      },
      async imUpdateSelfInfo (args) {
        return new Promise(async (resolve, reject) => {
          if (this.hasLogin) {
            await this.$store.dispatch('moduleIM/updateSelfInfo', args).then(data => {
              resolve(data)
            }).catch(err => {
              reject(new Error(err.message))
            })
          } else {
            reject(new Error('未登录'))
          }
        })
      },
      async imUpdateSelfAvatar (args) {
        return new Promise(async (resolve, reject) => {
          if (this.hasLogin) {
            await this.$store.dispatch('moduleIM/updateSelfAvatar', args).then(data => {
              if (data.code === 0 && data.user_info) {
                let _updateObj = {}
                if (data.user_info.avatar) {
                  _updateObj.headIcon = data.user_info.avatar
                }
                this.loginInfo = Object.assign({}, this.loginInfo, _updateObj)
                ipcRenderer.send('update-user-info', {
                  headIcon: data.user_info.avatar
                })
              } else {
              }

              resolve(data)
            }).catch(err => {
              reject(new Error(err.message))
            })
          } else {
            reject(new Error('未登录'))
          }
        })
      },
      async initLoginInfo () {
        return new Promise(async (resolve) => {
          this.loginInfo = this.$initLoginInfo()
          await this.$store.dispatch('moduleIM/init')
          if (this.hasLogin) {
            await this.$store.dispatch('moduleIM/login', {
              username: this.loginInfo.phonenum,
              password: md5(this.loginInfo.password),
              is_md5: true
            }).then(async (data) => {
              if (data.code === 0) {
                await this.imGetSelfInfo().then(res => {
                  let _data = JSON.parse(JSON.stringify(res))
                  if (_data.code == 0) {
                    if (_data.user_info) {
                      let _updateObj = {}
                      if (_data.user_info.avatar) {
                        _updateObj.headIcon = _data.user_info.avatar
                      }
                      if (_data.user_info.nickname) {
                        _updateObj.nickname = _data.user_info.nickname
                      }
                      this.loginInfo = Object.assign({}, this.loginInfo, _updateObj)
                    }
                    ipcRenderer.send('update-user-info', this.loginInfo)
                  }
                })
              }
              resolve(true)
            }).catch(err => {
              resolve(true)
            })
          }
          resolve(true)
        })
      },
      async acceptFriendByIndex (index) {
        if (index > -1 && (index < this.eventNotifications.length)) {
          await this.imGetFriendList()
          this.eventNotifications.splice(index, 1)
        }
      },
      loginInfoUpdated (event, loginInfo) {
        this.loginInfo = loginInfo || {}
      },
      chooseProfileMenu (index) {
        this.activeMenuIndex = Number(index)
      },
      changeSex (gender) {
        this.cachedLoginInfo.gender = Number(gender)
      },
      changeBirthDay (d1) {
        this.cachedLoginInfo.birthday = String(+new Date(d1))
      },
      saveProfile () {
        this.saving = true
        ipcRenderer.send('save-profile', this.cachedLoginInfo)

        // let updatedData = await this.$store.dispatch(types.AJAX, {
        //   url: this.requestInfo.updateUserInfo,
        //   data: this.cachedLoginInfo
        // })
        // setTimeout(() => {
        //   this.saving = false
        //   if (updatedData.status === 200) {
        //     this.$store.commit(types.CACHE_LOGIN_INFO, updatedData.data)
        //     this.$Message.success('保存成功')
        //   } else {
        //     this.$Message.error(updatedData.message || '保存失败，请稍后再试')
        //   }
        // }, 2000)
      },
      async saveProfileResponse (event, response) {
        if (response.status === 200) {
          await this.imUpdateSelfInfo({
            username: this.loginInfo.phonenum,
            nickname: this.cachedLoginInfo.nickname,
            gender: this.cachedLoginInfo.gender
          })
        }
        setTimeout(() => {
          this.saving = false
          if (response.status === 200) {
            this.initLoginInfo()
            this.$Message.success('保存成功')
          } else {
            this.$Message.error(response.message || '保存失败，请稍后再试')
          }
        }, 800)
      },
      async modifyPassword () {
        this.modifyPasswordLoading = true
        ipcRenderer.send('modify-password', Object.assign({}, this.modifyPasswordForm, {
          phonenum: this.loginInfo.phonenum,
          token: this.loginInfo.token
        }))
      },
      modifyPasswordResponse (event, response) {
        setTimeout(() => {
          this.modifyPasswordLoading = false
          if (response.status === 200) {
            this.$Message.success('保存成功')
          } else {
            this.$Message.error(response.message || '保存失败，请稍后再试')
          }
        }, 800)
      },
      async modifyAvatar (data) {
        await this.imUpdateSelfAvatar({
          avatar: this.$createFileFormData(data.file),
          username: this.loginInfo.phonenum
        })
        // ipcRenderer.send('im-update-self-avatar', {
        //   avatar: data.file
        // })
        this.$Message.destroy()
        this.$Message.success('头像更新成功')
      }
    },
    watch: {
      'loginInfo': {
        immediate: true,
        handler (val) {
          this.cachedLoginInfo = JSON.parse(JSON.stringify(val))
        }
      }
    },
    filters: {
      date (text) {
        return new Date(Number(text))
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../../themes/index.less");
  .profile_container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    -webkit-app-region: drag;
  }
  .profile_inner {
    position: relative;
    width: 500px;
    height: 500px;
    // background-color: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
  .profile_menu {
    position: relative;
    width: 100px;
    height: 100%;
    padding: 60px 0;
    background-color: @primary-color;
    box-sizing: border-box;
  }
  .profile_menu_item {
    width: 100%;
    height: 32px;
    cursor: pointer;
    padding: 0 15px;
    box-sizing: border-box;
    color: #888;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }
  .profile_menu_item:hover,
  .profile_menu_item:active {
    background-color: rgba(0, 0, 0, 0.7);
  }
  .header-btns {
    position: absolute;
    height: 32px;
    left: 10px;
    top: 10px;
    cursor: pointer;
  }

  .profile_content {
    position: relative;
    width: 300px;
    height: 500px;
    flex: 1;
    // padding: 15px 0;
    box-sizing: border-box;
    border-left: 1px solid rgba(0, 0, 0, 1);
    background-color: rgba(255, 255, 255, 0.9);
    // box-shadow: -1px 0 10px rgba(0, 0, 0, 0.4);
  }

  .profile_content_inner {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 15px 0;
    box-sizing: border-box;
  }
  .sex_box {
    width: 40px;
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .sex_item {
    width: 20px;
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .pin {
    position: absolute;
    right: 10px;
    top: 15px;
    z-index: 2;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &:hover {
      svg {
        fill: #888;
      }
    }
    svg {
      width: 16px;
      height: 16px;
      fill: #555;
      pointer-events: none;
    }
    &.active {
      svg {
        fill: #4fc08d;
      }
      &:hover {
        svg {
          fill: #4fc08d;
        }
      }
    }
  }
</style>