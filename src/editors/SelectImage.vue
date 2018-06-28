<script>
/**
 * Select image editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.OPTIONS[].VALUE
 * @param {string} config.OPTIONS[].LABEL
 * @param {string} config.OPTIONS[].IMAGE
 */

import EditorBase from '@/editors/common/BaseEditor'
// import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'SelectImageEditor',

  methods: {

    selectImage (value) {
      this.content = value
    },

    // label (option) {
    //   return option.LABEL ? option.LABEL : option.VALUE
    // },

  },

}
</script>

<template>
<section class="editor -select-image">

  <div
    class="option"
    v-for="(option, index) in config.OPTIONS"
    :key="index"
  >

    <img
      class="image"
      :class="{'-active': option.VALUE === content}"
      :src="option.IMAGE"
      :alt="option.VALUE"
      @click="selectImage(option.VALUE)"
    >

  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../core/sass/mixins'

.editor.-select-image
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
