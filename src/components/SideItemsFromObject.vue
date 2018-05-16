<script>
import _ from 'lodash'
import SideItem from '@/components/SideItem'
import BackButton from '@/components/BackButton'

export default {
  name: 'SideItemsFromObject',

  props: {
    selectItem: Function,
  },

  components: {
    SideItem,
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

      if (_.get(activeItem, 'TYPE') === 'object') {
        return activeItem
      } else if (!path || !parentPath) {
        return this.structure
      } else {
        return _.get(this.structure, parentPath)
      }
    },

    items () {
      return _.filter(this.activeStructure, (value) => {
        if (_.isPlainObject(value)) {
          return value
        }
      })
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
      if (this.$store.getters.isMobile) return false

      let path = _.replace(this.$route.params.path, />/g, '.')
      if (path !== '' && path !== this.activeStructure.PATH) return false

      let firstItem = _.find(this.activeStructure, { TYPE: 'value' })

      if (firstItem && this.activeStructure.TYPE !== 'value') {
        let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
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
<section class="items -object">

  <header class="header">
    <BackButton/>
  </header>

  <SideItem
    v-for="item in items"
    :item="item"
    :selectItem="selectItem"
    :key="item.path"
  />

</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

</style>
