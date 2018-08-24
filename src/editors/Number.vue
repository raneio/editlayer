<script>
/**
 * Input Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.PLACEHOLDER
 * @param {string} config.MIN
 * @param {string} config.MAX
 * @param {string} config.STEP
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'NumberEditor',

  computed: {

    preventSave () {
      return !!(this.content && _.get(this.$refs, 'input.validity.valid') === false)
    },

    inputType () {
      return ['tel'].includes(this.config.MODE) ? this.config.MODE : 'number'
    },

  },

  mounted () {
    this.$refs['input'].focus()
  },

}
</script>

<template>
<section class="editor -number">
  <input
    ref="input"
    v-model="content"
    :type="inputType"
    :placeholder="config.PLACEHOLDER"
    :min="config.MIN"
    :max="config.MAX"
    :step="config.STEP"
  >
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'
</style>
