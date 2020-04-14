<template>
  <div class="container">
    <div class="friend_item"
         v-for="(item, index) in cachedFriends"
         :key="item.uid"
         @contextmenu="showContextMenu(item, index)">
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
    {{JSON.stringify(cachedFriends, null, 2)}}
    <div class="fixed_btn">
      <Button shape="circle"
              type="success"
              icon="md-person-add"
              @click="showFriendAddModal"></Button>
    </div>

    <Modal v-model="friendAddModal.shown"
           title="添加好友"
           @on-ok="imAddFriend"
           ok-text="添加"
           cancel-text="取消">
      <Form :label-width="60">
        <FormItem label="好友">
          <Input placeholder="用户名"
                 v-model="friendAddModal.target_name"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input placeholder="添加理由"
                 v-model="friendAddModal.why"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { Button, Avatar, Modal, Form, FormItem, Input } from 'view-design'
import { ipcRenderer, remote } from 'electron'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('./store/modules')
const { Menu, MenuItem } = remote
export default {
  name: 'ProfileFriends',
  components: {
    Button, Avatar, Modal, Form, FormItem, Input
  },
  props: {
    friends: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      cachedFriends: [],
      friendAddModal: {
        shown: true,
        target_name: '',
        why: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'moduleIM'
    ]),
    async getResource (id) {
      let resourceResponse = await this.$store.dispatch('moduleIM/getResourceUrl', {
        id: id
      })
      if (resourceResponse.code === 0) {
        return resourceResponse.url
      } else {
        return ''
      }
    },
    showFriendAddModal () {
      this.friendAddModal.shown = true
    },
    async imDelFriend (item, index) {
      await this.$store.dispatch('moduleIM/delFriend', {
        target_name: item.username
      }).then(res => {
        if (res.code === 0 && (Number(index) > -1) && (Number(index) < this.friends.length)) {
          // 好友删除成功
          this.$Message.success('好友删除成功')
          this.cachedFriends.splice(Number(index), 1)
        } else {
          this.$Message.success('好友删除失败，请稍后再试')
        }
      }).catch(err => {
        this.$Message.success('好友删除失败' + (err.message ? (': ' + err.message) : err.message))
      })
    },
    async imAddFriend () {
      await this.$store.dispatch('moduleIM/addFriend', {
        target_name: this.friendAddModal.target_name,
        why: this.friendAddModal.why
      }).then(res => {
        if (res.code === 0) {
          // 已经发出好友申请
          this.$Message.success('好友申请成功')
        } else {
          this.$Message.error('好友申请失败，请稍后再试')
        }
      }).catch(err => {
        this.$Message.error('好友申请失败' + (err.message ? (': ' + err.message) : err.message))
      })
    },
    showContextMenu (item, index) {
      const menu = new Menu()
      menu.append(new MenuItem({
        label: '删除好友',
        // icon: path.resolve(__dirname, '../../../../assets/add.png'),
        click: async () => {
          this.$Modal.confirm({
            title: '好友删除',
            content: `<p>确认删除<span>${item.memo_name || item.nickname || item.username}</span>吗?`,
            onOk: async () => {
              await this.imDelFriend(item, index)
            },
            onCancel: () => {

            }
          })
        }
      }))
      menu.popup({ window: remote.getCurrentWindow() })
    }
  },
  watch: {
    friends: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val.length > 0) {
          this.cachedFriends = val
        }
      }
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
  .fixed_btn {
    position: fixed;
    width: 48px;
    height: 48px;
    right: 10px;
    bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>