<script>
import EditorBase from '@/editors/common/BasePreview'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'ArrayPreview',

  computed: {

    items () {
      return _.isArray(this.content) ? this.content : [this.content]
    },

  },

}
</script>

<template>
<div class="preview -array">
  <div class="tag" v-text="item" v-for="item in items" :key="item"></div>
</div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.preview.-array
  padding: .3rem .5rem .3rem .75rem
  font-size: .8rem

.tag
  display: inline-block
  margin-right: .25rem
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  max-width: 7em
  background-color: $color-gray--lighter
  padding: .2em .75em
  border-radius: .25rem

</style>
