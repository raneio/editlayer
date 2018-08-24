<script>
/**
 * Input Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.PLACEHOLDER
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'TextEditor',

  computed: {

    preventSave () {
      return !!(this.content && _.get(this.$refs, 'input.validity.valid') === false)
    },

    inputType () {
      return ['email', 'password', 'url'].includes(this.config.MODE) ? this.config.MODE : 'text'
    },

  },

  mounted () {
    this.$refs['input'].focus()
  },

}
</script>

<template>
<section class="editor -text">
  <input
    ref="input"
    v-model="content"
    :type="inputType"
    :placeholder="config.PLACEHOLDER"
  >

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'
</style>
