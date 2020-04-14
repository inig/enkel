<template>
  <div class="container">
    <div class="friend_item"
         v-for="(item, index) in friends"
         :key="item.uid"
         @contextmenu="showContextMenu(item)">
      <div class="friend_item_left">
        <Avatar size="34"
                shape="square"
                style="background-color: #fff;"
                :src="item.avatar"
                v-if="item.avatar"></Avatar>
        <Avatar size="34"
                shape="square"
                icon="ios-person"
                style="background-color: #87d068"
                v-else></Avatar>
      </div>
      <div class="friend_item_right">
        <div class="friend_item_right_title">
          {{item.memo_name || item.nickname || item.username}}
        </div>
        <div class="friend_item_right_desc">
          什么内容也没有
        </div>
      </div>
    </div>
    {{JSON.stringify(friends, null, 2)}}
    <Button @click="imAddFriend">添加好友</Button>
  </div>
</template>

<script>
  import { Button, Avatar } from 'view-design'
  import { ipcRenderer, remote } from 'electron'
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions } = createNamespacedHelpers('./store/modules')
  const { Menu, MenuItem } = remote
  export default {
    name: 'ProfileFriends',
    components: {
      Button, Avatar
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
    async mounted () {
      // ipcRenderer.on('im-get-friend-list-response', this.imGetFriendListResponse)
      // ipcRenderer.on('im-add-friend-response', this.imGetFriendListResponse)
      this.$nextTick(async () => {
        await this.imGetFriendList()
      })
    },
    methods: {
      ...mapActions([
        'moduleIM'
      ]),
      async imGetFriendList () {
        // ipcRenderer.send('im-get-friend-list')
        console.log('========0000======')
        await this.$store.dispatch('moduleIM/getFriendList').then(res => {
          console.log('==============', res)
          if (res.code == 0) {
            this.friends = res.friend_list
          } else {
            this.friends = []
          }
        }).catch(err => {
          console.log('>>>>>>>error', err)
          this.friends = []
        })
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
      },
      showContextMenu (item) {
        const menu = new Menu()
        menu.append(new MenuItem({
          label: '删除好友',
          // icon: path.resolve(__dirname, '../../../../assets/add.png'),
          click: () => {
            alert('删除好友：' + JSON.stringify(item, null, 2))
          }
        }))
        menu.popup({ window: remote.getCurrentWindow() })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .friend_item {
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
        border-bottom: 1px solid #f8f8f8;
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
</style>