<script>
import _ from 'lodash'
import autosize from 'autosize'
// import * as monaco from '@timkendrick/monaco-editor'

export default {
  name: 'TextareaEditor',

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
    },

    content: _.debounce(function () {
      this.saveFunction(this.editorData, this.content)
    }, 500),

  },

  mounted () {
    this.$refs['textarea'].focus()
    autosize(this.$refs['textarea'])
  },

}
</script>

<template>
<section class="editor -textarea">

  <textarea class="textarea" ref="textarea" v-model="content"/>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/features'

.textarea
  resize: none
  overflow: hidden
  min-height: 10rem

</style>
