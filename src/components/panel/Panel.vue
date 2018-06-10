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

    structure () {
      return this.$store.getters.structure
    },

    activeStructure () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (_.has(this.structure, path)) {
        return _.get(this.structure, path)
      }
      else {
        return {}
      }
    },

    activeType () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let grandparent = _.get(this.structure, _.chain(path).split('.').dropRight(2).join('.').value())

      if (!this.projectId) {
        return 'project'
      }
      else if (this.activeStructure && this.activeStructure.TYPE === 'array') {
        return 'array'
      }
      else if (grandparent && this.activeStructure && grandparent.TYPE === 'array' && this.activeStructure.TYPE === 'value') {
        return 'array'
      }
      else {
        return 'object'
      }
    },

  },

  watch: {

    activeStructure (value) {
      this.redirectToParentIfInvalidPath()
    },

  },

  methods: {

    selectItem (item) {
      let projectId = (item.FILE_ID) ? item.FILE_ID : this.projectId
      let routeName = (item.TYPE === 'value') ? 'Content' : this.$route.name
      let path = _.replace(item.PATH, /\./g, '>')

      if (item.TYPE === 'value') {
        this.$router.push({name: routeName, params: {projectId: projectId, path: path}})
        return false
      }

      if (routeName === 'Dashboard') {
        routeName = (this.$route.params.view === 'structure') ? 'Structure' : 'Content'
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
      let pathExist = _.has(this.structure, path)

      if (_.isEmpty(this.structure) || pathExist === true) return false

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
  <div class="content">
    <ItemsFromObject :selectItem="selectItem" v-if="activeType === 'object'"/>
    <ItemsFromArray :selectItem="selectItem" v-if="activeType === 'array'"/>
  </div>
</aside>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.panel
  background-image: linear-gradient(to right, $color-gray--lightest, $color-gray--lighter)
  padding: 1.25rem
  overflow-y: auto

.panel /deep/

  > .header
    +chain(1rem)
    justify-content: space-between
    align-items: center
    transition: opacity .2s
    margin-top: -1rem
    font-size: .9rem
    border-bottom: 1px solid mix($color-white, $color-black, 90%)
    height: 3rem

  .items
    +gap(1rem)

    .item
      max-width: 28rem
      margin-left: auto
      margin-right: auto

</style>
