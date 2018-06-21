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
<section class="group -file-location">
  <heading-core mode="secondary">
    <h2>File location</h2>
    <p>You can find latest published JSON file from following URL address</p>
  </heading-core>

  <!-- <a class="link" :href="jsonUrl" :target="jsonTarget" v-text="jsonUrl"></a> -->

  <button-core
    :href="activeProject.jsonUrl"
    :target="jsonTarget"
    light
    class="json-link"
    mode="primary"
  >
    {{activeProject.jsonUrl}}
  </button-core>

  <section class="tools">

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

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.json-link
  overflow: hidden
  text-overflow: ellipsis
  text-transform: none
  padding: 0
  text-align: left

.tools
  +chain(1rem)

  .copied
    color: $color-success
    font-size: .8rem

</style>
