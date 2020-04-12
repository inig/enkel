<template>
  <div class="container">
    {{JSON.stringify(friends, null, 2)}}
    <Button @click="imAddFriend">添加好友</Button>
  </div>
</template>

<script>
import { Button } from 'view-design'
import { ipcRenderer } from 'electron'
export default {
  name: 'ProfileFriends',
  components: {
    Button
  },
  data () {
    return {
      friends: [],
      addFriendData: {
        target_name: '',
        why: ''
      }
    }
  },
  mounted () {
    ipcRenderer.on('im-get-friend-list-response', this.imGetFriendListResponse)
    ipcRenderer.on('im-add-friend-response', this.imGetFriendListResponse)
    this.imGetFriendList()
  },
  methods: {
    imGetFriendList () {
      ipcRenderer.send('im-get-friend-list')
    },
    imGetFriendListResponse (event, data) {
      alert(JSON.stringify(data, null, 2))
      if (data.code == 0) {
        // 获取成功
        this.friends = data.friend_list
      } else {
        this.friends = []
      }
    },
    imAddFriend () {
      this.addFriendData = {
        target_name: '18000000002',
        why: '添加理由: ' + Math.floor(Math.random() * 100)
      }
      ipcRenderer.send('im-add-friend', this.addFriendData)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>