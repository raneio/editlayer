<script>
/**
 * Textarea editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.PLACEHOLDER
 */

import EditorBase from '@/editors/common/BaseEditor'
import autosize from 'autosize'

export default {
  extends: EditorBase,

  name: 'TextareaEditor',

  mounted () {
    this.$refs['textarea'].focus()
    autosize(this.$refs['textarea'])
  },

}
</script>

<template>
<section class="editor -textarea">
  <textarea
    class="textarea"
    ref="textarea"
    v-model="content"
    :placeholder="config.PLACEHOLDER"
  />
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.textarea
  resize: none
  overflow: hidden
  min-height: 15rem

</style>
