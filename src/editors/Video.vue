<script>
/**
 * Video Editor
 * @param {object} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.PLACEHOLDER
 */

import EditorBase from '@/editors/common/BaseEditor'
import urlParser from 'js-video-url-parser'
import _ from 'lodash'
import axios from 'axios'

export default {
  extends: EditorBase,

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

    provider () {
      if (!this.content) return false
      return this.content.provider
    },

    videoSrc () {
      if (this.provider === 'youtube') {
        return `https://www.youtube-nocookie.com/embed/${this.videoId}?rel=0`
      }
      else if (this.provider === 'vimeo') {
        return `https://player.vimeo.com/video/${this.videoId}?portrait=0`
      }
      else {
        return false
      }
    },

    placeholder () {
      return this.config.PLACEHOLDER ? this.config.PLACEHOLDER : 'e.g. https://www.youtube.com/watch?v=mN0zPOpADL4'
    },

  },

  methods: {

    initInput () {
      if (!this.content) {
        this.input = ''
        return null
      }

      let videoInfo = {
        provider: this.content.provider,
        id: this.content.id,
        mediaType: 'video',
      }
      this.input = urlParser.create({videoInfo: videoInfo})
    },

    saveVideo: async function () {
      let videoObj = urlParser.parse(this.input)

      if (!videoObj) {
        this.content = null
        return null
      }

      let video = {
        id: videoObj.id,
        provider: videoObj.provider,
      }

      video.thumbnail = await this.getThumbnail(video)
      this.content = video
    },

    getThumbnail: async function (video) {
      let thumbnail = null

      if (video.provider === 'youtube') {
        thumbnail = `http://img.youtube.com/vi/${video.id}/hqdefault.jpg`
      }
      else if (video.provider === 'vimeo') {
        try {
          let vimeoData = await axios.get(`https://vimeo.com/api/v2/video/${video.id}.json`)
          thumbnail = vimeoData.data[0].thumbnail_large
        }
        catch (error) {
          console.warn('Can\'t fetch Vimeo thumbnail')
        }
      }

      return thumbnail
    },

  },

  mounted () {
    this.initInput()
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
