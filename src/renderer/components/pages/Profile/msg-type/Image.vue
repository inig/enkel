<template>
  <div class="msg_text"
       :style="[containerStyles]">
    <div class="msg_text_time"
         :style="[timeStyles]">
      <span style="color: #888;"
            :style="[nameStyles]"
            v-if="renderInfo.content && renderInfo.content.from_name">{{renderInfo.content.from_name}}</span>
      {{renderInfo.ctime_ms | msgTimeFilter}}</div>
    <div class="msg_text_box"
         :style="[theme, boxStyles]"
         @contextmenu="showContextMenu">
      <img v-lazy="renderInfo.content && renderInfo.content.msg_body && renderInfo.content.msg_body.imageUrl">
      <canvas ref="canvasRef"
              :width="canvasSize.width"
              :height="canvasSize.height"
              :style="{opacity: true ? 0 : 1}"></canvas>
    </div>
    <div class="msg_text_arrow"
         :style="[arrowStyles]">
      <div class="triangle"
           :style="[theme]"></div>
    </div>

    <Modal v-model="decodeModal.shown"
           title="图片解密"
           :loading="decodeModal.loading"
           @on-ok="decodeImage">
      <Form :label-width="80">
        <FormItem label="密码">
          <Input placeholder="请输入查看密码"
                 v-model="decodeModal.data.password"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { Modal, Form, FormItem, Input } from 'view-design'
  import { remote } from 'electron'
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions } = createNamespacedHelpers('./store/modules')
  const { Menu, MenuItem } = remote
  const sjcl = require('../../../../../../static/js/sjcl')
  export default {
    name: 'MsgBoxImage',
    components: {
      Modal, Form, FormItem, Input
    },
    props: {
      info: {
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
        leftTheme: {
          backgroundColor: '#eee',
          color: '#555'
        },
        rightTheme: {
          backgroundColor: '#19be6b',
          color: '#fff'
        },
        renderInfo: {},
        decodeModal: {
          shown: false,
          loading: true,
          data: {
            password: ''
          }
        },
        decodedMessage: '',
        canvasSize: {
          width: 300,
          height: 300
        }
      }
    },
    computed: {
      getImageUrl () {
        return function (media_id) {

        }
      },
      theme () {
        return (this.userInfo.phonenum !== this.info.content.from_id) ? this.leftTheme : this.rightTheme
      },
      containerStyles () {
        return (this.userInfo.phonenum !== this.info.content.from_id) ? {
          alignItems: 'flex-start'
        } : {
            alignItems: 'flex-end'
          }
      },
      nameStyles () {
        return (this.userInfo.phonenum !== this.info.content.from_id) ? {
          marginRight: '10px'
        } : {
            marginLeft: '10px'
          }
      },
      timeStyles () {
        return (this.userInfo.phonenum !== this.info.content.from_id) ? {
          marginLeft: '10px'
        } : {
            marginRight: '10px',
            display: 'flex',
            flexDirection: 'row-reverse'
          }
      },
      boxStyles () {
        return (this.userInfo.phonenum !== this.info.content.from_id) ? {
          marginLeft: '10px'
        } : {
            marginRight: '10px'
          }
      },
      arrowStyles () {
        return (this.userInfo.phonenum !== this.info.content.from_id) ? {
          left: '5px',
          transform: 'rotate(30deg)'
        } : {
            right: '2px',
            transform: 'rotate(-30deg)'
          }
      }
    },
    async mounted () {

    },
    methods: {
      ...mapActions([
        'moduleIM'
      ]),
      initImage () {
        const that = this
        let img = new Image()
        img.src = this.renderInfo.content.msg_body.imageUrl
        img.onload = function () {
          that.canvasSize.width = this.width
          that.canvasSize.height = this.height
          setTimeout(() => {
            let _canvas = that.$refs.canvasRef
            let _ctx = _canvas.getContext('2d')
            _ctx.clearRect(0, 0, that.canvasSize.width, that.canvasSize.height)
            _ctx.drawImage(this, 0, 0)
          })
        }
      },
      resetModalData () {
        this.decodeModal = {
          shown: false,
          data: {
            password: ''
          },
          loading: true
        }
      },
      decodeMessage (colors, hash) {
        // this will store the color values we've already read from
        var history = []

        // get the message size
        var messageSize = this.getNumberFromBits(colors, history, hash)

        // exit early if the message is too big for the image
        if ((messageSize + 1) * 16 > colors.length * 0.75) {
          this.resetModalData()
          return ''
        }

        // exit early if the message is above an artificial limit
        if (messageSize === 0 || messageSize > this.maxMessageSize) {
          this.resetModalData()
          return ''
        }

        // put each character into an array
        var message = []
        for (var i = 0; i < messageSize; i++) {
          var code = this.getNumberFromBits(colors, history, hash)
          message.push(String.fromCharCode(code))
        }
        this.resetModalData()
        // the characters should parse into valid JSON
        return message.join('')
      },
      getBit (number, location) {
        return (number >> location) & 1
      },
      setBit (number, location, bit) {
        return (number & ~(1 << location)) | (bit << location)
      },
      getNextLocation (history, hash, total) {
        var pos = history.length
        var loc = Math.abs(hash[pos % hash.length] * (pos + 1)) % total
        while (true) {
          if (loc >= total) {
            loc = 0
          } else if (history.indexOf(loc) >= 0) {
            loc++
          } else if ((loc + 1) % 4 === 0) {
            loc++
          } else {
            history.push(loc)
            return loc
          }
        }
      },
      getMessageBits (message) {
        var messageBits = []
        for (var i = 0; i < message.length; i++) {
          var code = message.charCodeAt(i)
          messageBits = messageBits.concat(this.getBitsFromNumber(code))
        }
        return messageBits
      },
      getBitsFromNumber (number) {
        var bits = []
        for (var i = 0; i < 16; i++) {
          bits.push(this.getBit(number, i))
        }
        return bits
      },
      getNumberFromBits (bytes, history, hash) {
        var number = 0,
          pos = 0
        while (pos < 16) {
          var loc = this.getNextLocation(history, hash, bytes.length)
          var bit = this.getBit(bytes[loc], 0)
          number = this.setBit(number, pos, bit)
          pos++
        }
        return number
      },
      decodeImage () {
        this.decodeModal.loading = false
        var password = this.decodeModal.data.password
        var passwordFail = '密码不正确或该图片无加密内容'

        // decode the message with the supplied password
        var ctx = this.$refs.canvasRef.getContext('2d')
        var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        var message = this.decodeMessage(
          imgData.data,
          sjcl.hash.sha256.hash(password)
        )

        // try to parse the JSON
        var obj = null
        try {
          obj = JSON.parse(message)
        } catch (e) {
          // display the "choose" view
          this.$nextTick(() => {
            this.decodeModal.loading = true
          })
          this.decodeModal.shown = true

          if (password.length > 0) {
            this.$Message.error(passwordFail)
            // this.resetModalData()
          }
        }
        // display the "reveal" view
        if (obj) {
          // decrypt if necessary
          if (obj.ct) {
            try {
              obj.text = sjcl.decrypt(password, message)
            } catch (e) {
              this.$nextTick(() => {
                this.decodeModal.loading = true
              })
              // this.resetModalData()
              this.$Message.error(passwordFail)
            }
          }

          // escape special characters
          var escChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '\n': '<br/>'
          }
          var escHtml = function (string) {
            return String(string).replace(/[&<>"'\/\n]/g, function (c) {
              return escChars[c]
            })
          }
          this.decodedMessage = escHtml(obj.text)
          this.resetModalData()
          this.$emit('alert', {
            username: (this.renderInfo.content ? (this.renderInfo.content.from_id || this.renderInfo.content.from_name) : ''),
            message: this.decodedMessage,
            time: this.renderInfo.ctime_ms
          })
        }
      },
      openDecodeModal () {
        this.decodeModal.shown = true
      },
      showContextMenu () {
        const menu = new Menu()
        if (this.renderInfo.content && this.renderInfo.content.msg_body && this.renderInfo.content.msg_body.extras && (this.renderInfo.content.msg_body.extras.type == 'steganography')) {
          menu.append(new MenuItem({
            label: '查看隐藏内容',
            // icon: path.resolve(__dirname, '../../../../assets/add.png'),
            click: async () => {
              this.openDecodeModal()
            }
          }))
        }

        menu.popup({ window: remote.getCurrentWindow() })
      },
      getResource (id) {
        return new Promise(async (resolve) => {
          let resourceResponse = await this.$store.dispatch('moduleIM/getResourceUrl', {
            id: id
          })
          if (resourceResponse.code === 0) {
            resolve(resourceResponse.url)
          } else {
            resolve('')
          }
        })
      },
      async formatInfo (val) {
        let info = JSON.parse(JSON.stringify(val))
        info.content.msg_body.imageUrl = await this.getResource(info.content.msg_body.media_id)
        this.renderInfo = info
        this.initImage()
      }
    },
    watch: {
      info: {
        deep: true,
        immediate: true,
        async handler (val) {
          await this.formatInfo(val)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .msg_text {
    position: relative;
    width: 260px;
    min-height: 34px;
    display: flex;
    flex-direction: column;
    &_time {
      max-width: 250px;
      height: 18px;
      font-size: 11px;
      line-height: 14px;
      color: #c8c8c8;
    }
    &_box {
      position: relative;
      // max-width: 250px;
      // max-height: 250px;
      border-radius: 4px;
      line-height: 1.5;
      padding: 3px;
      box-sizing: border-box;
      font-size: 13px;
      color: #555;
      -webkit-user-select: text;
      -webkit-app-region: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      img {
        max-width: 240px;
        max-height: 240px;
        cursor: pointer;
      }
      canvas {
        position: absolute;
      }
    }
    &_arrow {
      position: absolute;
      width: 10px;
      height: 10px;
      top: 25px;
      // background-color: red;
    }
  }

  .triangle {
    position: relative;
    // background-color: orange;
    text-align: left;
  }
  .triangle:before,
  .triangle:after {
    content: "";
    position: absolute;
    background-color: inherit;
  }
  .triangle,
  .triangle:before,
  .triangle:after {
    width: 5px;
    height: 5px;
    border-top-right-radius: 30%;
  }

  .triangle {
    transform: rotate(-60deg) skewX(-30deg) scale(1, 0.866);
  }
  .triangle:before {
    transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707)
      translate(0, -50%);
  }
  .triangle:after {
    transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
  }
</style>