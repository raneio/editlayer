<script>
import EditorBase from '@/editors/common/BasePreview'
import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content (read-only)
  // this.config - Config data from the schema (read-only)
  name: 'TextPreview',

  computed: {

    previewText () {
      let previewText = _.toString(this.content)
      let div = document.createElement('div')
      div.innerHTML = previewText
      previewText = div.innerText || ''
      if (!previewText) return '…'
      return (previewText.length <= 70) ? previewText : previewText.substring(0, 67) + '…'
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
  padding: .3rem 1rem
  font-size: .8rem
  overflow: hidden
  text-overflow: ellipsis

</style>
