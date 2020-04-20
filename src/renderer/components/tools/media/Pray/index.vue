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
      <div class="media_pray_result_item"
           v-for="(item ,index) in info.answer"
           :key="item.username">
        <div class="media_pray_result_item_left">
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
        <div class="media_pray_result_item_right">
          <div class="media_pray_result_item_right_title">{{item.nickname || item.username}}: {{item.answer}}</div>
          <div class="media_pray_result_item_right_time">{{item.ctime | msgTimeFilter}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Avatar } from 'view-design'
import { ipcRenderer, remote } from 'electron'
import { SurveyStore, getItem, setItem } from '../../../../utils'
export default {
  name: 'MediaPray',
  components: {
    Button, Avatar,
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
      hasSubmit: false,
      results: [
      ],
      info: {}
    }
  },
  created () {
    this.query = this.$getParamsFromUrl(location.href)
    ipcRenderer.on('init-data', this.initData)
  },
  methods: {
    initResult () {
      let response = ipcRenderer.sendSync('survey-detail', {
        uuid: this.data.content.msg_body.id
      })
      console.log('>>>>>>>>>>', response)
      if (response.status == 200) {
        this.info = response.data
        if (this.info.answer.some(item => ((item.username == this.data.content.msg_body.userInfo.phonenum) || (item.username == this.data.content.msg_body.userInfo.username)))) {
          this.hasSubmit = true
        }
      } else {
        this.info = {
          name: this.data.content.msg_body.name,
          desc: this.data.content.msg_body.desc,
          auth_avatar: '',
          auth_id: this.data.content.from_id,
          auth_name: this.data.content.from_name,
          target_id: this.data.content.target_id,
          target_name: this.data.content.target_name,
          target_type: this.data.content.target_type,
          uuid: this.data.content.msg_body.id,
          createdAt: new Date(this.data.create_time),
          answer: [],
          question: [
            {
              type: 'RANDOM'
            }
          ]
        }
      }
    },
    async initData (event, data) {
      this.data = data
      console.log('Data >>>>>', this.data)
      this.initResult()
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
        this.$Message.loading('提交中...')
        let _ran = this.getRandom()
        let submitData = {
          answer: _ran,
          avatar: this.data.content.msg_body.userInfo.avatar || '',
          headIcon: this.data.content.msg_body.userInfo.headIcon || '',
          nickname: this.data.content.msg_body.userInfo.nickname || '',
          username: this.data.content.msg_body.userInfo.username || '',
          gender: this.data.content.msg_body.userInfo.gender || 2,
          ctime: (new Date()).getTime()
        }
        let response = ipcRenderer.sendSync('survey-answer', {
          uuid: this.data.content.msg_body.id,
          answer: JSON.stringify(submitData)
        })
        this.$Message.destroy()
        if (response.status == 200) {
          // 提交成功
          this.$Message.success('提交成功')
          this.info.answer.push(submitData)
          let msg = {
            id: this.data.content.msg_body.id,
            name: this.data.content.msg_body.name,
            desc: this.data.content.msg_body.desc,
            type: this.data.content.msg_body.type,
            answer: _ran,
            target_gid: this.data.content.target_id,
            target_gname: this.data.content.target_name,
            auth_id: this.data.content.from_id, // 调查 发起者 id
            auth_name: this.data.content.from_name,
            nickname: this.data.content.msg_body.userInfo.nickname,
            username: this.data.content.msg_body.userInfo.username
          }
          ipcRenderer.send('send-group-custom-msg', msg)
          this.hasSubmit = true
        } else {
          this.$Message.error('提交失败，请稍后再试')
        }
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
    &_item {
      width: 100%;
      height: 48px;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #f8f8f8;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: #f8f8f8;
      }
      &_left {
        width: 34px;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      &_right {
        width: calc(~"100% - 34px");
        height: 48px;
        padding-left: 15px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &_title {
          font-size: 14px;
          color: 333;
        }
        &_time {
          font-size: 12px;
          color: #c8c8c8;
        }
      }
    }
  }
}
</style>