<script>
import EditorBase from '@/editors/common/BaseEditor'
import RichTextEditor from '@ckeditor/ckeditor5-build-balloon'
import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the schema (read-only)
  name: 'CK5Editor',

  data () {
    return {
      editor: null,
    }
  },

  computed: {

    toolbar () {
      if (!this.config.TOOLBAR) {
        return [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'blockQuote',
          'undo',
          'redo',
        ]
      }

      return this.config.TOOLBAR
    },

    uploadProcess () {
      if (_.has(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)) {
        return _.get(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)
      }
      else {
        return null
      }
    },

  },

  methods: {

    initEditor () {
      RichTextEditor
        .create(this.$refs['textarea'], {
          // FIXME: CKEditor not working properly with Webpack 4
          // Whan this fixed make ckeritor5-firebase-uploader
          // plugins: [simpleupload],
          removePlugins: ['ImageCaption'],
          toolbar: this.toolbar,
        })
        .then(editor => {
          this.editor = editor
          editor.model.document.on('change', () => {
            this.content = editor.getData()
          })
        })
        .catch(error => {
          console.error(error)
        })
    },

    uploadImage (event) {
      let image = event.target.files[0]
      this.$refs['file-input'].value = ''
      if (!image) return false

      this.$store.dispatch('uploadImage', {
        projectId: this.projectId,
        path: this.$route.params.path,
        image: image,
        maxWidth: this.config.IMAGE_MAX_WIDTH,
        maxHeight: this.config.IMAGE_MAX_HEIGHT,
      })
        .then((image) => {
          const content = `<img src="${image.downloadURL}">`
          const viewFragment = this.editor.data.processor.toView(content)
          const modelFragment = this.editor.data.toModel(viewFragment)

          this.editor.model.insertContent(modelFragment, this.editor.model.document.selection)
        })
        .catch((error) => console.error('Image uploading faild!', error))
    },

  },

  mounted () {
    this.initEditor()
  },

}
</script>

<template>
<section class="editor -richtext">

  <div ref="textarea" v-html="content"/>

  <button class="button -small" @click="$refs['file-input'].click()">Upload image</button>

  <input
    class="file-input"
    type="file"
    ref="file-input"
    @change="uploadImage($event)"
    accept="image/png, image/jpeg, image/gif, image/svg+xml"
    v-show="false"
  >

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.editor.-richtext
  +gap(1em)

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

    +hx
      font-weight: 600

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
    ol,
    figure
      margin: 0

      + *
        margin-top: 1.5rem

    ul,
    ol
      padding-left: 1.5rem

      ul,
      ol
        margin-bottom: 0

    ul
      list-style-type: disc

    .image-style-side
      margin-left: 2rem

</style>
