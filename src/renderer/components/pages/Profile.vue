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
          <CellGroup v-if="activeMenuIndex === 0">
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
        </transition>
        <transition name="profile-content-inner-2-transition"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut faster">
          <CellGroup v-if="activeMenuIndex === 1">
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
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { Avatar, CellGroup, Cell, Input, DatePicker, Tooltip, Icon, Button } from 'view-design'
import { ipcRenderer } from 'electron'
export default {
  name: 'Profile',
  components: {
    Avatar, CellGroup, Cell, Input, DatePicker, Tooltip, Icon, Button,
    UploadAvatar: () => import('../custom/UploadAvatar.vue')
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
      activeMenuIndex: 0,
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
      isPin: false // 是否置顶
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
    }
  },
  mounted () {
    this.initLoginInfo()
    this.setAlwaysOnTop()
    ipcRenderer.on('login-info-updated', this.loginInfoUpdated)
    ipcRenderer.on('logout-response', this.logoutResponse)
    ipcRenderer.on('save-profile-response', this.saveProfileResponse)
    ipcRenderer.on('modify-password-response', this.modifyPasswordResponse)
  },
  methods: {
    closeWindow () {
      ipcRenderer.send('close-window')
    },
    setAlwaysOnTop () {
      this.isPin = !this.isPin
      ipcRenderer.send('set-always-on-top', this.isPin)
    },
    initLoginInfo () {
      this.loginInfo = this.$initLoginInfo()
    },
    loginInfoUpdated (event, loginInfo) {
      this.loginInfo = loginInfo || {}
    },
    logoutResponse () {
      this.loginInfo = {}
      this.$Message.success('已经退出登录')
      this.closeWindow()
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
    async saveProfile () {
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
    saveProfileResponse (event, response) {
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
    modifyAvatar (data) {
      this.cachedLoginInfo.headIcon = data.path
      this.loginInfo.headIcon = data.path
      ipcRenderer.send('update-user-info', {
        headIcon: data.path
      })
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
@import url("../../themes/index.less");
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
  width: 400px;
  height: 400px;
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
  height: 400px;
  flex: 1;
  padding: 15px 0;
  box-sizing: border-box;
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: -1px 0 10px rgba(0, 0, 0, 0.4);
}
.profile_content_inner {
  position: absolute;
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