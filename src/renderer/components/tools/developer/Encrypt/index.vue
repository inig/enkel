<template>
  <div class="encrypt">
    <Tabs class="encrypt_kindness"
          type="card"
          v-model="encryptValue">
      <TabPane v-for="item in encryptData"
               :key="item"
               :label="item"
               :name="item"
               class="encrypt_mian" />
    </Tabs>
    <encrypt-content class="encrypt_content"
                     :targetStr="targetStr"
                     v-model="originStr"></encrypt-content>
    <operation class="encrypt_operation"
               :currentEncrypt="encryptValue"
               @decryptHandler="decryptHandler"
               @encryptHandler="encryptHandler"></operation>
  </div>
</template>

<script>
import { Tabs, TabPane } from 'view-design'
import EncryptContent from "./EncryptContent"
import Operation from "./Operation"
import CryptoJS from "crypto-js"

export default {
  name: 'Encrypt',
  components: {
    Tabs, TabPane, EncryptContent, Operation
  },
  data () {
    return {
      originStr: '', // 原始值
      targetStr: '', // 加密或解密后的值
      encryptValue: 'AES',
      encryptData: ['AES', 'DES', 'TripleDES', 'Rabbit', 'RC4', 'RC4Drop']
    }
  },
  methods: {
    decryptHandler (data) {
      if (!this.originStr) { return }
      try {
        const key = CryptoJS.enc.Utf8.parse(data.key)
        const iv = CryptoJS.enc.Utf8.parse(data.iv)
        let encryptedStr = CryptoJS.enc[data.outputType].parse(this.originStr);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedStr);
        let decrypt = CryptoJS[this.encryptValue].decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode[data.encryptionType], padding: CryptoJS.pad[data.paddingType] });
        this.targetStr = decrypt.toString(CryptoJS.enc.Utf8).toString().replace(/\f/g, '')
      } catch (err) {
        this.targetStr = '解密失败'
      }
      return this.targetStr;
    },
    encryptHandler (data) {
      if (!this.originStr) { return }
      // 加密
      try {
        const key = CryptoJS.enc.Utf8.parse(data.key)
        const iv = CryptoJS.enc.Utf8.parse(data.iv)
        let srcs = CryptoJS.enc.Utf8.parse(this.originStr);
        let encrypted = CryptoJS[this.encryptValue].encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode[data.encryptionType], padding: CryptoJS.pad[data.paddingType] });
        this.targetStr = encrypted.ciphertext.toString(CryptoJS.enc[data.outputType])
      } catch (err) {
        this.targetStr = '加密失败'
      }
      return this.targetStr
    }
  }
}
</script>

<style lang="less" scoped>
.encrypt {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;
  &_kindness {
    width: 100%;
    // height: 10%;
  }
  &_content {
    width: 100%;
    // height: 75%;
    height: calc(100% - 120px);
  }
  &_operation {
    width: 100%;
    height: 10%;
    margin-top: 20px;
  }
}
</style>