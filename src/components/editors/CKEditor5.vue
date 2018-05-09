<script>
import _ from 'lodash'
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon'

export default {
  name: 'CKEditor5',

  props: {
    editorData: Object,
    saveFunction: Function
  },

  data () {
    return {
      content: this.editorData.content,
      editor: null
    }
  },

  watch: {

    'editorData.content' (value) {
      this.content = value
    },

    content: _.debounce(function () {
      this.saveFunction(this.editorData, this.content)
    }, 500)

  },

  methods: {

    initEditor () {
      BalloonEditor
        .create(this.$refs['textarea'], {
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'undo',
            'redo'
          ]
        })
        .then(editor => {
          editor.model.document.on('change', () => {
            this.content = editor.getData()
          })
        })
        .catch(error => {
          console.error(error)
        })
    }

  },

  mounted () {
    this.initEditor()
  }

}
</script>

<template>
<section class="editor -ckeditor">

  <div ref="textarea" v-html="content"/>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/features'

.editor.-ckeditor /deep/

  .ck-content
    min-height: 10rem
    padding: $input-padding
    border-radius: $input-border-radius

    &.ck-blurred
      border: $input-border--basic
      background-color: $input-background--basic

      &:hover
        border: $input-border--hover
        background-color: $input-background--hover

    &.ck-focused
      border: $input-border--focus
      background-color: $input-background--focus
      box-shadow: none

    +hx
      font-weight: 600

    h2
      font-size: 1.5em

    h3
      font-size: 1.3em

    h4
      font-size: 1.1em

    p,
    h2,
    h3,
    h4,
    ul,
    ol
      margin-top: 0
      margin-bottom: 1em

    ul,
    ol
      padding-left: 1.5em

      ul,
      ol
        margin-bottom: 0

    ul
      list-style-type: disc

</style>
