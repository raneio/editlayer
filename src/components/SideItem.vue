<script>
import _ from 'lodash'

export default {
  name: 'Item',

  props: {
    item: Object,
    selectItem: Function
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

      if (_.includes(['image'], this.item.EDITOR)) {

        let imageUrl = this.item.CONTENT

        if (_.startsWith(imageUrl, 'https://cdn.editlayer.com/')) {
          imageUrl = _.replace(imageUrl, 'cdn', 'img') + '?w=360&h=110&fit=crop&crop=faces'
        }

        return {
          type: 'image',
          content: imageUrl
        }
      }
      else if (this.item.CONTENT) {
        let content = this.item.CONTENT

        let div = document.createElement('div')
        div.innerHTML = content

        content = div.textContent || div.innerText || ''

        if (content && content.length > 70) {
          content = content.substring(0, 70).trim() + '...'
        }

        return {
          type: 'text',
          content: content
        }
      }
      else {
        return {}
      }
    }

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
    <div v-text="item.NAME"></div>
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
  // text-transform: none
  // font-weight: 600
  // text-align: left
  // position: relative
  // background-color: $color-background
  // color: $color-content
  // display: block
  // padding: 0

  // &:hover
  //   color: mix($color-black, white, 80%)

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

  // &.-draft::after
  //   background-color: $color-draft
  //   opacity: 1

  &.-active::after
    background-color: $color-blue
    opacity: 1

  .heading
    font-size: 1rem
    font-weight: 600

  .parent
    +chain()
    align-items: center
    justify-content: space-between
    padding: .5rem 1rem

  .content
    flex-grow: 1

  // .title
  //   overflow: hidden
  //   background-color: mix($color-violet, white, 2%)
  //   border-bottom: 1px solid mix($color-violet, white, 8%)
  //   padding: .5rem 1rem
  //   border-top-left-radius: $button-border-radius
  //   border-top-right-radius: $button-border-radius

  .content
    overflow: hidden

    &.-text
      font-size: .8em
      color: $color-gray
      font-weight: 400
      padding: .5rem 1rem

    &.-image
      position: relative
      background-image: url('../assets/image-background.png')
      background-position: center
      border-bottom-left-radius: $button-border-radius
      border-bottom-right-radius: $button-border-radius
      height: 6em
      display: flex
      justify-content: center
      align-items: center

      .image
        border-bottom-left-radius: $button-border-radius
        border-bottom-right-radius: $button-border-radius
        height: 6em
        width: 100%
        object-fit: cover
        filter: brightness(95%)

</style>
