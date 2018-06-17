<script>
import _ from 'lodash'

export default {
  name: 'FileLocation',

  data () {
    return {
      copied: false,
    }
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    jsonUrl () {
      return this.$store.getters.jsonUrl
    },

    jsonTarget () {
      if (!this.activeProject) return false
      return this.activeProject.projectId
    },

    // copyText () {
    //   return (this.copied === false) ? 'Copy URL' : 'Copied to the clipboard'
    // },

  },

  methods: {

    onCopyUrl () {
      this.copied = true
      this.quitCopied()
    },

    quitCopied: _.debounce(function () {
      this.copied = false
    }, 4000),

    onCopyUrlError () {

    },

  },

}
</script>

<template>
<section class="group -file-location">
  <header class="heading -feature">
    <h2 class="heading">File location</h2>
    <p class="tagline">You can find latest published JSON file from following URL address</p>
  </header>

  <a class="link" :href="jsonUrl" :target="jsonTarget" v-text="jsonUrl"></a>

  <button class="button -link"
    :disabled="copied"
    v-clipboard:copy="jsonUrl"
    v-clipboard:success="onCopyUrl"
    v-clipboard:error="onCopyUrlError"
  >
    <span v-if="copied === false"><icon name="regular/copy"/> Copy URL</span>
    <span v-if="copied === true"><icon name="regular/thumbs-up"/> Copied to the clipboard</span>
  </button>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.link
  display: block
  font-weight: 700
  overflow: hidden
  text-overflow: ellipsis

.button

  .fa-icon
    height: 1rem

  &:disabled
    cursor: default
    text-transform: none
    font-weight: $content-font-weight

</style>
