<template>
  <div class="app_header"
       @dblclick="toggleWindowSize">
    <div class="close_wrapper"
         v-if="$route.meta && $route.meta.closable"
         @click="closeSettings">
      <svg>
        <use xlink:href="#close"></use>
      </svg>
    </div>
    <div class="menu_fold"
         v-if="$route.name === 'menu' && !menuFolded"
         @click="menuFold">
      <svg>
        <use :xlink:href="'#' + (menuFolded ? 'menu-unfold' : 'menu-fold')"></use>
      </svg>
    </div>
    <div class="menu_fold bgWhite"
         v-if="$route.name === 'menu' && menuFolded"
         title="双击打开"
         @dblclick="menuFold"
         @contextmenu="showRightMenu">
      <img src="~@/assets/logo2.png"
           alt="Enkel">
    </div>
    <!-- <div class="menu_operate"
         v-if="$route.name === 'menu' && !menuFolded">
      <Dropdown class="menu_operate_dropdown"
                transfer
                placement="bottom-end"
                @on-click="operateHandler">
        <a href="javascript:void(0)">
          <Icon type="ios-cog"
                size="20"
                color="#fff"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="show-all-window">显示所有窗口</DropdownItem>
          <DropdownItem name="hide-all-window">隐藏所有窗口</DropdownItem>
          <DropdownItem name="close-all-window">关闭所有窗口</DropdownItem>
          <DropdownItem name="show-settings">设置</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div> -->

    <!-- <div class="login_box"
         @click="gotoLogin">
      <Avatar v-if="loginInfo.token"
              size="30"
              :src="loginInfo.headIcon || (loginInfo.gender == 1 ? '/static/images/avatar_male.jpg' : '/static/images/avatar_female.jpg')"></Avatar>
      <Avatar v-else
              size="30"
              style="background-color: #888;"
              icon="ios-person"></Avatar>
    </div> -->

    <div class="login_box"
         v-if="$route.name === 'menu' && !menuFolded">
      <Dropdown class="menu_operate_dropdown"
                transfer
                placement="bottom-end"
                @on-click="operateHandler">
        <Avatar v-if="loginInfo.token"
                size="30"
                :src="loginInfo.headIcon || (loginInfo.gender == 1 ? '/static/images/avatar_male.jpg' : '/static/images/avatar_female.jpg')"></Avatar>
        <Avatar v-else
                size="30"
                style="background-color: #888;"
                icon="ios-person"
                @click="gotoLogin"></Avatar>
        <DropdownMenu slot="list">
          <DropdownItem name="show-all-window">显示所有窗口</DropdownItem>
          <!-- <DropdownItem name="hide-all-window">隐藏所有窗口</DropdownItem> -->
          <DropdownItem name="close-all-window">关闭所有窗口</DropdownItem>
          <DropdownItem name="show-settings">设置</DropdownItem>
          <DropdownItem name="show-profile"
                        v-if="loginInfo.token">个人中心</DropdownItem>
          <DropdownItem name="login"
                        v-if="!loginInfo.token">
            <Icon type="md-log-in"
                  size="16"
                  color="#19be6b" />
            <span style="color: #19be6b;">登录/注册</span>
          </DropdownItem>
          <DropdownItem name="logout"
                        v-else>
            <Icon type="md-log-out"
                  size="16"
                  color="#ed4014" />
            <span style="color: #ed4014;">退出登录</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>

    <!-- <div class="menu_home"
         v-if="!menuFolded"
         :style="{right: ($route.name === 'menu') ? '32px' : '0'}"
         @click="goto('home')">
      <svg>
        <use xlink:href="#home"></use>
      </svg>
    </div> -->
    <!-- <div class="menu_close"
         v-if="$route.name === 'menu' && !menuFolded"
         @click="closeMenu">
      <svg>
        <use xlink:href="#close"></use>
      </svg>
    </div> -->
    <slot>
      <span v-html="renderTitle"></span>
    </slot>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import { routes } from '../../router/routes'
  import { loginRouter, profileRouter } from '../../router/index'
  import { Dropdown, DropdownMenu, DropdownItem, Icon, Avatar } from 'view-design'
  // import { createNamespacedHelpers } from 'vuex'
  // const { mapActions } = createNamespacedHelpers('./store/modules')
  export default {
    name: 'AppHeader',
    components: {
      Dropdown, DropdownMenu, DropdownItem, Icon, Avatar
    },
    data () {
      return {
        menuFolded: false,
        title: '',
        loginRouter: {},
        loginInfo: {},
        eventNotifications: []
      }
    },
    computed: {
      renderTitle () {
        return this.title ? this.title : (this.$route.meta ? (this.$route.meta.title || 'Enkel') : 'Enkel')
      }
    },
    async mounted () {
      this.loginRouter = loginRouter
      // await this.initIm()
      this.initLoginInfo()
      ipcRenderer.on('menu-folded', () => {
        this.menuFolded = true
      })
      ipcRenderer.on('menu-unfolded', () => {
        this.menuFolded = false
      })
      // ipcRenderer.on('login-info-updated', this.loginInfoUpdated)
      // ipcRenderer.on('logout-response', this.logoutResponse)

      // ipcRenderer.on('im-login', this.imLogin)
      // // ipcRenderer.on('im-login-out', this.imLoginOut)
      // ipcRenderer.on('im-register', this.imRegister)
      // ipcRenderer.on('im-on-msg-receive', this.imOnMsgReceive)
      // ipcRenderer.on('im-update-self-info', this.imUpdateSelfInfo)
      // ipcRenderer.on('im-update-self-avatar', this.imUpdateSelfAvatar)
      // ipcRenderer.on('im-create-group', this.imCreateGroup)
      // ipcRenderer.on('im-get-groups', this.imGetGroups)

      // ipcRenderer.on('im-get-friend-list', this.imGetFriendList)
      // ipcRenderer.on('im-add-friend', this.imAddFriend)
      // ipcRenderer.on('im-accept-friend', this.imAcceptFriend)

      // ipcRenderer.on('im-on-sync-conversation', this.imOnSyncConversation)

      // ipcRenderer.on('im-get-event-notification', this.imGetEventNotification)

      // // 业务事件监听
      // ipcRenderer.on('im-on-event-notification', this.imOnEventNotification)
      // // 业务事件监听
      // ipcRenderer.on('im-on-sync-event', this.imOnSyncEvent)

      global.eventHub.$on('set-title', this.setTitle)
    },
    methods: {
      // ...mapActions([
      //   'moduleIM'
      // ]),
      initIm () {
        return new Promise(async (resolve) => {
          await this.$store.dispatch('moduleIM/init')
          resolve(true)
        })
      },
      imLogin (event, args) {
        return new Promise(async (resolve) => {
          let response = await this.$store.dispatch('moduleIM/login', args)
          resolve(response)
        })
      },
      imRegister (event, args) {
        return new Promise(async (resolve) => {
          let response = await this.$store.dispatch('moduleIM/register', args)
          console.log('注册：', response)
          resolve(response)
        })
      },
      imCreateGroup (event, args) {
        return new Promise(async (resolve) => {
          let response = await this.$store.dispatch('moduleIM/createGroup', args)
          ipcRenderer.send('im-get-groups')
          resolve(response)
        })
      },
      imGetGroups (event) {
        return new Promise(async (resolve) => {
          let response = await this.$store.dispatch('moduleIM/getGroups')
          ipcRenderer.send('im-get-groups-response', response)
          resolve(response)
        })
      },
      imGetFriendList (event) {
        return new Promise(async (resolve) => {
          let response = await this.$store.dispatch('moduleIM/getFriendList')
          ipcRenderer.send('im-get-friend-list-response', response)
          resolve(response)
        })
      },
      imAddFriend (event, args) {
        return new Promise(async (resolve) => {
          let response = await this.$store.dispatch('moduleIM/addFriend', args)
          ipcRenderer.send('im-get-friend-list')
          resolve(response)
        })
      },
      imAcceptFriend (event, args) {
        return new Promise(async (resolve) => {
          let response = await this.$store.dispatch('moduleIM/acceptFriend', args)
          ipcRenderer.send('im-get-friend-list')
          ipcRenderer.send('im-accept-friend-response', response)
          resolve(response)
        })
      },
      imLoginOut () {
        this.$store.dispatch('moduleIM/loginOut')
      },
      imOnMsgReceive (event, msg) {
        alert(JSON.stringify(msg, null, 2))
      },
      async imUpdateSelfInfo (event, data) {
        let response = await this.$store.dispatch('moduleIM/updateSelfInfo', data)
        console.log('imUpdateSelfInfo: ', response)
      },
      async imUpdateSelfAvatar (event, data) {
        let response = await this.$store.dispatch('moduleIM/updateSelfAvatar', data)
        console.log('imUpdateSelfAvatar: ', response)
      },
      async imGetUserInfo (event, data) {
        let response = await this.$store.dispatch('moduleIM/getUserInfo', data)
        console.log('getUserInfo: ', response)
      },
      addFriendHandler (data) {
        this.eventNotifications.unshift(data)
        ipcRenderer.send('notification', {
          title: '请求添加好友',
          body: `${data.from_nickname || data.from_username}: ${data.description}`,
          redirect: 'https://dei2.com?p=profile&target=message'
        })
      },
      async imOnEventNotification (event, data) {
        switch (data.event_type) {
          case 5:
            // 添加好友
            this.addFriendHandler(data)
            break
          default:
            break
        }
        // alert(JSON.stringify(data, null, 2))
      },
      addFriendOfflineHandler (data) {
        this.eventNotifications = data
      },
      imGetEventNotification () {
        ipcRenderer.send('im-get-event-notification-response', this.eventNotifications)
      },
      async imOnSyncEvent (event, data) {
        switch (data.event_type) {
          case 5:
            // 添加好友
            this.addFriendOfflineHandler(data)
            break
          default:
            break
        }
        // alert('sync: ' + JSON.stringify(data, null, 2))
      },
      async imOnSyncConversation (event, data) {
        // alert('imOnSyncConversation: ' + JSON.stringify(data, null, 2))
      },
      async initLoginInfo () {
        this.loginInfo = this.$initLoginInfo()
        await this.imLogin(null, {
          username: this.loginInfo.phonenum,
          password: '123123'
        })
        // console.log('>>>>>>>>>.', loginData)
        await this.imGetUserInfo(null, {
          username: this.loginInfo.phonenum
        })
        // setTimeout(async () => {
        //   let loginOutData = await this.imLoginOut()
        //   console.log('退出 ', loginOutData)
        // }, 3000)
      },
      setTitle (title) {
        this.title = `<span>【${title.label}】</span><span style="color: #888;">${title.url}</span>`
      },
      menuFold () {
        ipcRenderer.send(!this.menuFolded ? 'menu-fold' : 'menu-unfold')
      },
      closeMenu () {
        ipcRenderer.send('close-menu')
      },
      showRightMenu () {
        ipcRenderer.send('right-menu-click', {
          routes: routes
        })
      },
      operateHandler (name) {
        if (name == 'login') {
          this.gotoLogin()
        } else if (name == 'show-profile') {
          this.gotoProfile()
        } else {
          ipcRenderer.send(name)
          if (name === 'logout') {
            this.imLoginOut()
          }
        }
      },
      closeSettings () {
        ipcRenderer.send('hide-settings')
      },
      toggleWindowSize () {
        if (!this.$route.meta || !this.$route.meta.unresizable) {
          ipcRenderer.send('toggle-window-size')
        }
      },
      goto (data) {
        this.$goto(data)
      },
      gotoLogin () {
        this.goto(this.loginRouter)
      },
      gotoProfile () {
        this.goto(profileRouter)
      },
      loginInfoUpdated (event, loginInfo) {
        this.loginInfo = loginInfo || {}
      },
      logoutResponse () {
        this.loginInfo = {}
        this.$Message.success('已经退出登录')
      }
    },
    watch: {
      '$route': {
        immediate: true,
        handler (val) {
          this.title = ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../themes/index.less");
  .bgWhite {
    background-color: #000 !important;
  }
  .app_header {
    position: relative;
    width: 100%;
    height: 48px;
    cursor: move;
    background-color: @primary-color;
    -webkit-app-region: drag;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
  }
  .close_wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 48px;
    height: 48px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
      fill: #ffffff;
    }
  }
  .menu_fold {
    position: absolute;
    width: 48px;
    height: 48px;
    left: 0;
    top: 0;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
      fill: #ffffff;
    }
    &:hover {
      svg {
        fill: #c8c8c8;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .menu_operate {
    width: 48px;
    height: 48px;
    position: absolute;
    right: 48px;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .menu_operate_dropdown {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  .login_box {
    width: 30px;
    height: 48px;
    cursor: pointer;
    position: absolute;
    right: 18px;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .menu_home {
    position: absolute;
    width: 48px;
    height: 48px;
    top: 0;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 16px;
      height: 16px;
      fill: #ffffff;
    }
    &:hover {
      svg {
        fill: #c8c8c8;
      }
    }
  }
  .menu_close {
    position: absolute;
    width: 48px;
    height: 48px;
    right: 0;
    top: 0;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
      fill: #ffffff;
    }
    &:hover {
      svg {
        fill: #c8c8c8;
      }
    }
  }
</style>