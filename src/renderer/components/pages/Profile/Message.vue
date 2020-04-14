<template>
  <div class="container">
    <div class="item"
         v-for="(item, index) in message"
         :key="item.event_id">
      <div class="item_left">
        <div class="item_left_title">
          <span>好友申请: </span>
          <span>{{item.from_nickname || item.from_username}}</span>
        </div>
        <div class="item_left_time">
          <span>{{item.ctime_ms | dateTimeFilter}}</span>
        </div>
        <div class="item_left_desc">
          {{item.description}}
        </div>
      </div>
      <div class="item_right">
        <span style="color: #515a6e; font-size: 13px;"
              v-if="item.accept">已接受</span>
        <Button type="success"
                size="small"
                v-else
                @click="acceptFriendRequest(index)">接受</Button>
      </div>
    </div>
    {{JSON.stringify(message, null, 2)}}
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import { Button } from 'view-design'
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions } = createNamespacedHelpers('./store/modules')
  export default {
    name: 'ProfileMessage',
    components: {
      Button
    },
    data () {
      return {
        message: [
          {
            "ctime": 1586687569,
            "ctime_ms": 1586687569651,
            "description": "添加理由: 91",
            "event_id": 781674690,
            "event_type": 5,
            "extra": 1,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_gid": 0,
            "from_nickname": "18000000001",
            "from_username": "18000000001",
            "gid": 1,
            "msg_ids": [],
            "return_code": 0
          }
        ]
      }
    },
    mounted () {
      // ipcRenderer.send('im-get-event-notification')
      // ipcRenderer.on('im-get-event-notification-response', this.imGetEventNotificationResponse)
      // ipcRenderer.on('im-accept-friend-response', this.imAcceptFriendResponse)
    },
    methods: {
      ...mapActions([
        'moduleIM'
      ]),
      imGetEventNotificationResponse (event, data) {
        this.message = data
      },
      async acceptFriendRequest (index) {
        await this.$store.dispatch('moduleIM/acceptFriend', {
          target_name: this.message[Number(index)].from_username
        }).then(res => {
          console.log('accept friend: ', res)
        }).catch(err => {
          console.log('accept friend error: ', err.message)
        })
      },
      imAcceptFriendResponse (event, data) {
        alert('添加好友：' + JSON.stringify(data, null, 2))
        if (data.code == 0) {
          // 好友添加成功
          this.message.splice(Number(index), 1, Object.assign({}, this.message[Number(index)], {
            accept: true
          }))
          this.$Message.success('好友添加成功')
        } else {
          this.$Message.error(data.message || '好友添加失败')
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
    .item {
      width: 100%;
      height: 64px;
      padding: 0 10px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      &_left {
        width: calc(~"100% - 64px");
        height: 64px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &_title {
          width: 100%;
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          color: #333;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &_time {
          width: 100%;
          height: 18px;
          line-height: 18px;
          font-size: 12px;
          color: #ccc;
        }
        &_desc {
          width: 100%;
          height: 18px;
          line-height: 18px;
          font-size: 12px;
          color: #888;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      &_right {
        width: 64px;
        height: 64px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
</style>