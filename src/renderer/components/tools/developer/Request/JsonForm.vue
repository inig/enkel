<template>
  <div class="json_form">
    <transition name="fade">
      <div class="json_form_url"
           v-if="url">
        <div class="json_form_url_inner">{{url}}</div>
        <copy style="position: absolute; right: 20px; top: 5px;"
              :data="url"
              bg-color="rgb(40, 41, 38)"></copy>
      </div>
    </transition>
    <div class="json_form_item"
         v-for="(item, index) in params"
         :key="index"
         @mouseenter="hoverInItem"
         @mouseleave="hoverOutItem">
      <div class="json_form_item_select">
        <Checkbox size="small"
                  v-model="item.status"
                  @on-change="disableParamItem"></Checkbox>
      </div>

      <div class="json_form_item_key">
        <Input placeholder="key"
               v-model="item.key"
               ref="jsonKeyInputRef"
               @on-keydown="noEmptyInput" />
      </div>

      <div class="json_form_item_value"
           :class="{'modified': baseParamsPriority === 1}">
        <Input placeholder="value"
               v-model="item.value"
               @on-keydown="noEmptyInput" />
        <transition name="fade">
          <div class="modified_value"
               v-if="baseParamsPriority === 1">123</div>
        </transition>
      </div>

      <div class="json_form_item_delete"
           @click="deleteItem(index)">
        <Icon type="md-close"
              size="20"
              color="#ed4014" />
      </div>
    </div>
    <div class="json_form_item">
      <div class="json_form_item_select">
      </div>

      <div class="json_form_item_key"
           @click="addNewItem">
        <Input placeholder="New key"
               readonly />
      </div>

      <div class="json_form_item_value"
           @click="addNewItem">
        <Input placeholder="New value"
               readonly />
      </div>

      <div class="json_form_item_delete">
      </div>
    </div>
  </div>
</template>

<script>
  import { Checkbox, Icon, Input } from 'view-design'
  import Copy from '../../../custom/Copy'
  export default {
    name: 'JsonForm',
    components: {
      Checkbox, Icon, Input,
      Copy
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      },
      currentRequest: {
        type: Object,
        default () {
          return {}
        }
      },
      url: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        params: []
      }
    },
    computed: {
      store () {
        return this.$store
      },
      baseParamsPriority () {
        return this.store.state.baseParamsPriority
      }
    },
    created () {
      // this.params = this.value
    },
    methods: {
      hoverInItem (e) {
        if (!e.target.classList.contains('active')) {
          e.target.classList.add('active')
        }
      },
      hoverOutItem (e) {
        if (e.target.classList.contains('active')) {
          e.target.classList.remove('active')
        }
      },
      addNewItem () {
        this.params.push({
          key: '',
          value: '',
          status: true
        })
        setTimeout(() => {
          let el = this.$refs.jsonKeyInputRef[this.params.length - 1]
          el.focus()
        }, 50)
      },
      deleteItem (index) {
        this.params.splice(Number(index), 1)
      },
      disableParamItem () {
        this.$emit('change', this.params)
      },
      noEmptyInput (evt) {
        if ([13, 32].indexOf(evt.keyCode) > -1) {
          evt.preventDefault()
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          this.params = val
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .json_form {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 128px;
    box-sizing: border-box;
    .json_form_url {
      position: sticky;
      left: 0;
      top: 0;
      z-index: 2;
      background-color: rgb(40, 41, 38);
      width: 100%;
      // height: 64px;
      padding: 0 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .json_form_url_inner {
        width: 100%;
        height: 100%;
        max-height: 150px;
        overflow-y: auto;
        padding: 6px;
        box-sizing: border-box;
        word-break: break-all;
        font-size: 12px;
        color: rgb(168, 168, 168);
        border: 1px solid rgb(61, 61, 59);
        background-color: rgb(46, 47, 44);
      }
    }
    .json_form_item {
      width: 100%;
      height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .json_form_item_select {
        width: 30px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
      }
      .json_form_item_key {
        width: calc(40% - 35px);
      }
      .json_form_item_value {
        position: relative;
        width: calc(60% - 35px);
        margin-left: 10px;
        .modified_value {
          position: absolute;
          left: 8px;
          top: 24px;
          width: 100%;
          height: 20px;
          color: rgb(94, 160, 33);
        }
      }
      .json_form_item_delete {
        width: 30px;
        height: 36px;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      &.active {
        .json_form_item_delete {
          opacity: 1;
        }
      }
    }
  }
</style>