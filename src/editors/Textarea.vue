<script>
import EditorBase from '@/editors/common/BaseEditor'
import autosize from 'autosize'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the schema (read-only)
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
@import '../sass/mixins/all'

.textarea
  resize: none
  overflow: hidden
  min-height: 15rem

</style>
