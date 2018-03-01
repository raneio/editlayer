<script>
import _ from 'lodash'
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
        return _.chain(this.editorData.content).split('/').takeRight().toString().value()
      } else {
        return this.uploading.filename
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

    uploadImages (event) {
      let files = event.target.files
      let file = files[0]
      let randomKey = Math.random().toString(36).slice(-4)
      let path = `${randomKey}/${file.name}`

      console.log('file', file)
      this.uploading.filename =  file.name
      this.uploading.url =  URL.createObjectURL(file)
      this.content =  this.uploading.url

      let storageRef = firebase.storage.ref().child(`images/${path}`)
      let uploadTask = storageRef.put(file)

      uploadTask.on('state_changed', (snapshot) => {
        let progress = 100 - (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        this.uploading.progress = progress

      }, (error) => {
        this.uploadImages(event)
      }, () => {
        this.content = `https://editlayer.imgix.net/${path}`
        this.uploading.progress = 0
      })

    },

  },

}
</script>


<template>
<section class="editor -image">

  <div class="tools">

    <div class="filename">{{ filename }}</div>

    <button
      @click="$refs['file-input'].click()"
      class="button"
      :disabled="uploading.progress > 0"
    >
      Change Image
    </button>

  </div>

  <div class="preview">

    <img class="image" :src="content" alt="" v-if="!uploading.url">

    <div class="uploading" v-if="uploading.url">
      <img class="image" :src="uploading.url" alt="">
      <div class="progress" :style="{ height: uploading.progress + '%'}"/>
    </div>

  </div>

  <input
    class="file-input"
    type="file"
    ref="file-input"
    @change="uploadImages($event)"
    accept="image/png, image/jpeg, image/gif, image/svg+xml"
  >

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.editor
  +margin-to-childs(.75rem)
  // text-align: center

.file-input
  display: none

.tools
  +chain()
  justify-content: space-between
  align-items: flex-end

  .filename
    font-size: .8rem
    color: $color-disabled

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
