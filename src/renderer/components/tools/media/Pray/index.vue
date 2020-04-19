<template>
  <div class="media_pray">
    <AppHeader v-if="data.content && data.content.msg_body && !data.content.msg_body.withoutHeader"></AppHeader>
    <div class="media_pray_header"
         v-if="data.content && data.content.msg_body">{{data.content.msg_body.name}}</div>
    <div class="media_pray_desc"
         v-if="data.content && data.content.msg_body">{{data.content.msg_body.desc}}</div>
    <div class="media_pray_btns">
      <Button type="success"
              @click="submit"
              :disabled="hasSubmit">{{hasSubmit ? '已提交' : '提交'}}</Button>
    </div>
    <div class="media_pray_result">
      <div class="media_pray_result_item"></div>
    </div>
  </div>
</template>

<script>
import { Button } from 'view-design'
import { ipcRenderer, remote } from 'electron'
import { SurveyStore, getItem, setItem } from '../../../../utils'
export default {
  name: 'MediaPray',
  components: {
    Button,
    AppHeader: () => import('../../../parts/AppHeader')
  },
  data () {
    return {
      query: {},
      messageObj: {
        title: '这是标题',
        // subtitle: '这是子标题',
        body: '这是正文内容',
        // sound: true,
        // silent: false,
        icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586516609370&di=63bbf75ee205b7c8f526bedd222fdffa&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F17%2F04%2F10%2F33eb602192951b9ea74bf88754324c3a.jpg',
        // hasReply: true,
        // replyPlaceholder: 'reply-placeholder',
        sound: '/static/resources/ls/msg.wav',
        actions: [
          '打开', '设置'
        ],
        closeButtonText: '关闭',
        redirect: 'http://dei2.com/?p=fm'
      },
      data: {},
      hasSubmit: false
    }
  },
  created () {
    this.query = this.$getParamsFromUrl(location.href)
    ipcRenderer.on('init-data', this.initData)
  },
  methods: {
    async initData (event, data) {
      this.data = data
      let res = await getItem({
        key: 'answer-' + this.data.content.msg_body.id,
        store: SurveyStore
      })
      if (res) {
        this.hasSubmit = true
      } else {
        this.hasSubmit = false
      }
    },
    notify () {
      ipcRenderer.send('notification', this.messageObj)
      this.$Message.success('notification')
      // let notificate = new Notification(this.messageObj.title, {
      //   body: this.messageObj.body,

      // })
    },
    getRandom () {
      return Math.floor(Math.random() * 10000)
    },
    async submit () {
      if (!this.data.content || !this.data.content.msg_body || !this.data.content.msg_body.userInfo) {
        return
      } else {
        let _ran = this.getRandom()
        let msg = {
          id: this.data.content.msg_body.id,
          name: this.data.content.msg_body.name,
          desc: this.data.content.msg_body.desc,
          type: this.data.content.msg_body.type,
          answer: _ran,
          target_gid: this.data.content.target_id,
          target_gname: this.data.content.target_name,
          auth_id: this.data.content.from_id, // 调查 发起者 id
          auth_name: this.data.content.from_name
        }
        await setItem({
          key: 'answer-' + this.data.content.msg_body.id,
          data: _ran,
          store: SurveyStore
        })
        ipcRenderer.send('send-group-custom-msg', msg)
        this.hasSubmit = true
      }
    }
  }
}
</script>

<style lang="less">
@import url("../../../../themes/index.less");
.media_pray {
  position: relative;
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
  background-color: #fff;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  &_header {
    width: 100%;
    height: 96px;
    font-size: 18px;
    font-weight: bold;
    color: #222;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  &_desc {
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 14px;
  }
  &_btns {
    width: 100%;
    height: 48px;
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    box-sizing: border-box;
  }
  &_result {
    width: 100%;
    min-height: 48px;
    padding: 15px;
    box-sizing: border-box;
    margin-top: 30px;
    background-color: #f0f0f0;
    &_item {
      width: 100%;
      height: 48px;
      background-color: #fff;
    }
  }
}
</style>