<script>
/**
 * Color Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 */

import EditorBase from '@/editors/common/BaseEditor'
import iro from '@jaames/iro'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'ColorEditor',

  data () {
    return {
      color: null,
      colorPicker: null,
      // drag: false,
    }
  },

  watch: {

    color () {
      this.saveColor()
      this.colorPicker.color.hexString = this.color
    },

    // content () {
    //   this.color = this.content
    // },

  },

  // computed: {
  //
  //   colorGradient () {
  //     return `linear-gradient(to right, #ffffff, ${this.content})`
  //   },
  //
  // },

  methods: {

    // pickColor () {
    //   console.log('pickColor')
    //   this.drag = true
    // },

    initPicker () {
      let size = 200

      this.colorPicker = new iro.ColorPicker(this.$refs.colorPicker, {
        width: size,
        height: size * 1.15,
        color: this.color,
        sliderMargin: size * 0.05,
        sliderHeight: size * 0.1,
        padding: 0,
        // borderWidth: 2,
        anticlockwise: true,
      })

      this.colorPicker.on('color:change', (color) => {
        this.color = color.hexString
      })
    },

    saveColor: _.debounce(function () {
      this.content = this.color
    }, 500),

  },

  mounted () {
    this.initPicker()

    if (this.content !== null) {
      this.color = this.content
    }
    else {
      this.color = '#dddddd'
    }
  },
}
</script>

<template>
<section class="editor -color">

  <div class="tools">
    <div class="picker" ref="colorPicker"></div>
  </div>

  <div class="info">
    <div class="preview" :style="{backgroundColor: color}" @click="$refs.colorInput.click()"></div>
    <input type="text" v-model="color">
    <input type="color" ref="colorInput" v-model="color" v-show="false">
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../core/sass/mixins'

.editor.-color
  display: flex
  flex-direction: column
  align-items: flex-start
  +gap()

  +breakpoint('large')
    +chain(3rem)
    +gap(0)
    flex-direction: row
    align-items: flex-start

.info
  +gap(.5rem)
  width: 100%

  .preview
    height: 10rem
    border-radius: $input-border-radius
    cursor: pointer

  +breakpoint('large')
    width: 18rem

.tools
  +gap(1rem)
  +center()
  background-color: $color-gray--lightest
  padding: 2rem
  border-radius: $input-border-radius
  width: 100%
  box-shadow: 0 .1rem .2rem 0 mix($color-black, transparent, 15%), 0 .75rem 3rem 0 mix($color-black, transparent, 11%)

  +breakpoint('large')
    width: auto

.picker /deep/
  svg
    max-width: none

</style>
