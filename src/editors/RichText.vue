<script>
/**
 * Rich Text Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.PLACEHOLDER
 * @param {string} config.DOWNSCALE
 */

import EditorBase from '@/editors/common/BaseEditor'
import {quillEditor} from 'vue-quill-editor'
import { offset } from 'caret-pos'
import _ from 'lodash'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  extends: EditorBase,

  name: 'RichTextEditor',

  components: {
    quillEditor,
  },

  data () {
    return {
      addButton: {
        top: null,
        index: null,
      },
    }
  },

  computed: {

    quill () {
      return this.$refs.quillEditor.quill
    },

    options () {
      return {
        theme: 'bubble',
        bounds: '.main-panel',
        placeholder: _.has(this.config, 'PLACEHOLDER') ? this.config.PLACEHOLDER : '',
        modules: {
          toolbar: {
            container: [
              [
                {header: 1},
                {header: 2},
                'bold',
                'italic',
              ],
              [
                'link',
                'blockquote',
              ],
              [
                {list: 'ordered'},
                {list: 'bullet'},
              ],
              [
                'clean',
              ],
            ],
            handlers: {
              image: () => {
                this.$refs['file-input'].click()
              },
            },
          },
        },
      }
    },
  },

  methods: {

    uploadImage (event) {
      let image = event.target.files[0]
      this.$refs['fileInput'].value = ''
      if (!image) return null

      this.$store.dispatch('uploadImage', {
        projectId: this.projectId,
        path: this.$route.params.path,
        image: image,
        downscale: this.config.DOWNSCALE,
      })
        .then((image) => {
          this.quill.insertEmbed(this.addButton.index, 'image', image.downloadURL)
        })
        .catch((error) => console.error('Image uploading faild!', error))
    },

    moveAddButton () {
      this.$nextTick(() => {
        let baseNode = window.getSelection().baseNode
        let selection = this.quill.getSelection()
        let editor = document.querySelector('.ql-editor')
        let isNothingSelected = _.get(selection, 'length') === 0
        let isLineEmpty = baseNode.data === undefined
        let isOnlyOneChild = _.get(baseNode, 'childNodes.length') === 1
        let isChildBR = _.get(baseNode, 'childNodes[0].tagName') === 'BR'

        if (!isNothingSelected || !isLineEmpty || !isOnlyOneChild || !isChildBR) {
          this.addButton.top = null
          this.addButton.index = null
          return null
        }

        let carePosistion = offset(editor)
        let editorPosistion = editor.getBoundingClientRect()
        this.addButton.index = selection.index
        this.addButton.top = carePosistion.top - editorPosistion.top + 'px'
      })
    },

  },

  mounted () {
    this.quill.focus()
    this.moveAddButton()
    this.quill.on('editor-change', () => this.moveAddButton())
    window.addEventListener('resize', () => this.moveAddButton())
  },

}
</script>

<template>
<section class="editor -rich-text">

  <quill-editor
    v-model="content"
    ref="quillEditor"
    :options='options'
  />

  <button-core
    circle
    size="small"
    class="add-button"
    :style="{top: addButton.top}"
    ref="addButton"
    @click.native="$refs['fileInput'].click()"
    v-if="addButton.top !== null && config.IMAGE !== false"
  >
    <icon name="plus"/>
  </button-core>

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

.editor.-rich-text

  .add-button
    position: absolute
    padding: 0
    top: 0
    right: 0
    transform: translate(50%, -17%)

.editor.-rich-text /deep/

  .ql-editor
    background: $input-background
    border: $input-border
    border-radius: $input-border-radius
    color: $input-text-color
    font-family: $input-font-family
    font-size: $input-font-size
    font-weight: $input-font-weight
    padding: $input-padding
    padding-left: 1.5rem
    padding-right: 1.5rem
    +gap(1.5rem)
    min-height: 15rem

    &::before
      left: 1.5rem
      color: $input-placeholder-color
      font-style: normal

    +hx
      font-weight: 600

    h2
      font-size: 1.6em

    h3
      font-size: 1.4em

    h4
      font-size: 1.2em

    ul,
    ol
      padding-left: 1.5rem

      ul,
      ol
        margin-bottom: 0

    ul
      list-style-type: disc

    img,
    iframe
      display: block
      margin: 2.5rem auto
      padding-left: 2rem
      padding-right: 2rem

      +breakpoint('medium')
        padding-left: 5rem
        padding-right: 5rem

      +breakpoint('large')
        padding-left: 10rem
        padding-right: 10rem

    iframe
      width: 100%
      height: 12rem

      +breakpoint('large')
        height: 20rem

</style>
