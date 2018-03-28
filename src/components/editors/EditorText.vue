<script>
import _ from 'lodash'

export default {
  name: 'EditorText',

  props: {
    editorData: Object,
    saveFunction: Function,
  },

  data () {
    return {
        content: this.editorData.content,
    }
  },

  computed: {

    // activeStructure () {
    //   return this.$store.getters.activeStructure
    // },

  },

  watch: {

    'editorData.content' (value) {
      this.content = value
      this.$refs['input'].focus()
    },

    content: _.debounce(function () {
      this.saveFunction(this.editorData, this.content)
    }, 500),

  },

  mounted () {
    this.$refs['input'].focus()
  },

}
</script>


<template>
<section class="editor -text">

  <input type="text" name="" ref="input" v-model="content">

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../../sass/features'

// Under /deep/ you can also change style of child components
.editor /deep/


</style>
