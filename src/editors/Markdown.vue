<script>
import EditorBase from '@/editors/common/BaseEditor'
import { codemirror } from 'vue-codemirror'
import _ from 'lodash'
import titleCase from 'title-case'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the structure (read-only)
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
        // theme: 'dracula',
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
        maxWidth: this.config.IMAGE_MAX_WIDTH,
        maxHeight: this.config.IMAGE_MAX_HEIGHT,
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

  <button
    class="button -circle -success add-button"
    :style="{top: addButton.top}"
    ref="addButton"
    @click="$refs.fileInput.click()"
    v-if="addButton.top !== null"
  >
    <icon name="plus"/>
  </button>

  <div class="tools">
    <!-- <button class="button -small" @click="$refs.fileInput.click()">Upload image</button> -->

    <div>
      <a href="https://www.markdownguide.org/cheat-sheet" target="markdown-cheat-sheet">Markdown Cheat Sheet</a>
    </div>
  </div>

  <input
    class="file-input"
    type="file"
    ref="fileInput"
    @change="uploadImage($event)"
    accept="image/png, image/jpeg, image/gif, image/svg+xml"
    v-show="false"
  >

  <!-- <section class="help">
    <h2 class="heading -feature">Markdown help</h2>

    <h3 class="heading">Heading</h3>
    <div>
      <div># Heaging One</div>
      <div>## Heading Two</div>
      <div>### Heading Three</div>
    </div>

    <h3 class="heading">Bold</h3>
    <strong>**bold text**</strong>

    <h3 class="heading">Italic</h3>
    <em>*italicized text*</em>

    <h3 class="heading">Blockquote</h3>
    <blockquote>> blockquote</blockquote>

    <h3 class="heading">Ordered List</h3>
    <ol>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ol>

    <h3 class="heading">Unordered List</h3>
    <ul>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ul>

    <h3 class="heading">Code</h3>
    <code>`code`</code>

    <h3 class="heading">Horizontal Rule</h3>
    <div>---</div>

    <h3 class="heading">Link</h3>
    <div>[title](https://www.example.com)</div>

    <h3 class="heading">Image</h3>
    <div>![alt text](image.jpg)</div>

  </section> -->

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.editor.-markdown
  +gap()

  .add-button
    position: absolute
    padding: 0
    top: 0
    left: -1rem
    transform: translateY(-1.25rem)

  .tools
    +chain()
    width: 100%
    justify-content: flex-end
  // .help
  //   +gap(2rem)
  //
  //   .heading + *
  //     margin-top: .25rem

.editor.-markdown /deep/

  .vue-codemirror
    // padding: .5rem
    border: $input-border--basic
    background-color: $input-background--basic
    padding: $input-padding
    padding-left: 1.5rem
    padding-right: 1.5rem

    &:hover
      border: $input-border--hover
      background-color: $input-background--hover

    &.-focus
      border: $input-border--focus
      background-color: $input-background--focus

    .CodeMirror
      // font-family: $font-family
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
      background-color: mix($link-color--basic, transparent, 7%)
      color: $link-color--basic

      &:hover
        color: $link-color--hover

      + .cm-url
        background-color: mix($link-color--basic, transparent, 7%)

    .cm-image-marker,
    .cm-image-alt-text,
    .cm-image-marker:hover,
    .cm-image-alt-text:hover
      color: $content-color
      text-decoration: none
      // font-weight: 600
      // font-style: italic

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
      // background-color: mix($color-gray, white, 15%)

</style>
