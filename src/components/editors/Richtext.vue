<script>
import _ from 'lodash'
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon'

export default {
  name: 'RichtextEditor',

  props: {
    editorData: Object,
    saveFunction: Function
  },

  data () {
    return {
      content: this.editorData.content,
      stickyToolbar: false,
    }
  },

  watch: {

    'editorData.content' (value) {
      this.content = value
      this.$refs['textarea'].focus()
    },

    content: _.debounce(function () {
      this.saveFunction(this.editorData, this.content)
    }, 500)

  },

  mounted () {
    this.$refs['textarea'].focus()

    BalloonEditor
      .create(this.$refs['textarea'], {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'],
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

}
</script>

<template>
<section class="editor -richtext" :class="{ '-sticky-toolbar': stickyToolbar }">

  <div ref="textarea" v-html="content"/>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/features'

// .editor.-richtext
//   margin-bottom: -2.35rem

.editor.-richtext /deep/

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

    h2
      font-size: 1.6em

    h3
      font-size: 1.4em

    h4
      font-size: 1.2em

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

// .editor.-richtext.-sticky-toolbar /deep/


</style>
