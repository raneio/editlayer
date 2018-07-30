<script>
/**
 * Video editor
 * @param {object} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.PLACEHOLDER
 * @param {string} input - Video URL of Youtube or Vimeo
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

    videoSrc () {
      if (_.get(this.content, 'type') === 'video/youtube') {
        return `https://www.youtube-nocookie.com/embed/${this.content.videoId}?rel=0`
      }
      else if (_.get(this.content, 'type') === 'video/vimeo') {
        return `https://player.vimeo.com/video/${this.content.videoId}?portrait=0`
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
      if (!_.has(this.content, 'type') || !_.has(this.content, 'videoId')) {
        this.input = ''
        this.content = {}
        return null
      }

      let provider = this.content.type.split('/')[1].trim()

      let videoInfo = {
        provider: provider,
        id: this.content.videoId,
        mediaType: 'video',
      }

      this.input = urlParser.create({videoInfo: videoInfo})
    },

    saveVideo: async function () {
      let videoInfo = urlParser.parse(this.input)

      if (!videoInfo) {
        this.content = {}
        return null
      }

      let url = urlParser.create({
        videoInfo: videoInfo,
      })

      let video = {
        videoId: videoInfo.id,
        type: `video/${videoInfo.provider}`,
        url: url,
      }

      video.thumbnail = await this.getThumbnail(video)
      this.content = video
    },

    getThumbnail: async function (video) {
      let thumbnail = null

      if (video.type === 'video/youtube') {
        thumbnail = `http://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
      }
      else if (video.type === 'video/vimeo') {
        try {
          let vimeoData = await axios.get(`https://vimeo.com/api/v2/video/${video.videoId}.json`)
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
@import '../sass/core/mixins'

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
