<template>
  <div class="media_pray">
    Media Pray
    <code>{{JSON.stringify(query, null, 2)}}</code>
    <Button type="success"
            @click="notify">通知</Button>
  </div>
</template>

<script>
  import { Button } from 'view-design'
  import { ipcRenderer } from 'electron'
  export default {
    name: 'MediaPray',
    components: {
      Button
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
        }
      }
    },
    created () {
      this.query = this.$getParamsFromUrl(location.href)
    },
    methods: {
      notify () {
        ipcRenderer.send('notification', this.messageObj)
        this.$Message.success('notification')
        // let notificate = new Notification(this.messageObj.title, {
        //   body: this.messageObj.body,

        // })
      }
    }
  }
</script>

<style lang="less">
  .media_pray {
    position: relative;
    -webkit-app-region: drag;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>