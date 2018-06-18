<script>
import EditorBase from '@/editors/common/BaseEditor'
import getVideoId from 'get-video-id'
import _ from 'lodash'
import axios from 'axios'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the schema (read-only)
  name: 'VideoEditor',

  data () {
    return {
      input: '',
    }
  },

  watch: {

    input: _.debounce(function () {
      this.saveVideo()
    }, 500),

  },

  computed: {

    videoId () {
      if (!this.content) return false
      return this.content.id
    },

    service () {
      if (!this.content) return false
      return this.content.service
    },

    videoSrc () {
      if (this.service === 'youtube') {
        return `https://www.youtube-nocookie.com/embed/${this.videoId}?rel=0`
      }
      else if (this.service === 'vimeo') {
        return `https://player.vimeo.com/video/${this.videoId}?portrait=0`
      }
      else {
        return false
      }
    },

    placeholder () {
      return this.config.PLACEHOLDER ? this.config.PLACEHOLDER : 'e.g. https://www.youtube.com/watch?v=mN0zPOpADL4  OR  https://vimeo.com/265010648'
    },

  },

  methods: {

    setInput () {
      if (this.service === 'youtube') {
        this.input = `https://www.youtube.com/watch?v=${this.videoId}`
      }
      else if (this.service === 'vimeo') {
        this.input = `https://vimeo.com/${this.videoId}`
      }
    },

    saveVideo: async function () {
      let videoObj = getVideoId(this.input)

      if (videoObj.service === 'youtube') {
        videoObj.thumbnail = `http://img.youtube.com/vi/${videoObj.id}/hqdefault.jpg`
      }

      if (videoObj.service === 'vimeo') {
        try {
          let videoData = await axios.get(`https://vimeo.com/api/v2/video/${videoObj.id}.json`)
          videoObj.thumbnail = videoData.data[0].thumbnail_large
        }
        catch (error) {
          videoObj.thumbnail = null
        }
      }

      this.content = videoObj
    },

  },

  mounted () {
    this.setInput()
  },

  // getVideoId('https://www.youtube.com/watch?v=8rSH8-pbHZ0')

}
</script>

<template>
<section class="editor -video">
  <input
    class="input"
    v-model="input"
    :placeholder="placeholder"
  >

  <figure class="preview" v-if="videoSrc">
    <iframe class="video" :src="videoSrc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </figure>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.editor.-video
  +gap()

.preview
  padding-bottom: 56.25%
  position: relative
  border-radius: $input-border-radius
  overflow: hidden
  box-shadow: 0 .5em 2em 0 mix($color-black, transparent, 15%), 0 0 .4em 0 mix(black, transparent, 10%)
  background-color: black

  .video
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%

</style>
