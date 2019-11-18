<template>
  <div class="json_form">
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
               @on-keydown="noEmptyInput" />
      </div>

      <div class="json_form_item_value">
        <Input placeholder="value"
               v-model="item.value"
               @on-keydown="noEmptyInput" />
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
  export default {
    name: 'JsonForm',
    components: {
      Checkbox, Icon, Input
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
      }
    },
    data () {
      return {
        params: []
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
        width: calc(60% - 35px);
        margin-left: 10px;
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