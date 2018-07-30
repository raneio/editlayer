<script>
import EditorBase from '@/editors/common/BasePreview'

export default {
  extends: EditorBase,
  // this.content - Content (read-only)
  // this.config - Config data from the schema (read-only)
  name: 'VideoPreview',

  computed: {

    previewImage () {
      return this.content.thumbnail
    },

  },

}
</script>

<template>
<div class="preview -image">
  <img class="image" :src="previewImage" alt="" v-if="content">
  <icon name="play-circle"></icon>
</div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.preview.-image
  position: relative
  background-image: url('../../assets/image-background.png')
  background-position: center
  height: 5em
  +center()
  overflow: hidden

  .image
    max-width: 100%

  .fa-icon
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    height: 160%
    width: auto
    max-width: none
    max-height: none
    color: mix($color-white, transparent, 90%)
    filter: drop-shadow(0 0 .5rem mix($color-black, transparent, 70%))

</style>
