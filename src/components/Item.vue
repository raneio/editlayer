<script>
import _ from 'lodash'
import titleCase from 'title-case'


export default {
  name: 'Item',

  props: {
    item: Object,
    selectItem: Function,
  },

  computed: {

    isActive () {
      return !!(this.item.PATH === _.replace(this.$route.params.path, />/g, '.'))
    },

    isParent () {
      return this.item.TYPE === 'object' || this.item.TYPE === 'array' || this.item.TYPE === 'file'
    },

    preview () {
      if (_.includes(['text', 'textarea'], this.item.EDITOR)) {

        let content = ''

        if (this.item.CONTENT && this.item.CONTENT.length <= 90) {
          content = this.item.CONTENT
        } else if (this.item.CONTENT && this.item.CONTENT.length > 90) {
          content = this.item.CONTENT.substring(0, 90).trim() + '...'
        }

        return {
          type: 'text',
          content: content,
        }
      } else if (_.includes(['image'], this.item.EDITOR)) {
        return {
          type: 'image',
          content: this.item.CONTENT,
        }
      } else {
        return {}
      }
    },

  },

  methods: {

    stringToTitle (text) {
      if (_.endsWith(text, '.json')) {
        text = text.slice(0, -5)
      }

      return titleCase(text)
    }

  },

}
</script>


<template>
<div
  class="button item"
  :class="{'-parent': isParent, '-active': isActive}"
  @click="selectItem(item)"
>

  <div v-text="stringToTitle(item.NAME)"/>

  <div
    class="preview -text"
    v-if="preview.type === 'text'"
    v-text="preview.content"
  />

  <div
    class="preview -image"
    v-if="preview.type === 'image'"
  >
    <img :src="preview.content + '?w=350&h=110&fit=crop'" alt="">
  </div>

  <!-- <div class="image" v-if="item.previewType === 'image'">
    <img :src="item.preview.content" alt="">
  </div> -->

</div>
</template>
