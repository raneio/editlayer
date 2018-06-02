<script>
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'

export default {
  name: 'CodeMirror',

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
        theme: 'dracula',
        tabSize: 2,
        lineNumbers: true,
        mode: null,
      },
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
    console.log('editorData', this.editorData)

    if (_.get(this.editorData, 'config.language') === 'html' || !_.has(this.editorData, 'config.language')) {
      this.options.mode = 'xml'
      this.options.htmlMode = true
    } else if (_.get(this.editorData, 'config.language') === 'css') {
      this.options.mode = 'text/css'
    } else if (_.get(this.editorData, 'config.language') === 'sass') {
      this.options.mode = 'text/x-sass'
    } else if (_.get(this.editorData, 'config.language') === 'json') {
      this.options.mode = 'application/ld+json'
    } else if (_.get(this.editorData, 'config.language') === 'javascript') {
      this.options.mode = 'application/javascript'
    } else if (_.get(this.editorData, 'config.language') === 'typescript') {
      this.options.mode = 'application/typescript'
    } else if (_.get(this.editorData, 'config.language') === 'markdown') {
      this.options.mode = 'text/x-markdown'
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
@import '../sass/features'
</style>
