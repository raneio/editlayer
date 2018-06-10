<script>
import _ from 'lodash'
import Color from 'color'

export default {
  name: 'Item',

  props: {
    item: Object,
    selectItem: Function,
  },

  computed: {

    isActive () {
      if (this.$route.name !== 'Content') return false
      return !!(this.item.PATH === _.replace(this.$route.params.path, />/g, '.'))
    },

    isParent () {
      return this.item.TYPE === 'object' || this.item.TYPE === 'array'
    },

    isDraft () {
      return this.item.STATUS === 'draft'
    },

    preview () {
      if (this.item.EDITOR === 'image') {
        let imageUrl = this.item.CONTENT

        if (_.startsWith(imageUrl, 'https://cdn.editlayer.com/')) {
          imageUrl = _.replace(imageUrl, 'cdn', 'img') + '?w=360&h=110&fit=crop&crop=faces'
        }

        return {
          type: 'image',
          content: imageUrl,
        }
      }
      else if (this.item.EDITOR === 'code') {
        let content = this.item.CONTENT

        if (content && content.length > 60) {
          content = content.substring(0, 57).trim() + '…'
        }

        return {
          type: 'code',
          content: content,
        }
      }
      else if (this.item.EDITOR === 'color') {
        let content = this.item.CONTENT
        let color = Color(this.item.CONTENT)

        return {
          type: 'color',
          content: content,
          color: color,
          isDark: color.isDark(),
        }
      }
      else if (this.item.EDITOR === 'switch') {
        let content = null

        if (this.item.CONTENT === true) {
          content = 'ON'
        }
        else if (this.item.CONTENT === false) {
          content = 'OFF'
        }

        return {
          type: 'switch',
          content: content,
        }
      }
      else if (this.item.CONTENT) {
        let content = this.item.CONTENT

        let div = document.createElement('div')
        div.innerHTML = content

        content = div.textContent || div.innerText || ''

        if (content && content.length > 70) {
          content = content.substring(0, 67).trim() + '…'
        }

        return {
          type: 'text',
          content: content,
        }
      }
      else {
        return {}
      }
    },

  },

}
</script>

<template>
<section
  class="card -link item"
  :class="{
    '-parent': isParent,
    '-active': isActive,
    '-draft': isDraft,
  }"
  @click="selectItem(item)"
>

  <header class="header">

    <h2 class="heading" v-text="item.NAME"/>

    <div v-if="isDraft" class="draft">draft</div>

    <div v-if="isParent" class="spacer"/>
    <icon v-if="isParent" name="chevron-right"/>

  </header>

  <div
    class="content -text"
    v-if="preview.type === 'text'"
    v-text="preview.content"
  />

  <div
    class="content -code"
    v-if="preview.type === 'code'"
    v-text="preview.content"
  />

  <div
    class="content -color"
    :class="{'-isDark': preview.isDark}"
    :style="{'backgroundColor': preview.color}"
    v-if="preview.type === 'color'"
    v-text="preview.content"
  />

  <div
    class="content -switch"
    :class="{'-isOn': preview.content === 'ON', '-isOff': preview.content === 'OFF'}"
    v-if="preview.type === 'switch'"
    v-text="preview.content"
  />

  <div
    class="content -image"
    v-if="preview.type === 'image'"
  >
    <img class="image" :src="preview.content" alt="" v-if="preview.content !== null">
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.item
  position: relative

  &::after
    content: ''
    position: absolute
    left: 0
    top: 0
    bottom: 0
    width: .45rem
    border-top-left-radius: $button-border-radius
    border-bottom-left-radius: $button-border-radius
    transition: opacity .2s
    opacity: 0

  &.-active::after
    background-color: $color-info
    opacity: 1

  .heading
    font-size: 1rem
    font-weight: 600

    .text
      +chain(.25rem)

  .draft
    color: $color-warning
    font-size: .75rem

  .content
    flex-grow: 1

  .content
    font-size: .8em
    overflow: hidden
    padding: .35rem 1rem
    font-weight: 400
    color: $color-gray
    opacity: .8
    transition: opacity .2s

    &.-code
      font-size: .7em
      font-family: monospace
      background-color: $color-gray
      color: mix($color-gray, $color-white, 20%)

    &.-color
      font-family: monospace
      color: $color-black

      &.-isDark
        color: $color-white

    &.-switch
      font-size: 1rem
      font-weight: 900

      &.-isOn
        color: $color-success

      &.-isOff
        color: $color-danger

    &.-image
      position: relative
      background-image: url('../../assets/image-background.png')
      background-position: center
      border-bottom-left-radius: $button-border-radius
      border-bottom-right-radius: $button-border-radius
      height: 5em
      display: flex
      justify-content: center
      align-items: center
      padding: 0

      .image
        border-bottom-left-radius: $button-border-radius
        border-bottom-right-radius: $button-border-radius
        height: 6em
        width: 100%
        object-fit: cover
        filter: brightness(93%)

  &:hover

    .content
      opacity: 1

</style>
