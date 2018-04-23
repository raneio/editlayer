<script>
import _ from 'lodash'

export default {
  name: 'ImageEditor',

  props: {
    editorData: Object,
    saveFunction: Function
  },

  data () {
    return {
      content: this.editorData.content,
      uploading: {
        progress: 0,
        url: null,
        filename: null
      }
    }
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

    uploadProcess () {
      if (_.has(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)) {
        return _.get(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)
      } else {
        return null
      }
    }

  },

  watch: {

    'editorData.content' (value) {
      this.content = value
    },

    content () {
      this.saveFunction(this.editorData, this.content)
    }

  },

  methods: {

    uploadImage (event) {
      let image = event.target.files[0]
      this.$refs['file-input'].value = ''
      if (!image) return false

      this.$store.dispatch('uploadImage', {
        projectId: this.projectId,
        path: this.$route.params.path,
        image: image,
        config: this.editorData.config
      })
    }

  }

}
</script>

<template>
<section class="editor -image">
  <div class="tools">

    <button
      @click="$refs['file-input'].click()"
      class="button"
      :disabled="uploadProcess && uploadProcess.status !== 'uploaded' && uploadProcess.status !== 'done'"
    >
      Change Image
    </button>

  </div>

  <div class="preview">
    <img class="image" :src="previewImage" alt="" v-if="!uploading.url && previewImage !== false">
  </div>

  <div class="filename">{{ filename }}</div>

  <input
    class="file-input"
    type="file"
    ref="file-input"
    @change="uploadImage($event)"
    accept="image/png, image/jpeg, image/gif, image/svg+xml"
  >

</section>
</template>

<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../../sass/features'

.editor
  +margin-to-childs(.75rem)
  // text-align: center

.file-input
  display: none

.tools
  +chain()
  justify-content: flex-end
  align-items: flex-end

.filename
  font-size: .8rem
  color: $color-disabled
  text-align: center

.preview
  background-image: url('../../assets/image-background.png')
  background-position: center
  box-shadow: 0 5px 12px 0 mix(transparent, $color-content, 90%), 0 2px 5px 0 mix(transparent, black, 93%)
  min-height: 10rem
  display: flex
  justify-content: center
  align-items: center

  .image
    max-height: 30rem

// Under /deep/ you can also change style of child components
.editor /deep/

</style>
