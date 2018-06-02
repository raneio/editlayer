<script>
import _ from 'lodash'

export default {
  name: 'InputEditor',

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

    editorType () {
      if (this.editorData.editor === 'datetime') return 'datetime-local'
      return this.editorData.editor
    },

    editorClass () {
      return `-${this.editorType}`
    },

  },

  watch: {

    'editorData.content' (value) {
      this.content = value
    },

    content: _.debounce(function () {
      let content = this.content

      if (this.editorData.editor === 'number') {
        content = _.toNumber(content)
      }

      this.saveFunction(this.editorData, content)
    }, 500),

  },

  mounted () {
    this.$refs['input'].focus()
  },

}
</script>

<template>
<section class="editor" :class="editorClass">
  <input :type="editorType" name="" ref="input" v-model="content">
</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.editor

  &.-color

    input
      padding: .2rem
      height: 3rem

</style>
