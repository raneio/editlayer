<script>
/**
 * Image Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.MAX_WIDTH
 * @param {string} config.MAX_HEIGHT
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'ImageEditor',

  data () {
    return {
      uploading: false,
    }
  },

  watch: {

    '$store.getters.activeSchema._content' (value) {
      this.content = value
    },

  },

  computed: {

    projectId () {
      return this.$route.params.projectId
    },

    filename () {
      return _.chain(this.content).split('/').pop().value()
    },

    previewImage () {
      return this.content
    },

  },

  methods: {

    uploadImage (event) {
      let image = event.target.files[0]
      this.$refs['file-input'].value = ''
      if (!image) return false

      this.uploading = true
      // this.uploadPreview = URL.createObjectURL(image)

      this.$store.dispatch('uploadImage', {
        projectId: this.projectId,
        path: this.$route.params.path,
        image: image,
        maxWidth: this.config.MAX_WIDTH,
        maxHeight: this.config.MAX_HEIGHT,
      })
        .then((image) => {
          console.log('uploaded', image)
          this.$store.dispatch('saveContent', {
            projectId: image.projectId,
            path: image.path,
            content: image.downloadURL,
          })
          this.uploading = false
        })
    },

  },

}
</script>

<template>
<section class="editor -image">

  <div class="preview">
    <img class="image" :src="previewImage" alt="" v-if="previewImage !== false">
  </div>

  <div class="tools">

    <button
      @click="$refs['file-input'].click()"
      class="button -large"
      :disabled="uploading"
    >
      Upload Image
    </button>

  </div>

  <input
    class="file-input"
    type="file"
    ref="file-input"
    @change="uploadImage($event)"
    accept="image/png, image/jpeg, image/gif, image/svg+xml"
    v-show="false"
  >

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.editor
  +gap(.75rem)
  // text-align: center

.tools
  +chain()
  justify-content: center
  align-items: flex-start

// .filename
//   font-size: .8rem
//   color: $color-gray
//   text-align: center

.preview
  background-image: url('../assets/image-background.png')
  background-position: center
  box-shadow: 0 5px 12px 0 mix(transparent, $color-black, 90%), 0 2px 5px 0 mix(transparent, black, 93%)
  min-height: 10rem
  display: flex
  justify-content: center
  align-items: center

  .image
    max-height: 50vh

// Under /deep/ you can also change style of child components
.editor /deep/

</style>
