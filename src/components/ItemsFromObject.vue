<script>
import _ from 'lodash'
import Item from '@/components/Item'
import BackButton from '@/components/BackButton'


export default {
  name: 'ItemsFromObject',

  props: {
    selectItem: Function,
  },

  components: {
    Item,
    BackButton,
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
      if (!this.activeSchema) return false
      if (this.$route.name !== 'edit') return false

      let path = _.replace(this.$route.params.path, />/g, '.')
      if (path !== '' && path !== this.activeSchema.PATH) return false

      let firstItem = _.find(this.activeSchema, { TYPE: 'value' })

      // if (!firstItem && _.size(this.activeSchema) === 1) {
      //   firstItem = _.find(this.activeSchema)
      // }

      if (firstItem && this.activeSchema.TYPE !== 'value') {
        let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
        this.$router.replace({ name: 'edit', params: { id: this.$route.params.id, path: firstItemPath }})
      }
    },

    // selectItem (value) {
    //   let routeName = this.$route.name
    //
    //   if (value.TYPE === 'value') {
    //     routeName = 'edit'
    //   }
    //
    //   let path = _.replace(value.PATH, /\./g, '>')
    //   this.$router.push({ name: routeName, params: { id: this.$route.params.id, path: path }})
    // },

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

  <header class='header'>
    <BackButton/>
  </header>

  <Item
    v-for="item in items"
    :item="item"
    :selectItem="selectItem"
    :key="item.path"
  />

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

</style>
