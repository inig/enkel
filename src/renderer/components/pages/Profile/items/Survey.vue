<template>
  <div class="custom_item"
       @click="clickHandler">
    <CustomItem :type="type"
                :icon="icon"
                :text="text"></CustomItem>

    <Modal v-model="surveyModal.shown"
           title="调查"
           @on-ok="createSurvey">
      <Form :label-width="80">
        <FormItem label="调查名称">
          <Input placeholder="调查名称"
                 v-model="surveyModal.data.name"></Input>
        </FormItem>
        <FormItem label="调查描述">
          <Input placeholder="调查描述"
                 v-model="surveyModal.data.desc"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Modal, Form, FormItem, Input } from 'view-design'
import { SurveyStore, setItem } from '../../../../utils'
export default {
  name: 'ProfileItemsSurvey',
  components: {
    Modal, Form, FormItem, Input,
    CustomItem: () => import('./index')
  },
  props: {
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
      surveyModal: {
        shown: false,
        data: {
          name: '',
          desc: ''
        }
      }
    }
  },
  methods: {
    openSurveyModal () {
      this.surveyModal.shown = true
    },
    closeSurveyModal () {
      this.surveyModal.shown = false
    },
    clickHandler () {
      this.openSurveyModal()
    },
    createSurvey () {
      this.custom.id = this.getUUID('survey')
      let userInfo = Object.assign({}, this.userInfo, {
        password: null
      })
      this.$emit('click', Object.assign({}, this.custom, this.surveyModal.data, {
        userInfo: userInfo
      }))
      setItem({
        key: this.custom.id,
        data: [],
        store: SurveyStore
      })
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
</style>