<script>
import EditorBase from '@/editors/common/BasePreview'
import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content (read-only)
  // this.config - Config data from the schema (read-only)
  name: 'ImagePreview',

  computed: {

    previewImage () {
      if (_.isString(this.content)) {
        return this.content
      }
      else if (_.has(this.content, 'thumbnail')) {
        return this.content.thumbnail
      }
      else if (_.has(this.content, 'url')) {
        return this.content.url
      }
    },

  },

}
</script>

<template>
<div class="preview -image">
  <img class="image" :src="previewImage" alt="" v-if="content">
</div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.preview.-image
  position: relative
  background-image: url('../../assets/image-background.png')
  background-position: center
  height: 5em
  +center()
  overflow: hidden

  .image
    max-width: 100%

</style>
