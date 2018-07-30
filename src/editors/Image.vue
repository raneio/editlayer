<script>
/**
 * Image Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.PLACEHOLDER
 * @param {string|object} config.DOWNSCALE
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

    '$store.getters.activeItem._content' (value) {
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
      return _.get(this.content, 'url')
    },

  },

  methods: {

    uploadImage (event) {
      let image = event.target.files[0]
      this.$refs['file-input'].value = ''
      if (!image) return false

      this.uploading = true

      this.$store.dispatch('uploadImage', {
        projectId: this.projectId,
        path: _.replace(this.$route.params.path, />/g, '.'),
        image: image,
        downscale: this.config.DOWNSCALE,
        placeholder: this.config.PLACEHOLDER,
      })
        .then((image) => {
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

    <button-core
      size="large"
      mode="primary"
      @click.native="$refs['file-input'].click()"
      :disabled="uploading"
    >
      Upload Image
    </button-core>

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
@import '../sass/core/mixins'

.editor
  +gap(.75rem)
  // text-align: center

.tools
  +chain()
  justify-content: center
  align-items: flex-start

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

</style>
