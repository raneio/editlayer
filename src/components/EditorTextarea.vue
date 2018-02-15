<script>
import _ from 'lodash'

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
    }, 1000),

  },

  mounted () {
    this.$refs['textarea'].focus()
  },

}
</script>


<template>
<section class="editor -textarea">

  <textarea ref="textarea" rows="8" cols="80" v-model="content"/>

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

// Under /deep/ you can also change style of child components
.editor /deep/


</style>
