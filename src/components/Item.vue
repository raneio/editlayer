<script>
import _ from 'lodash'


export default {
  name: 'Item',

  props: {
    item: Object,
    selectItem: Function,
  },

  computed: {

    isActive () {
      if (this.$route.name !== 'edit') return false
      return !!(this.item.PATH === _.replace(this.$route.params.path, />/g, '.'))
    },

    isParent () {
      return this.item.TYPE === 'object' || this.item.TYPE === 'array'
    },

    isFile () {
      return this.item.TYPE === 'file'
    },

    isDraft () {
      return this.item.STATUS === 'draft'
    },

    preview () {

      if (_.includes(['image'], this.item.EDITOR)) {
        let content = `${this.$store.state.storageUrlPrefix}${this.$route.params.id}/${this.item.CONTENT}`

        // if (_.startsWith(content, 'https://editlayer.storage.googleapis.com/')) {
        //   let imageUrl = content.substring('https://editlayer.storage.googleapis.com/'.length)
        //   content = `https://editlayer.imgix.net/${imageUrl}?w=360&h=110&fit=crop&crop=faces`
        // }

        return {
          type: 'image',
          content: content,
        }
      // } else if (this.item.STATUS) {
      //   return {
      //       type: 'status',
      //       status: this.item.STATUS,
      //       class: `-${this.item.STATUS}`,
      //   }
      } else if (this.item.CONTENT) {
        let content = this.item.CONTENT

        if (this.item.CONTENT && this.item.CONTENT.length > 90) {
          content = this.item.CONTENT.substring(0, 90).trim() + '...'
        }

        return {
          type: 'text',
          content: content,
        }

      } else {
        return {}
      }
    },

  },

  methods: {

    // stringToTitle (text) {
    //   if (_.endsWith(text, '.json')) {
    //     text = text.slice(0, -5)
    //   }
    //
    //   return titleCase(text)
    // }

  },

}
</script>


<template>
<section
  class="button item"
  :class="{'-parent': isParent, '-file': isFile, '-active': isActive, '-draft': isDraft}"
  @click="selectItem(item)"
>

  <!-- <div
    v-if="item.STATUS === 'draft'"
    class="draft"
  >
    draft
  </div> -->

  <div v-text="item.NAME"></div>

  <div
    class="preview -text"
    v-if="preview.type === 'text'"
    v-text="preview.content"
  ></div>

  <div
    class="preview -image"
    v-if="preview.type === 'image'"
  >
    <img class="image" :src="preview.content" alt="">
  </div>

  <img class="icon" src="../assets/icon-forward.svg" alt="" v-if="isParent || isFile">

  <!-- <div
    class="preview -text"
    v-if="preview.type === 'status'"
  >
    Status:
    <span v-if="preview.status === 'draft'" class="status -draft">draft</span>
    <span v-if="preview.status === 'published'" class="status -published">published</span>
  </div> -->

  <!-- <div class="image" v-if="item.previewType === 'image'">
    <img :src="item.preview.content" alt="">
  </div> -->

</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.item
  text-transform: none
  font-weight: 600
  text-align: left
  position: relative
  background-color: $color-background
  color: $color-content
  display: block
  padding: .75em 1rem

  &::after
    content: ''
    position: absolute
    left: 0
    top: 0
    bottom: 0
    width: .5rem
    border-top-left-radius: $button-border-radius
    border-bottom-left-radius: $button-border-radius
    transition: opacity .2s
    opacity: 0

  &.-draft::after
    background-color: $color-draft
    opacity: 1

  &.-active::after
    background-color: $color-active
    opacity: 1

  &.-parent
    +chain(.75em)
    text-transform: uppercase
    color: $color-link
    font-size: .9em
    justify-content: flex-end
    padding-top: 1em
    padding-bottom: 1em

  &.-file
    +chain(.75em)
    justify-content: space-between
    padding-top: 1em
    padding-bottom: 1em

  .content
    flex-grow: 1

  .preview

    &.-text
      font-size: .8em
      color: $color-disabled
      font-weight: 400

    &.-image
      margin-left: -1rem
      margin-right: -1rem
      margin-bottom: -.75em
      margin-top: .4em
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

</style>
