<script>
import _ from 'lodash'
import Item from '@/components/panel/Item'
import BackButton from '@/components/navigation/BackButton'

export default {
  name: 'ItemsFromObject',

  // props: {
  //   selectItem: Function,
  // },

  components: {
    Item,
    BackButton,
  },

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeStructure () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let parentPath = _.chain(path).split('.').dropRight().join('.').value()
      let activeItem = _.get(this.structure, path)

      if (_.get(activeItem, '_type') === 'object') {
        return activeItem
      }
      else if (!path || !parentPath) {
        return this.structure
      }
      else {
        return _.get(this.structure, parentPath)
      }
    },

    items () {
      let items = {}

      _.each(this.activeStructure, (value, key) => {
        if (_.isPlainObject(value)) {
          items[key] = value
        }
      })

      return items
    },

  },

  watch: {

    activeStructure (value) {
      this.findFirstItem()
    },

  },

  methods: {

    findFirstItem () {
      if (!this.activeStructure) return false
      if (this.$route.name !== 'Content') return false

      let path = _.replace(this.$route.params.path, />/g, '.')
      if (path !== '' && path !== this.activeStructure._path) return false

      let firstItem = _.find(this.activeStructure, { _type: 'item' })

      if (firstItem && this.activeStructure._type !== 'item') {
        let firstItemPath = _.replace(firstItem._path, /\./g, '>')
        this.$router.replace({name: 'Content', params: {projectId: this.$route.params.projectId, path: firstItemPath}})
      }
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
<section class="items-from -object">

  <header class="header">
    <BackButton/>
  </header>

  <main class="main">

    <Item
      v-for="item in items"
      :item="item"
      :parentItems="items"
      :key="item.path"
    />

  </main>

</section>
</template>
