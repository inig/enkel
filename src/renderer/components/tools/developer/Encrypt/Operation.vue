<template>
  <div class="operation">
    <label class="operation_label">密码:</label>
    <Input type="text"
           class="operation_key"
           placeholder="密码"
           v-model="key" />
    <label class="operation_label"
           v-if="showIv">偏移量:</label>
    <Input type="text"
           class="operation_key"
           placeholder="iv偏移量"
           v-if="showIv"
           v-model="iv" />
    <label class="operation_label"
           v-if="showType">加密模式:</label>
    <Select v-model="currentEncryptionType"
            style="width:80px"
            v-if="showType">
      <Option v-for="item in encryptionTypes"
              :value="item"
              :key="item">{{ item }}</Option>
    </Select>
    <label class="operation_label"
           v-if="showPadding">填充:</label>
    <Select v-model="currentEncryptionPadding"
            v-if="showPadding"
            style="width:120px">
      <Option v-for="item in encryptionPaddings"
              :value="item"
              :key="item">{{ item }}</Option>
    </Select>
    <label class="operation_label"
           v-if="showOutput">输出:</label>
    <Select v-model="currentOutputType"
            v-if="showOutput"
            style="width:90px">
      <Option v-for="item in outputTypes"
              :value="item"
              :key="item">{{ item }}</Option>
    </Select>
    <Button class="operation_btn"
            type="primary"
            @click="encryptHandler">加密</Button>
    <Button class="operation_btn"
            type="primary"
            @click="decryptHandler">解密</Button>
    <!-- <Button class="operation_btn"
            @click="resetHandler">清空</Button> -->
  </div>
</template>

<script>
import { Input, Button, Select, Option } from "view-design"
export default {
  name: 'Operation',
  components: {
    Input, Button, Select, Option
  },
  props: {
    currentEncrypt: {
      type: String,
      default: 'AES'
    }
  },
  data () {
    return {
      key: '', // 密码
      iv: '', // iv偏移量
      encryptionTypes: ['ECB', 'CBC', 'CFB', 'CTR', 'OFB'],
      currentEncryptionType: 'ECB',
      encryptionPaddings: ['ZeroPadding', 'Pkcs7', 'Iso97971', 'AnsiX923', 'Iso10126', 'NoPadding'],
      currentEncryptionPadding: 'ZeroPadding',
      outputTypes: ['Base64', 'Hex'],
      currentOutputType: 'Base64',
      config: {
        iv: ['AES', 'DES'],
        type: ['AES', 'DES'],
        padding: ['AES', 'DES'],
        output: ['AES', 'DES']
      }
    }
  },
  computed: {
    showIv () {
      return this.config.iv.indexOf(this.currentEncrypt) > -1
    },
    showType () {
      return this.config.type.indexOf(this.currentEncrypt) > -1
    },
    showPadding () {
      return this.config.padding.indexOf(this.currentEncrypt) > -1
    },
    showOutput () {
      return this.config.output.indexOf(this.currentEncrypt) > -1
    }
  },
  methods: {
    encryptHandler () {
      this.$emit('encryptHandler', {
        key: this.key,
        iv: this.iv,
        outputType: this.currentOutputType,
        paddingType: this.currentEncryptionPadding,
        encryptionType: this.currentEncryptionType
      })
    },
    decryptHandler () {
      this.$emit('decryptHandler', {
        key: this.key,
        iv: this.iv,
        outputType: this.currentOutputType,
        paddingType: this.currentEncryptionPadding,
        encryptionType: this.currentEncryptionType
      })
    },
    resetHandler () {
      this.$emit('resetHandler')
    },
  }
}
</script>

<style lang="less" scoped>
.operation {
  &_key {
    width: 200px;
    display: inline-block;
    margin: 0 10px;
  }
}
</style>