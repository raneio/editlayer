<script>
import Item from '@/components/Item'
import _ from 'lodash'


export default {
  name: 'ItemsFromObject',

  components: {
    Item,
  },

  computed: {

    schema () {
      return this.$store.getters.schema
    },

    activeSchema () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let parentPath = _.chain(path).split('.').dropRight().join('.').value()
      let activeItem = _.get(this.schema, path)

      // console.log('path', path)
      // console.log('parentPath', parentPath)
      // console.log('activeItem', activeItem)

      if (_.get(activeItem, 'TYPE') === 'object') {
        // console.log('activeSchema = active')
        return activeItem
      } else if (!path || !parentPath) {
        // console.log('activeSchema = root')
        return this.schema
      } else {
        // console.log('activeSchema = parent')
        return _.get(this.schema, parentPath)
      }
    },

    files () {
      return this.$store.getters.files
    },

    items () {
      return _.filter(this.activeSchema, (value) => {
        if (_.isPlainObject(value)) {
          return value
        }
      })
    },

  },

  watch: {

    activeSchema (value) {
      this.findFirstItem()
    },

  },

  methods: {

    findFirstItem () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let firstItem = _.find(this.activeSchema, { TYPE: 'value' })

      if (!this.activeSchema || path !== this.activeSchema.PATH) {
        return false
      }

      if (firstItem && this.activeSchema.TYPE !== 'value') {
        let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
        this.$router.replace({ name: 'edit', params: { id: this.$route.params.id, path: firstItemPath }})
      }
    },

    goBack () {
      let backItem = this.breadcrumb[this.breadcrumb.length-2]
      if (backItem) {
        this.selectItem(backItem, 'back')
      }
    },

    selectItem (value, direction = false) {
      let path = _.replace(value.PATH, /\./g, '>')
      this.$router.push({ name: 'edit', params: { id: this.$route.params.id, path: path }})
    },

    isActive (path) {
      return !!(path === _.replace(this.$route.params.path, />/g, '.'))
    },

  },

  created () {
    this.findFirstItem()
  },

}
</script>


<template>
<section class="items">

  <Item
    v-for="item in items"
    :item="item"
    :selectItem="selectItem"
    :key="item.path"
  />

  <!-- <div
    class="button item"
    :class="{'-parent': item.TYPE === 'object' || item.TYPE === 'array', '-active': isActive(item.PATH)}"
    v-for="item in items"
    @click="selectItem(item)"
  >

    <div v-text="item.NAME"/>

    <div class="preview" v-if="item.preview">

      <div
        v-if="item.preview.type === 'text'"
        v-text="item.preview.content"
      />

      <div class="image" v-if="item.preview.type === 'image'">
        <img :src="item.preview.content" alt="">
      </div>

    </div>

  </div> -->

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

</style>
