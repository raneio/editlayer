<script>
/**
 * Select image editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.OPTIONS[].value
 * @param {string} config.OPTIONS[].url
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'SelectImageEditor',

  computed: {

    options () {
      if (!_.isObject(this.config.OPTIONS)) return false
      return this.config.OPTIONS
    },

  },

  methods: {

    selectImage (value) {
      this.content = value
    },

  },

}
</script>

<template>
<section class="editor -select-image">

  <alert-core mode="warning" v-if="!options">
    OPTIONS is required with "select-image" editor. Fix your schema.
  </alert-core>

  <section class="images" v-if="options">

    <div
      class="option"
      v-for="(option, index) in options"
      :key="index"
    >

      <img
        class="image"
        :class="{'-active': option.value === content}"
        :src="option.url"
        :alt="option.value"
        @click="selectImage(option.value)"
      >

    </div>

  </section>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.images
  +grid(1, 3rem)

  +breakpoint('large')
    +grid(2)

  +breakpoint('huge')
    +grid(3)

  .option
    display: flex
    justify-content: center
    align-items: flex-start

  .image
    border-radius: $radius
    cursor: pointer
    transition: box-shadow $time--small
    box-shadow: $shadow
    opacity: .8

    &:hover
      opacity: .9

    &.-active
      opacity: 1
      box-shadow: $shadow--large, 0 0 0 .3rem $color-info

</style>
