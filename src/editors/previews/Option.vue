<script>
import EditorBase from '@/editors/common/BasePreview'
import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content (read-only)
  // this.config - Config data from the schema (read-only)
  name: 'OptionPreview',

  computed: {

    previewText () {
      let selectedOption = _.find(this.config.OPTIONS, {value: this.content})
      if (!selectedOption) return '…'
      let previewText = selectedOption.label ? selectedOption.label : selectedOption.value
      if (!previewText) return '…'
      return (previewText.length <= 70) ? previewText : previewText.substring(0, 67) + '…'
    },

  },

}
</script>

<template>
<div class="preview -option" v-text="previewText"></div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.preview.-option
  padding: .3rem 1rem
  font-size: .8rem
  overflow: hidden
  text-overflow: ellipsis

</style>
