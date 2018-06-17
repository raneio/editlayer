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
      let content = _.toString(this.content)
      let div = document.createElement('div')
      div.innerHTML = content
      content = div.innerText || ''
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
@import '../../sass/mixins/all'

.preview.-text
  padding: .3rem 1rem
  font-size: .8rem
  overflow: hidden
  text-overflow: ellipsis

</style>
