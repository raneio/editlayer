<script>
import _ from 'lodash'
import SideItem from '@/components/SideItem'
import BackButton from '@/components/BackButton'

export default {
  name: 'SideItemsFromObject',

  props: {
    selectItem: Function
  },

  components: {
    SideItem,
    BackButton
  },

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeStructure () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let parentPath = _.chain(path).split('.').dropRight().join('.').value()
      let activeItem = _.get(this.structure, path)

      // console.log('path', path)
      // console.log('parentPath', parentPath)
      // console.log('activeItem', activeItem)

      if (_.get(activeItem, 'TYPE') === 'object') {
        // console.log('activeStructure = active')
        return activeItem
      } else if (!path || !parentPath) {
        // console.log('activeStructure = root')
        return this.structure
      } else {
        // console.log('activeStructure = parent')
        return _.get(this.structure, parentPath)
      }
    },

    // files () {
    //   return this.$store.getters.projects
    // },

    items () {
      return _.filter(this.activeStructure, (value) => {
        if (_.isPlainObject(value)) {
          return value
        }
      })
    }

  },

  watch: {

    activeStructure (value) {
      this.findFirstItem()
    }

  },

  methods: {

    findFirstItem () {
      if (!this.activeStructure) return false
      if (this.$route.name !== 'Content') return false

      let path = _.replace(this.$route.params.path, />/g, '.')
      if (path !== '' && path !== this.activeStructure.PATH) return false

      let firstItem = _.find(this.activeStructure, { TYPE: 'value' })

      // if (!firstItem && _.size(this.activeStructure) === 1) {
      //   firstItem = _.find(this.activeStructure)
      // }

      if (firstItem && this.activeStructure.TYPE !== 'value') {
        let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
        this.$router.replace({name: 'Content', params: {projectId: this.$route.params.projectId, path: firstItemPath}})
      }
    },

    // selectItem (value) {
    //   let routeName = this.$route.name
    //
    //   if (value.TYPE === 'value') {
    //     routeName = 'Content'
    //   }
    //
    //   let path = _.replace(value.PATH, /\./g, '>')
    //   this.$router.push({ name: routeName, params: { projectId: this.$route.params.projectId, path: path }})
    // },

    isActive (path) {
      return !!(path === _.replace(this.$route.params.path, />/g, '.'))
    }

  },

  created () {
    this.findFirstItem()
  }

}
</script>

<template>
<section class="items">

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

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

</style>
