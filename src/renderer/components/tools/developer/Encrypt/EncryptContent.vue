<template>
  <div class="encrypt_container">
    <e-split v-model="split">
      <Input slot="left"
             class="encrypt_text encrypt_container_left"
             type="textarea"
             placeholder="明文"
             v-model="plaintextValue" />
      <Input slot="right"
             class="encrypt_text encrypt_container_right"
             type="textarea"
             placeholder="密文"
             v-model="ciphertextValue" />
    </e-split>
  </div>
</template>

<script>
import { Input } from "view-design"
export default {
  name: 'EncryptContent',
  props: {
    plaintext: {
      type: String,
      default: ''
    },
    ciphertext: {
      type: String,
      default: ''
    },
  },
  components: {
    Input,
    ESplit: () => import('../../../custom/ESplit')
  },
  data () {
    return {
      split: 0.5,
    }
  },
  computed: {
    plaintextValue: {
      get () {
        return this.plaintext
      },
      set (val) {
        this.$emit('setPlaintext', val)
      },
    },
    ciphertextValue: {
      get () {
        return this.ciphertext
      },
      set (val) {
        this.$emit('setCiphertext', val)
      },
    },
  }
}
</script>
<style lang="less" scoped>
.encrypt_container {
  width: 100%;
  height: 100%;

  .encrypt_text {
    width: 100%;
    height: 100%;
    background: #fff;
  }

  &_left {
    padding-right: 15px;
  }

  &_right {
    padding-left: 15px;
  }
}
</style>
<style lang="less">
.encrypt_container .encrypt_text textarea.ivu-input {
  height: 100%;
  transition: none;
  &:hover {
    border-color: #dcdee2;
  }
  &:focus {
    border-color: #dcdee2;
    box-shadow: none;
  }
}
</style>