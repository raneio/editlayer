<script>
import _ from 'lodash'
import Item from '@/components/panel/Item'
import BackButton from '@/components/navigate/BackButton'

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

      if (_.get(activeItem, '_type') === 'object') {
        return activeItem
      }
      else if (!path || !parentPath) {
        return this.schema
      }
      else {
        return _.get(this.schema, parentPath)
      }
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
      if (this.$route.name !== 'Content') return false
      if (this.$store.getters.isMobile) return false

      let path = _.replace(this.$route.params.path, />/g, '.')
      if (path !== '' && path !== this.activeSchema._path) return false

      let firstItem = _.find(this.activeSchema, { _type: 'value' })

      if (firstItem && this.activeSchema._type !== 'value') {
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

  <section class="content">

    <Item
      v-for="item in items"
      :item="item"
      :selectItem="selectItem"
      :key="item.path"
    />

  </section>

</section>
</template>
