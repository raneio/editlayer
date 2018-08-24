<script>
/**
 * Markdown Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.DOWNSCALE
 */

import EditorBase from '@/editors/common/BaseEditor'
import { codemirror } from 'vue-codemirror'
import _ from 'lodash'
import titleCase from 'title-case'

export default {
  extends: EditorBase,

  name: 'MarkdownEditor',

  components: {
    codemirror,
  },

  data () {
    return {
      addButton: {
        top: null,
        line: null,
      },
      options: {
        tabSize: 2,
        lineNumbers: false,
        lineWrapping: true,
        autofocus: true,
        mode: 'text/x-markdown',
      },
      focus: false,
    }
  },

  computed: {

    projectId () {
      return this.$route.params.projectId
    },

    codemirror () {
      return this.$refs.codemirror.codemirror
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

    uploadImage (event) {
      let image = event.target.files[0]
      this.$refs.fileInput.value = ''
      if (!image) return false

      this.$store.dispatch('uploadImage', {
        projectId: this.projectId,
        path: this.$route.params.path,
        image: image,
        downscale: this.config.DOWNSCALE,
      })
        .then((image) => {
          let doc = this.codemirror.doc
          let altText = titleCase(image.filename)
          let imageTag = `![${altText}](${image.downloadURL})`
          doc.replaceRange(imageTag, doc.getCursor())
        })
        .catch((error) => console.error('Image uploading faild!', error))
    },

    moveAddButton () {
      this.$nextTick(() => {
        let doc = this.codemirror.doc
        let selection = doc.getCursor()
        let line = doc.lineInfo(selection.line)

        if (line.text !== '') {
          this.addButton.top = null
          this.addButton.line = null
          return null
        }

        let cursorPosition = this.codemirror.cursorCoords()
        let editorPosistion = this.$refs.codemirror.$el.getBoundingClientRect()

        this.addButton.line = selection.line
        this.addButton.top = cursorPosition.top - editorPosistion.top + 'px'
      })
    },

  },

  mounted () {
    this.moveAddButton()
  },

}
</script>

<template>
<section class="editor -markdown">

  <codemirror
    v-model="content"
    ref="codemirror"
    :options="options"
    @focus="focus = true"
    @blur="focus = false"
    @cursorActivity="moveAddButton()"
    :class="{'-focus': focus}"
  />

  <button-core
    circle
    size="small"
    class="add-button"
    :style="{top: addButton.top}"
    ref="addButton"
    @click.native="$refs.fileInput.click()"
    v-if="addButton.top !== null && config.IMAGE !== false"
  >
    <icon name="plus"/>
  </button-core>

  <div class="tools">
    <button-core mode="info" light href="https://www.markdownguide.org/cheat-sheet" target="markdown-cheat-sheet">Markdown Cheat Sheet</button-core>
  </div>

  <input
    class="file-input"
    type="file"
    ref="fileInput"
    @change="uploadImage($event)"
    accept="image/png, image/jpeg, image/gif, image/svg+xml"
    v-show="false"
  >

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.editor.-markdown
  +gap()

  .add-button
    position: absolute
    top: 0
    right: 0
    transform: translate(50%, -65%)

  .tools
    +chain()
    width: 100%
    justify-content: flex-end

.editor.-markdown /deep/

  .vue-codemirror
    // padding: .5rem
    border: $input-border
    background-color: $input-background
    padding: $input-padding
    padding-left: 1.5rem
    padding-right: 1.5rem
    min-height: 15rem

    &:hover
      border: $input-border--hover
      background-color: $input-background--hover

    &.-focus
      border: $input-border--focus
      background-color: $input-background--focus

    .CodeMirror
      font-size: 1rem
      background-color: transparent

    .CodeMirror-focused
      // border: $input-border--focus

    .cm-header-1,
    .cm-header-2,
    .cm-header-3,
    .cm-header-4,
    .cm-header-5,
    .cm-header-6
      color: $heading-color
      font-family: $heading-font-family
      font-size: $heading-font-size
      font-weight: 600

    .cm-header-1
      font-size: 1.6em

    .cm-header-2
      font-size: 1.4em

    .cm-header-3
      font-size: 1.2em

    .cm-url
      color: $color-gray

    .cm-link
      background-color: mix($link-color, transparent, 7%)
      color: $link-color

      &:hover
        color: $link-color--hover

      + .cm-url
        background-color: mix($link-color, transparent, 7%)

    .cm-image-marker,
    .cm-image-alt-text,
    .cm-image-marker:hover,
    .cm-image-alt-text:hover
      color: $content-color
      text-decoration: none

    .cm-image-marker,
    .cm-image-alt-text
      background-color: mix($color-info, transparent, 7%)

      + .cm-url
        background-color: mix($color-info, transparent, 7%)

    .cm-comment
      color: $content-color
      background-color: mix($content-color, transparent, 7%)

    .cm-quote
      color: $color-gray

    .cm-variable-2,
    .cm-variable-3
      color: mix($color-info, $color-black, 50%)

</style>
