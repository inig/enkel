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
      <div class="chat_window_content_wrapper"
           ref="chatWindowContentRef">
        <MsgBox v-for="(item, index) in info"
                :key="item.msg_id"
                style="margin-top: 20px;"
                :user-info="userInfo"
                :friend-info="friendInfo"
                :ref="'msgBoxRef-' + index"
                :info="item"></MsgBox>
      </div>
    </div>
  </div>
</template>

<script>
  import { Icon } from 'view-design'
  import MsgBox from './MsgBox'
  require('../../../assets/js/scrollTo.js')
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
        scrollerTimeout: null
      }
    },
    mounted () {
      this.$nextTick(() => {
        let targetRef = this.$refs['msgBoxRef-' + (this.info.length - 1)][0].$el
        this.initScroller(targetRef)
      })
    },
    methods: {
      hide () {
        this.$emit('hide')
      },
      initScroller (scrollTo) {
        if (this.scrollerTimeout) {
          clearTimeout(this.scrollerTimeout)
        }
        this.scrollerTimeout = setTimeout(() => {
          animateScrollTo(scrollTo, {
            elementToScroll: document.querySelector('.chat_window_content'),
            minDuration: 400
          }).then(res => {
            console.log('+++++++', res)
            clearTimeout(this.scrollerTimeout)
          })
        }, 300)
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