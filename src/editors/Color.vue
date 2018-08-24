<!--
Copyright 2018 Reduce Finland

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

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
      license: 'partner',
    }
  },

  watch: {

    color () {
      this.saveColor()
      this.colorPicker.color.hexString = this.color
    },

  },

  methods: {

    initPicker () {
      let size = 200

      this.colorPicker = new iro.ColorPicker(this.$refs.colorPicker, {
        width: size,
        height: size * 1.15,
        color: this.color,
        sliderMargin: size * 0.05,
        sliderHeight: size * 0.1,
        padding: 0,
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
@import '../sass/core/mixins'

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
