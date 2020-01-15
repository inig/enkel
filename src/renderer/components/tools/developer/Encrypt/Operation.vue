<template>
  <div class="operation">
    <label class="operation_label">密码:</label>
    <Input type="text"
           class="operation_key"
           v-model="keyValue" />
    <Button class="operation_btn"
            type="primary"
            @click="encryptHandler">加密</Button>
    <Button class="operation_btn"
            type="primary"
            @click="decryptHandler">解密</Button>
    <Button class="operation_btn"
            @click="resetHandler">清空</Button>
  </div>
</template>

<script>
import { Input, Button } from "view-design"
export default {
  name: 'Operation',
  components: {
    Input, Button
  },
  props: {
    secretKey: {
      type: String,
      default: ''
    }
  },
  computed: {
    keyValue: {
      get () { return this.secretKey },
      set (val) {
        this.$emit('setSecretKey', val)
      }
    }
  },
  methods: {
    encryptHandler () {
      this.$emit('encryptHandler')
    },
    decryptHandler () {
      this.$emit('decryptHandler')
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