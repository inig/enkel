<template>
  <div class="request_body json_editor"
       :class="[theme]">
    <div class="request_json_editor custom_json_editor"
         :ref="ref">

    </div>
    <div class="json_format"
         @click="prettyJson">
      <Tooltip content="美化"
               placement="top"
               transfer>
        <svg>
          <use xlink:href="#braces"></use>
        </svg>
      </Tooltip>
    </div>
  </div>
</template>

<script>
import { Tooltip } from 'view-design'
import JSONEditor from 'jsoneditor'
import { ipcRenderer } from 'electron'
require('jsoneditor/dist/jsoneditor.css')
export default {
  name: 'RequestBody',
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {
    Tooltip
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    theme: {
      type: String,
      default: 'dark' // dark; light
    }
  },
  data () {
    return {
      jsonEditor: null,
      jsonStr: {},
      ref: 'requestJsonEditorRef',
      changed: false
    }
  },
  created () {
    this.changed = false
    this.ref = this.getUUID('json-editor-ref-')
  },
  mounted () {
    ipcRenderer.on('request-modified', this.requestModified)
  },
  methods: {
    requestModified (event, request) {
      this.changed = false
    },
    initJsonEditor () {
      if (this.changed) {
        return
      }
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.jsonEditor) {
            this.jsonEditor.destroy()
          }
          this.jsonEditor = new JSONEditor(this.$refs[this.ref], {
            mode: 'code',
            mainMenuBar: false,
            language: 'zh-CN',
            onChangeText: this.changeText
          }, this.jsonStr || {})
        }, 150)
      })
    },
    setJson (json) {
      if (this.jsonEditor) {
        this.jsonEditor.set(this.jsonEditorOptions)
      }
    },
    changeText (json) {
      this.changed = true
      let isLegal = this.validate(json)
      if (isLegal) {
        this.$emit('change', JSON.parse(json || '{}'))
      }
    },
    validate (json) {
      let f = true
      try {
        JSON.parse(json)
        f = true
      } catch (err) {
        f = false
      }
      return f
    },
    prettyJson () {
      if (this.jsonEditor) {
        this.jsonEditor.setText(JSON.stringify(this.jsonEditor.get(), null, 2))
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.jsonStr = val
        this.initJsonEditor()
      }
    }
  }
}
</script>

<style lang="less">
@import url("../../../../../../static/css/json-editor.less");
.request_body {
  position: relative;
  width: 100%;
  height: calc(~"100% - 45px");
  // padding-bottom: 16px;
  box-sizing: border-box;
  .request_json_editor {
    width: 100%;
    height: 100%;
  }
  .json_format {
    position: absolute;
    right: 8px;
    bottom: 0;
    width: 26px;
    height: 26px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      width: 15px;
      height: 15px;
      fill: #aaa;
    }
    &:hover {
      svg {
        fill: #ddd !important;
      }
    }
  }
  &.dar2k {
    .jsoneditor {
      border: none !important;
    }
    .ace-jsoneditor .ace_gutter {
      background: #272727;
    }
    .ace-jsoneditor .ace_scroller {
      background-color: #222 !important;
    }
    .jsoneditor-statusbar {
      background-color: #222 !important;
      border-top: 1px solid #000 !important;
      padding: 0 5px !important;
    }
    .ace-jsoneditor .ace_constant.ace_other,
    .ace-jsoneditor .ace_cursor {
      border-color: #ccc !important;
    }

    .jsoneditor-statusbar > .jsoneditor-parse-error-icon {
      margin-right: 30px !important;
    }
  }
  &.ligh2t {
    .jsoneditor {
      border: none !important;
    }
    .ace-jsoneditor .ace_gutter {
      background: #f5f5f5;
    }
    .ace-jsoneditor .ace_scroller {
      background-color: #fff !important;
    }
    .jsoneditor-statusbar {
      background-color: #f5f5f5 !important;
      border-top: 1px solid #fff !important;
      padding: 0 5px !important;
    }
    .ace-jsoneditor .ace_constant.ace_other,
    .ace-jsoneditor .ace_cursor {
      border-color: #888 !important;
    }
    .jsoneditor-statusbar > .jsoneditor-parse-error-icon {
      margin-right: 30px !important;
    }
    .ace-jsoneditor .ace_marker-layer .ace_active-line {
      background: #eee;
    }
    .ace-jsoneditor .ace_gutter-active-line {
      background-color: #eee;
    }
    .ace-jsoneditor .ace_marker-layer .ace_selection {
      background: #ddd !important;
    }
    .ace-jsoneditor .ace_indent-guide {
      opacity: 0.2;
    }
    .ace-jsoneditor .ace_marker-layer .ace_bracket {
      border: 1px solid #aaa !important;
    }
    .ace-jsoneditor .ace_marker-layer .ace_selected-word {
      border: none;
      border-radius: 0;
    }
  }
}
</style>