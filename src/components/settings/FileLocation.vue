<script>
import _ from 'lodash'
import copy from 'copy-to-clipboard'

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

    jsonTarget () {
      return `json-${this.activeProject.id}`
    },

    isPublished () {
      return !_.isEmpty(this.activeProject.publishedVersion)
    },

  },

  methods: {

    copyUrl () {
      copy(this.jsonUrl)
      this.copied = true
      this.quitCopied()
    },

    quitCopied: _.debounce(function () {
      this.copied = false
    }, 4000),

  },

}
</script>

<template>
<section class="file-location">
  <heading-core mode="secondary">
    <h2>JSON location</h2>
    <p>You can find latest published JSON file from the following URL address</p>
  </heading-core>

  <button-core
    :href="activeProject.jsonUrl"
    :target="jsonTarget"
    light
    class="json-link"
    mode="primary"
    v-if="isPublished"
  >
    {{activeProject.jsonUrl}}
  </button-core>

  <section class="tools" v-if="isPublished">

    <button-core light @click.native="copyUrl">
      <icon name="regular/copy"/>
      <span>Copy URL</span>
    </button-core>

    <transition name="fade--fast">
      <span class="copied" v-show="copied === true">
        Copied to the clipboard
      </span>
    </transition>

  </section>

  <alert-core mode="warning" v-if="!isPublished">
    You haven't published content. Click the "Publish" button at the top-left corner.
  </alert-core>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.file-location
  +gap()

.json-link
  overflow: hidden
  text-overflow: ellipsis
  text-transform: none
  padding: 0
  text-align: left
  max-width: 100%

.tools
  +chain(1rem)

  .copied
    color: $color-success
    font-size: .8rem

</style>
