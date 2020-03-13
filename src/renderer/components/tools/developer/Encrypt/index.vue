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
                     :plaintext="plaintext"
                     :ciphertext="ciphertext"
                     @setPlaintext="setPlaintext"
                     @setCiphertext="setCiphertext"></encrypt-content>
    <operation class="encrypt_operation"
               :secretKey="secretKey"
               @setSecretKey="setSecretKey"
               @resetHandler="resetHandler"
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
      plaintext: '',
      ciphertext: '',
      secretKey: '',
      encryptValue: 'AES',
      encryptData: ['AES', 'DES', 'TripleDES', 'Rabbit', 'RC4', 'RC4Drop']
    }
  },
  methods: {
    setPlaintext (data) { this.plaintext = data },
    setCiphertext (data) { this.ciphertext = data },
    decryptHandler () {
      if (!this.ciphertext) { return }
      // 解密
      try {
        this.plaintext = CryptoJS[this.encryptValue].decrypt(this.ciphertext, this.secretKey).toString(CryptoJS.enc.Utf8)
      } catch (error) {
        this.plaintext = ''
      }
    },
    encryptHandler () {
      if (!this.plaintext) { return }
      // 加密
      try {
        this.ciphertext = CryptoJS[this.encryptValue].encrypt(this.plaintext, this.secretKey).toString()
      } catch (error) {
        this.ciphertext = ''
      }
    },
    resetHandler () {
      this.plaintext = ''
      this.ciphertext = ''
      this.secretKey = ''
    },
    setSecretKey (data) {
      this.secretKey = data
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
    height: 10%;
  }
  &_content {
    width: 100%;
    height: 75%;
  }
  &_operation {
    width: 100%;
    height: 10%;
    margin-top: 20px;
  }
}
</style>