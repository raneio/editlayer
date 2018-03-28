<script>
import _ from 'lodash'
import slugg from 'slugg'
import ImageCompressor from 'image-compressor.js'
import firebase from '@/firebase'

export default {
  name: 'EditorImage',

  props: {
    editorData: Object,
    saveFunction: Function,
  },

  data () {
    return {
        content: this.editorData.content,
        uploading: {
          progress: 0,
          url: null,
          filename: null,
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
      // if (this.content === null) return false
      // return `${this.$store.state.storageUrlPrefix}${this.$route.params.projectId}/${this.content}`
    },

    uploadProcess () {
      if (_.has(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)) {
        return _.get(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)
      } else {
        return null
      }
    },

  },

  watch: {

    'editorData.content' (value) {
      this.content = value
    },

    content () {
      this.saveFunction(this.editorData, this.content)
    },

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
        config: this.editorData.config,
      })
    },

    // async optimizeImage (event) {
    //   const selectedImage = event.target.files[0]
    //   if (!selectedImage) return false
    //   if (!_.startsWith(selectedImage.type, 'image/')) return false
    //
    //   this.$store.dispatch('uploadFile', {
    //     projectId: this.projectId,
    //     path: this.$route.params.path,
    //     filename: filename,
    //     blobUrl: URL.createObjectURL(selectedImage),
    //   })
    //
    //   let filenameWithoutExt = slugg(selectedImage.name.replace(/\.[^/.]+$/, ''))
    //   let randomId = Math.random().toString(36).slice(-5)
    //
    //   // this.uploading.filename =  selectedImage.name
    //   // this.uploading.url = URL.createObjectURL(selectedImage)
    //
    //   // if (selectedImage.type === 'image/gif') {
    //   //   console.log('GIF', selectedImage)
    //   //   this.uploadImages(selectedImage, selectedImage)
    //   //   return false
    //   // }
    //
    //   const imageCompressor = new ImageCompressor()
    //   let optimizedImage = await imageCompressor.compress(selectedImage, {
    //     quality: .6,
    //     convertSize: 1000000,
    //     maxWidth: 1000,
    //     maxHeight: 1000,
    //   })
    //   .then((result) => {
    //     console.log('Image optimized')
    //     return result
    //   })
    //   .catch((error) => console.error('Image optimize failed', error.message))
    //
    //   let uploadImage = optimizedImage
    //   let savedSize = 100 - (optimizedImage.size / selectedImage.size * 100)
    //
    //   if (savedSize < 10) {
    //     uploadImage = selectedImage
    //   }
    //
    //   let ext = null
    //   if (uploadImage.type === 'image/jpeg') {
    //     ext = 'jpg'
    //   } else if (uploadImage.type === 'image/png') {
    //     ext = 'png'
    //   } else if (uploadImage.type === 'image/gif') {
    //     ext = 'gif'
    //   } else {
    //     return false
    //   }
    //
    //   let filename = `${filenameWithoutExt}-${randomId}.${ext}`
    //
    //   console.log('uploadImage', uploadImage)
    //
    //   this.$store.dispatch('uploadFile', {
    //     projectId: this.projectId,
    //     path: this.$route.params.path,
    //     file: uploadImage,
    //     filename: filename,
    //     blobUrl: URL.createObjectURL(selectedImage),
    //   })
    //
    // },

    // uploadImages (scaledImage, orginalImage, tries = 0) {
    //   if (!scaledImage || !orginalImage) return false
    //
    //   let orginalExt = orginalImage.name.split('.').pop()
    //   let basename = slugg(orginalImage.name.substring(0, orginalImage.name.length - orginalExt.length - 1))
    //   let randomId = Math.random().toString(36).slice(-5)
    //   let ext = ''
    //
    //   if (scaledImage.type === 'image/jpeg') {
    //     ext = 'jpg'
    //   } else if (scaledImage.type === 'image/png') {
    //     ext = 'png'
    //   } else if (scaledImage.type === 'image/gif') {
    //     ext = 'gif'
    //   } else {
    //     console.error('Not supported file type.', scaledImage.type)
    //     return false
    //   }
    //
    //   let filename = `${basename}-${randomId}.${ext}`
    //
    //   let uploadImage = scaledImage
    //   let savedSize = 100 - (scaledImage.size / orginalImage.size * 100)
    //
    //   if (savedSize < 10) {
    //     uploadImage = orginalImage
    //   }
    //
    //   firebase.storage.ref()
    //     .child(`${this.projectId}/${filename}`)
    //     .put(uploadImage)
    //     .then(() => {
    //       this.content = `${this.$store.state.storageUrlPrefix}${this.projectId}/${filename}`
    //       this.uploading.url = null
    //       this.uploading.filename = null
    //     })
    //     .catch((error) => console.error('Image upload failed', error))
    //
    // },

  },

}
</script>


<template>
<section class="editor -image">

  <!-- <form id="dropzone">
    <div class="fallback">
      <input name="file" type="file" multiple @change="uploadImages($event)">
    </div>
  </form> -->

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
