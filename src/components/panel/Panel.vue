<script>
import _ from 'lodash'
import anime from 'animejs'
import ItemsFromObject from '@/components/panel/ItemsFromObject'
import ItemsFromArray from '@/components/panel/ItemsFromArray'

export default {
  name: 'SidePanel',

  components: {
    ItemsFromObject,
    ItemsFromArray,
  },

  computed: {

    projectId () {
      return this.$route.params.projectId
    },

    schema () {
      return this.$store.getters.schema
    },

    activeSchema () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (_.has(this.schema, path)) {
        return _.get(this.schema, path)
      }
      else {
        return {}
      }
    },

    activeType () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let grandparent = _.get(this.schema, _.chain(path).split('.').dropRight(2).join('.').value())

      if (!this.projectId) {
        return 'project'
      }
      else if (this.activeSchema && this.activeSchema._type === 'array') {
        return 'array'
      }
      else if (grandparent && this.activeSchema && grandparent._type === 'array' && this.activeSchema._type === 'value') {
        return 'array'
      }
      else {
        return 'object'
      }
    },

  },

  watch: {

    activeSchema (value) {
      this.redirectToParentIfInvalidPath()
    },

  },

  methods: {

    selectItem (item) {
      let projectId = (item.FILE_ID) ? item.FILE_ID : this.projectId
      let routeName = (item._type === 'value') ? 'Content' : this.$route.name
      let path = _.replace(item._path, /\./g, '>')

      if (item._type === 'value') {
        this.$router.push({name: routeName, params: {projectId: projectId, path: path}})
        return false
      }

      if (routeName === 'Dashboard') {
        routeName = (this.$route.params.view === 'schema') ? 'Schema' : 'Content'
      }

      anime.timeline()
        .add({
          targets: '.panel > .content',
          translateX: '-100%',
          opacity: 0,
          easing: 'linear',
          duration: 100,
        })
        .add({
          targets: '.panel > .content',
          translateX: '100%',
          duration: 0,
          complete: (anim) => {
            if (path) {
              this.$router.push({name: routeName, params: {projectId: projectId, path: path}})
            }
            else {
              this.$router.push({name: routeName, params: {projectId: projectId}})
            }
          },
        })
        .add({
          targets: '.panel > .content',
          translateX: 0,
          opacity: 1,
          easing: 'linear',
          duration: 100,
        })
    },

    redirectToParentIfInvalidPath () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let pathExist = _.has(this.schema, path)

      if (_.isEmpty(this.schema) || pathExist === true) return false

      let parentPath = _.chain(this.$route.params.path).split('>').slice(0, -1).join('>').value()

      if (parentPath) {
        this.$router.replace({name: this.$route.name, params: {projectId: this.projectId, path: parentPath}})
      }
      else {
        this.$router.replace({name: this.$route.name, params: {projectId: this.projectId}})
      }
    },

  },

}
</script>

<template>
<aside class="panel">
  <ItemsFromObject :selectItem="selectItem" v-if="activeType === 'object'"/>
  <ItemsFromArray :selectItem="selectItem" v-if="activeType === 'array'"/>
</aside>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.panel
  background-image: linear-gradient(to right, $color-gray--lightest, $color-gray--lighter)
  //

.panel /deep/

  .items-from
    display: flex
    flex-direction: column
    height: 100%

    > .header
      +chain(1rem)
      justify-content: space-between
      align-items: center
      transition: opacity .2s
      border-bottom: 1px solid $hr-color
      height: 3rem
      padding: 1.25rem

    > .content
      +gap(1.5rem)
      display: flex
      flex-direction: column
      overflow-y: auto
      padding: 2rem 1.25rem

      // &::before,
      // &::after
      //   content: ''
      //   position: absolute
      //   left: 0
      //   width: 100%
      //   height: .5rem
      //   z-index: 1
      //
      // &::before
      //   top: 0
      //   background-image: linear-gradient(to bottom, $color-gray--lighter, transparent)
      //
      // &::after
      //   bottom: 0
      //   background-image: linear-gradient(to top, $color-gray--lighter, transparent)
      //
      // > .content-scroll

</style>
