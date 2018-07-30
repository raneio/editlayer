<script>
/**
 * Code Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.MODE
 */

import EditorBase from '@/editors/common/BaseEditor'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/css/css'
import 'codemirror/mode/sass/sass'
import 'codemirror/mode/markdown/markdown'

export default {
  extends: EditorBase,

  name: 'CodeEditor',

  components: {
    codemirror,
  },

  data () {
    return {
      options: {
        theme: 'dracula',
        tabSize: 2,
        lineNumbers: true,
        mode: null,
      },
    }
  },

  created () {
    switch (this.config.MODE) {
      case 'css':
        this.options.mode = 'text/css'
        break
      case 'scss':
        this.options.mode = 'text/x-scss'
        break
      case 'sass':
        this.options.mode = 'text/x-sass'
        break
      case 'less':
        this.options.mode = 'text/x-less'
        break
      case 'json':
        this.options.mode = 'application/ld+json'
        break
      case 'javascript':
        this.options.mode = 'application/javascript'
        break
      case 'typescript':
        this.options.mode = 'application/typescript'
        break
      case 'markdown':
        this.options.mode = 'text/x-markdown'
        break
      default:
        this.options.mode = 'xml'
        this.options.htmlMode = true
    }
  },

}
</script>

<template>
<section class="editor -textarea">

  <codemirror
    class="-dracula"
    v-model="content"
    :options="options"
  />

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'
</style>
