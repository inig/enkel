<template>
  <div class="chat_window">
    <div class="chat_window_header">
      <div class="chat_window_header_back"
           @click="hide">
        <Icon type="ios-arrow-back"
              style="pointer-events: none;"
              size="20" />
      </div>
      {{friendInfo.memo_name || friendInfo.nickname || friendInfo.username}}
    </div>
    <div class="chat_window_content">
      <MsgBox v-for="(item, index) in info"
              :key="item.msg_id"
              style="margin-top: 20px;"
              :user-info="userInfo"
              :friend-info="friendInfo"
              :info="item"></MsgBox>
      <code>
        <pre>{{JSON.stringify(info[0], null, 2)}}</pre>
      </code>
    </div>
  </div>
</template>

<script>
import { Icon } from 'view-design'
import MsgBox from './MsgBox'
export default {
  name: 'ProfileChatWindow',
  components: {
    Icon,
    MsgBox
  },
  props: {
    info: {
      type: [Object, Array],
      default () {
        return []
      }
    },
    friendInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    userInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      msgs: [
        {
          "content": {
            "create_time": 1586880914,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "test"
            },
            "msg_type": "text",
            "sui_mtime": 1586880653,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586880914403,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6943837506,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586942135,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "1111"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586942135908,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6952349413,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586943404,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "Nice to meet U"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586943404982,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6952559127,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586943565,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "111111"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586943565193,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6952587131,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586943740,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "123"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586943740940,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6952560992,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586944948,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "Hello"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586944948790,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6952825059,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586945053,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "Hello 2"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586945053637,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6952842923,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586945076,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "测试"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586945076395,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6952847127,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586951901,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000001",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "测试消息"
            },
            "msg_type": "text",
            "sui_mtime": 1586939595,
            "target_id": "18000000002",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586951901497,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6953999740,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586961684,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "Nice to Meet U"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586961684834,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6956026876,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586962100,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "asssssss"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586962100421,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6956117748,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586962583,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "kkkkkkk"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586962583880,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6956277639,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        },
        {
          "content": {
            "create_time": 1586962717,
            "from_appkey": "41a433f900631257d7a6ebb9",
            "from_id": "18000000002",
            "from_platform": "api",
            "from_type": "user",
            "msg_body": {
              "extras": {},
              "text": "111111111111"
            },
            "msg_type": "text",
            "sui_mtime": 1586933421,
            "target_id": "18000000001",
            "target_type": "single",
            "version": 1
          },
          "ctime_ms": 1586962717703,
          "custom_notification": {
            "alert": "",
            "at_prefix": "",
            "enabled": false,
            "title": ""
          },
          "msg_id": 6956249114,
          "msg_level": 0,
          "msg_type": 3,
          "need_receipt": false
        }
      ]
    }
  },
  methods: {
    hide () {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="less" scoped>
.chat_window {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  &_header {
    position: relative;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #f5f5f5;
    box-sizing: border-box;
    box-shadow: 0 1px 20px 1px #f5f5f5;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &_back {
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 1;
      transition: all 0.2s ease-in-out;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  &_content {
    width: 100%;
    height: calc(~"100% - 40px");
    overflow-y: auto;
  }
}
</style>