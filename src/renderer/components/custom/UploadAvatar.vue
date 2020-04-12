<template>
  <div class="upload-plugin-container"
       :style="{height: height + 'px' || '300px', width: width + 'px' || '100%'}">
    <Upload type="drag"
            :action="'https://talkapi.dei2.com/enkel/user/uploadAvatar?phonenum=' + loginInfo.phonenum + '&token=' + loginInfo.token + '&ms=' + formData.maxSize + '&accept=' + formData.format.join(';') + '&rn=true'"
            :max-size="formData.maxSize"
            :format="formData.format"
            :on-exceeded-size="handleMaxSize"
            :on-format-error="handleFormatError"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadFail"
            :style="{height: height + 'px' || '300px', width: width + 'px' || '100%'}">
      <div class="upload-plugin-area"
           :style="{height: height + 'px' || '300px', width: width + 'px' || '100%'}">
        <slot></slot>
        <div class="edit-mask"
             :style="{height: height + 'px' || '300px', width: width + 'px' || '100%'}">
          <Icon type="ios-cloud-upload"
                :size="(width * 0.3 >= 14 && width * 0.3 <= 30) ? width * 0.3 : (width * 0.3 < 14 ? 14 : 30)"></Icon>
        </div>
      </div>
    </Upload>
  </div>
</template>
<style>
.ml10 {
  margin-left: 10px;
}
.upload-plugin-container {
  width: 100%;
  height: 100%;
  border: none;
}
.upload-plugin-area {
  width: 100%;
  height: 300px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  position: relative;
}
.upload-plugin-container .ivu-upload-drag {
  border: none;
  border-radius: 0;
  background-color: transparent;
}
.upload-plugin-container .ivu-upload-drag .edit-mask {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.upload-plugin-container .ivu-upload-drag:hover {
  border: none;
}
.upload-plugin-container .ivu-upload-drag:hover .edit-mask {
  opacity: 1;
}
.edit-mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  text-shadow: none;
  color: #fff;
}
</style>
<script>
// import utils from '../../utils/index'
import { Upload, Icon } from 'view-design'
import { ipcRenderer } from 'electron'
require('../../assets/js/jmessage-sdk-web.2.6.0.min.js')
export default {
  name: 'UploadPlugin',
  props: ['width', 'height', 'loginInfo'],
  components: {
    Upload, Icon
  },
  data () {
    return {
      formData: {
        maxSize: 2 * 1024,
        format: ['jpg', 'png', 'jpeg', 'gif']
      },
      currentPlugin: '',
      currentFileName: '',
      cachedFile: null,
      IM: null
    }
  },
  computed: {
    // loginInfo () {
    //   return this.$store.state.loginInfo
    // }
  },
  mounted () {
    // this.loginInfo = this.$initLoginInfo()
    this.IM = new JMessage({
      debug: true
    })
    let imConfig = ipcRenderer.sendSync('im-get-config')
    this.IM.init(imConfig).onSuccess(data => {
      this.IM.login({
        username: this.loginInfo.phonenum,
        password: '123123'
      }).onSuccess(d => { })
    })
  },
  methods: {
    beforeUpload (file) {
      this.cachedFile = file
      return true
    },
    uploadSuccess (event, file, fileList) {
      let fd = this.$createFileFormData(this.cachedFile)
      console.log('=========', fd)
      // ipcRenderer.send('im-update-self-avatar', {
      //   file: fd
      // })
      this.IM.updateSelfAvatar({
        avatar: fd
      }).onSuccess(data => {
        console.log('上传成功: ', data)
      }).onFail(data => {
        console.log('上传失败：', data)
      })
      this.$emit('success', {
        filename: file.name,
        path: event.data.path
      })
    },
    uploadFail (event, file, fileList) {
      this.$Notice.error({
        title: '文件上传失败',
        desc: file.name + '上传失败：' + event.message
      })
      this.$emit('fail', {
        filename: file.name,
        message: event.message
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件太大了',
        desc: '文件' + file.name + '太大，请不要超过' + (this.formData.maxSize / 1024) + 'M'
      })
      this.$emit('fail', {
        filename: file.name,
        message: '文件不能超过' + (this.formData.maxSize / 1024) + 'M'
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: file.name + '格式不正确，请上传' + (this.formData.format.join(';')) + '格式的文件'
      })
      this.$emit('fail', {
        filename: file.name,
        message: '请上传' + (this.formData.format.join(';')) + '格式的文件'
      })
    }
  }
}
</script>
