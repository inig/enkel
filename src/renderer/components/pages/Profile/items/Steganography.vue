<template>
  <div class="custom_item"
       @click="clickHandler">
    <CustomItem :type="type"
                :icon="icon"
                :text="text"></CustomItem>

    <Modal v-model="encodeModal.shown"
           title="图片隐写术"
           @on-ok="confirmEncode"
           :loading="encodeModalLoading"
           :styles="{top: '20px'}">
      <Form :label-width="80">
        <FormItem label="图片">
          <div class="image_previewer">
            <input type="file"
                   class="image_previewer_input"
                   @change="changePreviewerImage">
            <canvas id="canvas"
                    :width="canvasSize.width"
                    :height="canvasSize.height"
                    :style="{opacity: previewerImageEncodedSrc ? 0 : 1}"></canvas>
            <div class="image_previewer_encode"
                 @click="downloadImage"
                 v-if="previewerImageEncodedSrc">
              <img :src="previewerImageEncodedSrc">
            </div>
          </div>
        </FormItem>
        <FormItem label="密文">
          <Input placeholder="密文"
                 v-model="encodeModal.data.message"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input placeholder="密码"
                 v-model="encodeModal.data.password"></Input>
        </FormItem>
      </Form>
      <Button @click="confirmEncode">加密</Button>
    </Modal>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import { Modal, Form, FormItem, Input } from 'view-design'
  import { createNamespacedHelpers } from 'vuex'
  const { mapActions } = createNamespacedHelpers('./store/modules')
  const sjcl = require('../../../../../../static/js/sjcl')
  export default {
    name: 'ProfileItemsSteganography',
    components: {
      Modal, Form, FormItem, Input,
      CustomItem: () => import('./index')
    },
    props: {
      info: {
        type: Object,
        default () {
          return {}
        }
      },
      type: {
        type: String,
        default: 'group'
      },
      icon: {
        type: String,
        default: 'survey'
      },
      text: {
        type: String,
        default: '调查'
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
        custom: {
          path: 'pray',
          type: 'survey',
          id: '',
          windowOption: {
            width: 375,
            height: 667,
            withoutHeader: false
          }
        },
        encodeModal: {
          shown: false,
          data: {
            message: '',
            password: ''
          }
        },
        encodeModalLoading: true,
        previewerImageSrc: '',
        previewerImageEncodedSrc: '',
        previewerImageFile: null,
        maxMessageSize: 1000,
        canvasSize: {
          width: 300,
          height: 300
        }
      }
    },
    methods: {
      ...mapActions([
        'moduleIM'
      ]),
      base64ToBlob (code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
      },
      downloadImage () {
        let aLink = document.createElement('a');
        let blob = this.base64ToBlob(this.previewerImageEncodedSrc); // new Blob([content]);
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', true, true);// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = 'down.png';
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      },
      getBit (number, location) {
        return (number >> location) & 1
      },
      setBit (number, location, bit) {
        return (number & ~(1 << location)) | (bit << location)
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
      encodeMessage (colors, hash, message) {
        // make an array of bits from the message
        var messageBits = this.getBitsFromNumber(message.length)
        messageBits = messageBits.concat(this.getMessageBits(message))

        // this will store the color values we've already modified
        var history = []

        // encode the bits into the pixels
        var pos = 0
        while (pos < messageBits.length) {
          // set the next color value to the next bit
          var loc = this.getNextLocation(history, hash, colors.length)
          colors[loc] = this.setBit(colors[loc], 0, messageBits[pos])

          // set the alpha value in this pixel to 255
          // we have to do this because browsers do premultiplied alpha
          // see for example: http://stackoverflow.com/q/4309364
          while ((loc + 1) % 4 !== 0) {
            loc++
          }
          colors[loc] = 255

          pos++
        }
      },
      async confirmEncode () {
        this.encodeModalLoading = false
        var message = this.encodeModal.data.message
        var password = this.encodeModal.data.password
        // var output = document.getElementById('output')
        var canvas = document.getElementById('canvas')
        var ctx = canvas.getContext('2d')

        // encrypt the message with supplied password if necessary
        if (password.length > 0) {
          message = sjcl.encrypt(password, message)
        } else {
          message = JSON.stringify({ text: message })
        }

        // exit early if the message is too big for the image
        var pixelCount = ctx.canvas.width * ctx.canvas.height
        if ((message.length + 1) * 16 > pixelCount * 4 * 0.75) {
          this.$Message.info('加密内容太复杂')
          // this.resetModalData()
          this.$nextTick(() => {
            this.encodeModalLoading = true
          })
          return
        }

        // exit early if the message is above an artificial limit
        if (message.length > this.maxMessageSize) {
          this.$Message.info('加密内容字数大多')
          // this.resetModalData()
          this.$nextTick(() => {
            this.encodeModalLoading = true
          })
          return
        }

        // encode the encrypted message with the supplied password
        var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.encodeMessage(imgData.data, sjcl.hash.sha256.hash(password), message)
        ctx.putImageData(imgData, 0, 0)

        // view the new image
        this.$Message.success('加密完成，右键可存储图片')
        this.previewerImageEncodedSrc = canvas.toDataURL()

        this.previewerImageFile = this.dataURLtoFile(this.previewerImageEncodedSrc, 'steganography.png')

        let response = await this.$store.dispatch('moduleIM/sendGroupPic', {
          image: this.$createFileFormData(this.previewerImageFile),
          target_gid: this.info.gid,
          extras: {
            type: 'steganography'
          }
        })
        if (response.data && (response.data.code == 0)) {
          this.$emit('change', { msg: response.msg })
        }
        console.log('$c【发送图片】', 'color: red; font-size: 18px;', response)
        this.resetModalData()
      },
      resetModalData () {
        this.encodeModal = {
          shown: false,
          data: {
            message: '',
            password: ''
          }
        }
      },
      dataURLtoFile (dataurl, filename) {//将base64转换为文件
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      },
      initImage (data) {
        this.canvasSize.width = data.width
        this.canvasSize.height = data.height
        setTimeout(() => {
          let _canvas = document.getElementById('canvas')
          let _ctx = _canvas.getContext('2d')
          _ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
          _ctx.drawImage(data.img, 0, 0)
        })
      },
      changePreviewerImage (evt) {
        const that = this
        let file = evt.target.files[0]
        if (file) {
          this.previewerImageEncodedSrc = ''
          let reader = new FileReader()
          reader.onload = function () {
            // that.previewerImageFile = that.dataURLtoFile(this.result, 'steganography.png')
            that.previewerImageSrc = this.result

            let img = new Image()
            img.src = this.result
            img.onload = function () {
              that.initImage({
                img: this,
                width: this.width,
                height: this.height
              })
            }
          }
          reader.readAsDataURL(file)
        }
      },
      openEncodeModal () {
        this.encodeModal.shown = true
      },
      closeEncodeModal () {
        this.encodeModal.shown = false
      },
      clickHandler () {
        this.openEncodeModal()
      },
      createSurvey () {
        this.custom.id = this.getUUID('survey')
        let userInfo = Object.assign({}, this.userInfo, {
          password: null
        })
        this.$emit('click', Object.assign({}, this.custom, this.encodeModal.data, {
          userInfo: userInfo
        }))
      }
    }
  }
</script>

<style lang="less" scoped>
  .custom_item {
    width: 25%;
    height: 70px;
    margin: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .image_previewer {
    position: relative;
    width: 160px;
    height: 160px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &_input {
      position: absolute;
      left: 0;
      top: 0;
      width: 160px;
      height: 160px;
      outline: none;
    }
    canvas {
      // position: absolute;
      max-width: 100%;
      max-height: 100%;
      pointer-events: none;
      // opacity: 0;
    }
    &_encode {
      position: absolute;
      left: 0;
      top: 0;
      width: 160px;
      height: 160px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      img {
        max-width: 160px;
        max-height: 160px;
      }
    }
  }
</style>