<script>
import _ from 'lodash'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import autosize from 'autosize'

export default {
  name: 'RichtextEditor',

  props: {
    editorData: Object,
    saveFunction: Function
  },

  data () {
    return {
      content: this.editorData.content,
      editor: null,
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

  methods: {

    // getData () {
    //   console.log('this.editor.getData()', this.editor.getData())
    // },

  },

  mounted () {
    this.$refs['textarea'].focus()
    // autosize(this.$refs['textarea'])

    ClassicEditor
      .create(this.$refs['textarea'], {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'],
      })
      .then(editor => {
        // console.log(editor)
        // this.editor = editor

        editor.model.document.on('change', () => {
          this.content = editor.getData()
          // console.log('The Document has changed!', editor.getData())
        })

        // editor.document.on('changesDone', (evt, data) => {
        //   // this.updateValue(editor.getData())
        //   console.log('changeDone')
        // })

        // console.log('this.editor.getData()', this.editor.getData())

        // editor.model.on('change', () => {
        //   console.log('change')
        // })

        // editor.on('change', () => {
        //   console.log('The Document has changed!')
        // })

      })
      .catch(error => {
        console.error(error)
      })
  }

}
</script>

<template>
<section class="editor -richtext">

  <textarea class="textarea" ref="textarea" rows="8" cols="80" :value="content" v-on:input="getData()"/>

  <!-- <button @click="getData()">getData</button> -->

  <!-- <div id="elementId">
    Foobar
  </div> -->

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/features'

.textarea
  resize: none
  overflow: hidden

.editor.-richtext /deep/

  button
    box-shadow: none

    &:hover
      color: $color-content

  .ck-editor__top
    position: sticky
    top: -2px
    border-bottom: 1px solid #c4c4c4

  .ck-editor__main .ck-content
    border-top-width: 0
    min-height: 10rem

    h1
      font-size: 1.6em

    h2
      font-size: 1.4em

    h3
      font-size: 1.2em

</style>
