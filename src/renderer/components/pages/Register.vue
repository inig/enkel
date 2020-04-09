<template>
  <div class="login_container">
    <div id="login-container">
      <div class="top-container"
           :class="{'shadow': bottomContainerShown}">
        <div class="header-btns">
          <img src="~@/assets/close.png"
               class="close"
               @click="closeWindow">
        </div>
        <div class="main-container">
          <div class="user-icon">
            <img :src="'/static/images/avatar_female.jpg'">
          </div>
          <div class="status-container"></div>
          <div class="login-form"
               v-if="loginStatus === -1">
            <div class="phonenum form-item">
              <input type="text"
                     :ref="refEle.phonenum"
                     v-model="formData.phonenum"
                     placeholder="输入手机号" />
            </div>
            <div class="password phonenum form-item">
              <input type="password"
                     :ref="refEle.password"
                     v-model="formData.password"
                     placeholder="输入密码" />
            </div>
            <div class="password form-item">
              <input type="password"
                     :ref="refEle.confirmPassword"
                     v-model="formData.confirmPassword"
                     placeholder="再次输入密码" />
              <div class="login"
                   :class="{'shown': (formData.phonenum.trim() !== '' && formData.confirmPassword.trim() !== '' && (formData.confirmPassword.trim() == formData.password.trim()))}"
                   @click="register">
                <img src="~@/assets/login.png"
                     alt="注册">
              </div>
            </div>
          </div>
          <div class="login-form-sending"
               v-if="loginStatus === 0">
            <div class="info-phonenum"
                 v-text="formData.phonenum"></div>
            <div class="login-cancel">
              <button type="button">取消</button>
            </div>
          </div>
          <div class="login-form-sending"
               v-if="loginStatus === 1">
            <div class="info-phonenum"
                 v-text="formData.phonenum"></div>
            <div class="info-phonenum">
              <img src="~@/assets/success.png">
            </div>
          </div>
        </div>
        <div class="bottom-btns"
             @click="toggleBottomContainer">
          <img class="show-bottom-container"
               :class="{'up': bottomContainerShown}"
               src="~@/assets/down.png">
        </div>
      </div>
      <div class="bottom-container"
           :class="{'shown': bottomContainerShown}">
        已有账号，<a href="javascript:void(0)"
           @click="gotoLoginPage">去登录</a>
      </div>
    </div>
    <audio :src="bgAudio.src"
           autoplay
           :ref="bgAudio.ref"
           id="bg-audio"></audio>
  </div>
</template>
<style scoped>
  input:focus {
    box-shadow: none;
    outline: none;
  }
  button:focus {
    box-shadow: none;
    outline: none;
  }
  .fs14 {
    font-size: 14px;
  }
  .login_container {
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 4px;
    background-color: transparent;
    -webkit-app-region: drag;
  }
  #login-container .top-container {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 315px;
    background: -webkit-linear-gradient(top, #eee, #ddd);
    border-radius: 4px;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
  }
  #login-container .top-container.shadow {
    -webkit-box-shadow: 0 1px 12px gray;
    -moz-box-shadow: 0 1px 12px gray;
    box-shadow: 0 1px 12px gray;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  #login-container .top-container .bottom-btns {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    /*background-color: red;*/
  }
  #login-container .top-container .bottom-btns img {
    -webkit-app-region: no-drag;
    -webkit-user-select: none;
    width: 64px;
    height: 32px;
    -webkit-filter: opacity(0.5);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
    -webkit-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    -moz-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    -o-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  #login-container .top-container .bottom-btns img.up {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  #login-container .top-container .header-btns {
    /*width: 100%;*/
    height: 32px;
    /*text-align: right;*/
  }
  #login-container .top-container .header-btns img.close {
    -webkit-app-region: no-drag;
    -webkit-user-select: none;
    width: 24px;
    height: 24px;
    margin-left: 4px;
    margin-top: 4px;
    opacity: 0.5;
    cursor: pointer;
  }
  #login-container .top-container .main-container {
    width: 100%;
    height: calc(100% - 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #login-container .top-container .main-container .user-icon {
    width: 100%;
    height: 140px;
    /*background-color: #5e4fff;*/
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #login-container .top-container .main-container .user-icon img {
    width: 100px;
    height: 100px;
    border-radius: 60px;
    border: 3px solid darkgray;
  }
  #login-container .top-container .main-container .user-icon img:hover {
    -webkit-filter: opacity(0.9);
  }
  #login-container .top-container .main-container .status-container {
    width: 100%;
    height: 25px;
  }
  #login-container .top-container .main-container .login-form-sending {
    width: 220px;
    height: 75px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  #login-container
    .top-container
    .main-container
    .login-form-sending
    .info-phonenum {
    font-size: 14px;
    color: #333;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #login-container
    .top-container
    .main-container
    .login-form-sending
    .login-cancel {
    text-align: center;
  }
  #login-container
    .top-container
    .main-container
    .login-form-sending
    .login-cancel
    button {
    padding: 6px 16px;
    color: #666;
    border-radius: 4px;
    background-color: transparent;
    border: 1px solid #c8c8c8;
    cursor: pointer;
  }
  #login-container
    .top-container
    .main-container
    .login-form-sending
    .login-cancel
    button:hover {
    background-color: #ddd;
  }
  #login-container .top-container .main-container .login-form {
    width: 220px;
    height: auto;
    border: 1px solid darkgray;
    border-radius: 4px;
    background-color: #ffffff;
  }
  #login-container .top-container .main-container .login-form .form-item {
    padding: 4px 8px;
  }
  #login-container .top-container .main-container .login-form .form-item input {
    border: none;
    width: 100%;
    font-size: 14px;
    line-height: 28px;
  }
  #login-container .top-container .main-container .login-form .phonenum {
    border-bottom: 1px solid #c8c8c8;
  }
  #login-container .top-container .main-container .login-form .password {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  #login-container .top-container .main-container .login-form .password input {
    padding-right: 15px;
  }
  #login-container .top-container .main-container .login-form .password .login {
    width: 28px;
    height: 28px;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  #login-container
    .top-container
    .main-container
    .login-form
    .password
    .login.shown {
    display: inline-flex;
  }
  #login-container
    .top-container
    .main-container
    .login-form
    .password
    .login
    img {
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }
  #login-container .bottom-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 51px;
    opacity: 0;
    padding: 12px 0;
    box-sizing: content-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #ddd;
    -webkit-transform: translate3d(0, -100%, 0);
    -moz-transform: translate3d(0, -100%, 0);
    -o-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    -webkit-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    -moz-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    -o-transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  #login-container .bottom-container.shown {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  #login-container .bottom-container a {
    color: #19be6b;
  }
  #login-container .item {
    width: calc(100% - 30px);
    height: 30px;
    padding: 0 15px;
    font-size: 12px;
    color: #666;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  #login-container .item .right button {
    color: #666;
    padding: 1px 8px;
    background-color: transparent;
    border: 1px solid #999;
    border-radius: 12px;
    cursor: pointer;
  }
  #login-container .item .right button:hover {
    background-color: #d0d0d0;
  }
</style>
<script>
  const { ipcRenderer } = require('electron')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const adapter = new FileSync('db.json')
  const db = low(adapter)
  export default {
    name: 'Register',
    data () {
      return {
        currentUser: {},
        bottomContainerShown: true,
        bgAudio: {
          ref: 'ref-bg-audio',
          src: ''
        },
        refEle: {
          phonenum: 'ref-phonenum',
          password: 'ref-password',
          confirmPassword: 'ref-confirm-password'
        },
        formData: {
          phonenum: '18000000000',
          password: '123123',
          confirmPassword: '123123'
        },
        loginStatus: -1 // 0: 登录中，-1：未登录，1：已经登录
      }
    },
    created () {
      this.$nextTick(() => {
        window.removeEventListener('keydown', this.keyboardEventHandler)
        window.addEventListener('keydown', this.keyboardEventHandler)

        document.querySelector('#bg-audio').addEventListener('ended', this.audioEnded)

        ipcRenderer.on('register-response', this.registerResponse)

        ipcRenderer.send('set-always-on-top', true)
      })
    },
    methods: {
      closeWindow () {
        // remote.app.quit()
        ipcRenderer.send('close-window')
      },
      toggleBottomContainer () {
        this.bottomContainerShown = !this.bottomContainerShown
        this.playSound('/static/resources/ls/soso.wav')
      },
      keyboardEventHandler (evt) {
        if (evt.keyCode === 13) {
          this.register()
        }
      },
      register () {
        if (this.formData.phonenum.trim() === '') {
          this.$refs[this.refEle.phonenum].focus()
        } else {
          if (this.formData.password.trim() === '') {
            this.$refs[this.refEle.password].focus()
          } else if (this.formData.confirmPassword.trim() === '') {
            this.$refs[this.refEle.confirmPassword].focus()
          } else {
            // 登录
            this.loginStatus = 0
            // remote.ipcMain.emit('login', this.formData)
            ipcRenderer.send('register', {
              phonenum: this.formData.phonenum,
              password: this.formData.password,
            })
          }
        }
      },
      registerResponse (event, res) {
        if (res.status === 200) {
          // 登录成功
          this.loginStatus = 1
          // this.initLoginInfo()
          setTimeout(() => {
            this.playSound('/static/resources/ls/login.wav')
          }, 500)
          setTimeout(() => {
            // remote.ipcMain.emit('close-login-window')
            // this.closeWindow()
            this.bottomContainerShown = false
            this.gotoLoginPage()
            this.loginStatus = -1
            this.formData.password = ''
          }, 1500)
        } else {
          // 登录失败
          this.playSound('/static/resources/ls/Global.wav')
          this.loginStatus = -1
          this.$Message.error(res.message)
        }
      },
      playSound (src) {
        let audioEle = document.querySelector('#bg-audio')
        this.bgAudio.src = src
        audioEle.play()
      },
      audioEnded () {
        this.bgAudio.src = ''
      },
      setWindowSize (size) {
        ipcRenderer.sendSync('set-window-size', size)
      },
      gotoLoginPage () {
        this.$router.replace({
          name: 'login'
        })
      }
    },
    components: {}
  }
</script>
