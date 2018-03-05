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
      if (!this.content === null) return false
      return `${this.$store.state.storageUrlPrefix}${this.$route.params.id}/${this.content}`
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

    // optimizeImage (event) {
    //   console.log('event.target', event.target)
    //   let image = event.target.files[0]
    //   let fileId = this.$route.params.id
    //
    //   if (!image) return false
    //
    //   console.log('image', image)
    //
    //   // the user-selected image will be loaded into this image
    //   const img = new Image()
    //
    //   // when it's loaded, we can perform any kind of processing we need on it
    //   img.onload = () => {
    //     console.log('img', img)
    //     // create the canvas so we can draw stuff
    //     let canvas = document.createElement('canvas')
    //     let ctx = canvas.getContext('2d')
    //
    //     // for our purposes, scale the canvas to match the source image
    //     canvas.width = img.width
    //     canvas.height = img.height
    //
    //     // draw the source image on the canvas
    //     ctx.drawImage(img, 0, 0, img.width, img.height)
    //
    //     // just draw some watermark text over the image
    //     // we could do anything else the canvas allows us to do (which is a lot)
    //     ctx.font = "100px sans-serif"
    //     ctx.fillStyle = '#666'
    //     ctx.fillText("EDITLAYER", 100, 100)
    //
    //     // convert the canvas to a Blob, and call a callback so the caller can do something with it
    //     canvas.toBlob((imageBlob) => {
    //       this.uploadImages(imageBlob, image)
    //     }, image.type)
    //   }
    //
    //   // the file reader triggers the whole process, once it's loaded from the user's selected image
    //   const fileReader = new FileReader()
    //   fileReader.onload = (e) => {
    //     // setting the image source will trigger the image.onload event above
    //     img.src = e.target.result
    //   };
    //
    //   // load the file data
    //   fileReader.readAsDataURL(image)
    //
    // },

    uploadImages (scaledImage, orginalImage, tries = 0) {
      let fileId = this.$route.params.id

      console.log('scaledImage', scaledImage)
      console.log('orginalImage', orginalImage)

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

      let uploadTask = firebase.storage.ref().child(`${fileId}/${filename}`).put(scaledImage)
      .then(() => {
        this.content = filename
        this.uploading.url = null

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


      // uploadTask.on('state_changed', (snapshot) => {
      //   let progress = 100 - (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //   this.uploading.progress = progress
      // })

    },

    // uploadImagesORGINAL (event) {
    //   let files = event.target.files
    //   let file = files[0]
    //   let fileId = this.$route.params.id
    //
    //   console.log('upload', fileId)
    //
    //   if (!file) return false
    //
    //   let ext = file.name.split('.').pop()
    //   let basename = slugg(file.name.substring(0, file.name.length - ext.length - 1))
    //   let randomSuffix = Math.random().toString(36).slice(-3)
    //   let filename = `${basename}-${randomSuffix}.${ext}`
    //
    //   this.uploading.filename =  filename
    //   this.uploading.url = URL.createObjectURL(file)
    //
    //   let storageRef = firebase.storage.ref().child(`imgix/${fileId}/${filename}`)
    //   let uploadTask = storageRef.put(file)
    //
    //   uploadTask.on('state_changed', (snapshot) => {
    //     let progress = 100 - (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     this.uploading.progress = progress
    //
    //   }, (error) => {
    //     event.tries = (!event.tries) ? 1 : event.tries + 1
    //
    //     if (event.tries < 5) {
    //       console.log('Retry', event.tries)
    //       this.uploadImages(event)
    //     } else {
    //       console.error('Image uploading faild', error)
    //     }
    //
    //
    //   }, () => {
    //     let imgUrl = `https://editlayer.imgix.net/${fileId}/${filename}`
    //     this.uploading.progress = 0
    //
    //     let img = new Image()
    //
    //     img.onload = (event) => {
    //       console.log('onload')
    //       this.content = imgUrl
    //       this.uploading.url = null
    //     }
    //
    //     img.src = imgUrl
    //   })
    //
    // },

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

    <img class="image" :src="previewImage" alt="" v-if="!uploading.url">

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
