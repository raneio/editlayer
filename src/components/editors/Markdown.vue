<script>
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'

export default {
  name: 'Markdown',

  props: {
    editorData: Object,
    saveFunction: Function,
  },

  components: {
    codemirror,
  },

  data () {
    return {
      content: this.editorData.content,
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

  watch: {

    'editorData.content' (value) {
      this.content = value
    },

    content: _.debounce(function () {
      this.saveFunction(this.editorData, this.content)
    }, 500),

  },



  created () {
    // this.options.mode = 'text/x-sass'
  },

}
</script>

<template>
<section class="editor -markdown">

  <codemirror
    v-model="content"
    :options="options"
    @focus="focus = true"
    @blur="focus = false"
    :class="{'-focus': focus}"
  />

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/features'

.editor.-markdown /deep/

  .vue-codemirror
    // padding: .5rem
    border: $input-border--basic
    background-color: $input-background--basic
    padding: $input-padding

    &:hover
      border: $input-border--hover
      background-color: $input-background--hover

    &.-focus
      border: $input-border--focus
      background-color: $input-background--focus

    .CodeMirror
      font-family: $font-primary
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
      color: $heading-font-color
      font-family: $heading-font-family
      font-size: $heading-font-size
      font-weight: 600

    .cm-header-1
      font-size: 1.5em

    .cm-header-2
      font-size: 1.3em

    .cm-header-3
      font-size: 1.1em

    .cm-link
      color: $link-font-color--basic

      &:hover
        color: $link-font-color--hover

    .cm-url
      color: $color-gray

    .cm-image-alt-text
      color: $color-blue

      &:hover
        color: $color-blue


    .cm-comment
      color: $color-blue
      background-color: mix($color-gray, white, 5%)
      font-family: monospace

    .cm-quote
      color: $color-gray

    .cm-variable-2,
    .cm-variable-3
      color: mix($color-blue, $color-black, 50%)
      // background-color: mix($color-gray, white, 15%)

</style>
