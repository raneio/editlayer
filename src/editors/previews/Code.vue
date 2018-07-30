<script>
import EditorBase from '@/editors/common/BasePreview'
import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content (read-only)
  // this.config - Config data from the schema (read-only)
  name: 'CodePreview',

  computed: {

    previewText () {
      let content = _.toString(this.content)
      return (content && content.length <= 70) ? content : content.substring(0, 67) + '…'
    },

  },

}
</script>

<template>
<div class="preview -text" v-text="previewText"></div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.preview.-text
  +invert()
  background-color: $color-gray--darker
  padding: .3rem 1rem
  font-size: .8rem
  overflow: hidden
  text-overflow: ellipsis
  font-family: monospace

</style>
