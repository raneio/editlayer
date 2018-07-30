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

        // if (_.startsWith(imageUrl, 'https://cdn.editlayer.com/')) {
        //   imageUrl = _.replace(imageUrl, 'cdn', 'img') + '?w=360&h=110&fit=crop&crop=faces'
        // }

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
  class="item button -versatile"
  :class="{
    '-parent': isParent,
    '-active': isActive,
    '-draft': isDraft,
  }"
  @click="selectItem(item)"
>

  <h2 class="heading">

    <div class="text">
      <span v-text="item.NAME"></span>
      <span v-if="isDraft" class="draft">draft</span>
      <!-- <svg v-if="isDraft" width="18" height="13" viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg">
        <title>Draft</title>
        <path d="M7.437 1.938a3.47 3.47 0 0 0-1.763.464c-.538.31-.962.734-1.272 1.272a3.47 3.47 0 0 0-.465 1.764v.027A2.989 2.989 0 0 0 2.064 6.49a2.961 2.961 0 0 0-.752 2.01c0 .547.137 1.057.41 1.531.274.474.648.848 1.122 1.121.474.274.984.41 1.531.41h9.187c.73 0 1.35-.255 1.86-.765s.765-1.13.765-1.86c0-.729-.255-1.348-.765-1.859a2.531 2.531 0 0 0-1.86-.765h-.246c.164-.274.246-.566.246-.875 0-.493-.168-.907-.505-1.245a1.691 1.691 0 0 0-1.245-.505c-.437 0-.82.136-1.148.41a3.384 3.384 0 0 0-1.258-1.559 3.394 3.394 0 0 0-1.969-.601zm0-1.313c.748 0 1.45.164 2.106.492A5.13 5.13 0 0 1 11.21 2.43c.2-.037.401-.055.601-.055.803 0 1.5.273 2.092.82.593.547.916 1.222.971 2.024a3.813 3.813 0 0 1 1.9 1.435c.483.684.725 1.445.725 2.284a3.8 3.8 0 0 1-.533 1.968 4.013 4.013 0 0 1-1.436 1.436 3.8 3.8 0 0 1-1.969.533H4.375a4.28 4.28 0 0 1-2.188-.588 4.344 4.344 0 0 1-1.6-1.6A4.28 4.28 0 0 1 0 8.5c0-.893.25-1.709.752-2.447a4.26 4.26 0 0 1 1.982-1.6A4.586 4.586 0 0 1 4.39 1.705 4.69 4.69 0 0 1 7.437.625zm1.094 9.297a.316.316 0 0 1-.095.232.316.316 0 0 1-.233.096h-.656a.316.316 0 0 1-.233-.096.316.316 0 0 1-.095-.232v-3.8L5.715 7.624a.26.26 0 0 1-.219.11.34.34 0 0 1-.246-.11l-.438-.437a.34.34 0 0 1-.109-.247.26.26 0 0 1 .11-.218l2.843-2.844a.26.26 0 0 1 .219-.11.26.26 0 0 1 .219.11l2.843 2.844a.26.26 0 0 1 .11.218.34.34 0 0 1-.11.247l-.437.437a.34.34 0 0 1-.246.11.26.26 0 0 1-.219-.11L8.531 6.121v3.8z" fill="#EABE00" fill-rule="evenodd"/>
      </svg> -->
    </div>

    <svg width="11" height="20" viewBox="0 0 11 20" xmlns="http://www.w3.org/2000/svg" v-if="isParent">
      <path d="M.773.297a.465.465 0 0 1 .344-.129c.143 0 .258.043.344.129l9.11 9.11c.085.085.128.2.128.343a.465.465 0 0 1-.129.344l-9.11 9.11a.465.465 0 0 1-.343.128.465.465 0 0 1-.344-.129L.43 18.86a.465.465 0 0 1-.13-.343c0-.144.044-.273.13-.387L8.852 9.75.43 1.371A.628.628 0 0 1 .3.984C.3.841.345.727.43.641L.773.297z" fill="#252525" fill-rule="evenodd"/>
    </svg>

  </h2>

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
@import '../sass/features'

.item

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
    background-color: $color-blue
    opacity: 1

  .heading
    font-size: 1rem
    font-weight: 600

    .text
      +chain(.25rem)

    .draft
      color: $color-yellow
      font-size: .6rem

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
        color: $color-green

      &.-isOff
        color: $color-red

    &.-image
      position: relative
      background-image: url('../assets/image-background.png')
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
