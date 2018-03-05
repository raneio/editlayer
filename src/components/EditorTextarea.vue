<script>
import _ from 'lodash'
// import * as monaco from '@timkendrick/monaco-editor'

export default {
  name: 'EditorTextarea',

  props: {
    editorData: Object,
    saveFunction: Function,
  },

  data () {
    return {
        content: this.editorData.content,
    }
  },

  watch: {

    'editorData.content' (value) {
      this.content = value
      this.$refs['textarea'].focus()
    },

    content: _.debounce(function () {
      this.saveFunction(this.editorData, this.content)
    }, 500),

  },

  mounted () {
    this.$refs['textarea'].focus()
    // monaco.editor.create(document.getElementById('elementId'), {})
  },

}
</script>


<template>
<section class="editor -textarea">

  <textarea ref="textarea" rows="8" cols="80" v-model="content"/>

  <!-- <div id="elementId">
    Foobar
  </div> -->

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

// Under /deep/ you can also change style of child components
.editor /deep/


</style>
