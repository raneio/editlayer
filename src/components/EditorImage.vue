<script>
import _ from 'lodash'
import slugg from 'slugg'
import loadImage from 'blueimp-load-image'
import Dropzone from 'dropzone'
import ImageCompressor from 'image-compressor.js'
import firebase from '../firebase'

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

    filename () {
      if (!this.uploading.filename) {
        return this.content
      } else {
        return this.uploading.filename
      }
    },

    previewImage () {
      return this.content
      // if (this.content === null) return false
      // return `${this.$store.state.storageUrlPrefix}${this.$route.params.id}/${this.content}`
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

    optimizeImage (event) {
      let me = this
      const file = event.target.files[0]

      if (!file) return false

      this.uploading.filename =  file.name
      this.uploading.url = URL.createObjectURL(file)

      if (file.type === 'image/gif') {
        console.log('GIF', file)
        this.uploadImages(file, file)
        return false
      }

      new ImageCompressor(file, {
        quality: .6,
        convertSize: 3000000,
        maxWidth: 1000,
        maxHeight: 1000,
        success(result) {
          me.uploadImages(result, file)
        },
        error(e) {
          console.error('Image optimize failed', e.message);
        },
      });

    },

    uploadImages (scaledImage, orginalImage, tries = 0) {
      let fileId = this.$route.params.id

      // console.log('scaledImage', scaledImage)
      // console.log('orginalImage', orginalImage)

      if (!scaledImage || !orginalImage) return false

      let orginalExt = orginalImage.name.split('.').pop()
      let basename = slugg(orginalImage.name.substring(0, orginalImage.name.length - orginalExt.length - 1))
      let randomSuffix = Math.random().toString(36).slice(-5)
      let ext = ''

      if (scaledImage.type === 'image/jpeg') {
        ext = 'jpg'
      } else if (scaledImage.type === 'image/png') {
        ext = 'png'
      } else if (scaledImage.type === 'image/gif') {
        ext = 'gif'
      } else {
        console.error('Not supported file type.', scaledImage.type)
        return false
      }


      let filename = `${basename}-${randomSuffix}.${ext}`
      // let randomSuffix = Math.random().toString(36).slice(-3)
      // let filename = `foobar-${randomSuffix}.jpg`

      // this.uploading.filename =  filename
      // this.uploading.url = URL.createObjectURL(scaledImage)

      let uploadImage = scaledImage
      let savedSize = 100 - (scaledImage.size / orginalImage.size * 100)

      if (savedSize < 10) {
        uploadImage = orginalImage
      }

      let uploadTask = firebase.storage.ref().child(`${fileId}/${filename}`).put(uploadImage)
      .then(() => {
        this.content = `${this.$store.state.storageUrlPrefix}${fileId}/${filename}`
        this.uploading.url = null
        this.uploading.filename = null

        // let imgUrl = `https://editlayer.imgix.net/${fileId}/${filename}`
        // let imgUrl = `${this.$store.state.storageUrlPrefix}${fileId}/${filename}`
        // this.uploading.progress = 0
        //
        // let img = new Image()
        //
        // img.onload = (event) => {
        //   console.log('onload')
        //   this.content = imgUrl
        //   this.uploading.url = null
        // }
        //
        // img.onerror = (event) => {
        //   _.delay(() => {
        //     img.src = `${imgUrl}?${Math.random().toString(36).slice(-5)}`
        //   }, 1000)
        // }
        //
        // img.src = imgUrl

      })
      .catch((error) => console.error('Image upload failed', error))


    },

  },

  mounted () {

    // Dropzone.autoDiscover = false
    // new Dropzone("#dropzone", {url: '/upload'})

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
      :disabled="uploading.url"
    >
      Change Image
    </button>

  </div>

  <div class="preview">

    <img class="image" :src="previewImage" alt="" v-if="!uploading.url && previewImage !== false">

    <div class="uploading" v-if="uploading.url">
      <img class="image" :src="uploading.url" alt="">
      <div class="progress" :style="{ height: uploading.progress + '%'}"/>
    </div>

  </div>

  <div class="filename">{{ filename }}</div>

  <input
    class="file-input"
    type="file"
    ref="file-input"
    @change="optimizeImage($event)"
    accept="image/png, image/jpeg, image/gif, image/svg+xml"
  >

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

#dropzone
  background-color: pink
  height: 10rem

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
  background-image: url('../assets/image-background.png')
  background-position: center
  box-shadow: 0 5px 12px 0 mix(transparent, $color-content, 90%), 0 2px 5px 0 mix(transparent, black, 93%)
  min-height: 10rem
  display: flex
  justify-content: center
  align-items: center

  .image
    max-height: 30rem

  .uploading
    position: relative
    max-height: 600px
    max-width: 900px

    .progress
      position: absolute
      top: 0
      left: 0
      width: 100%
      transition: height .2s
      background-color: mix(transparent, $color-background, 10%)



// Under /deep/ you can also change style of child components
.editor /deep/


</style>
