<script>
import _ from 'lodash'
// import anime from 'animejs'
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

    activeItem () {
      return this.$store.getters.activeItem
    },

    activeType () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let grandparent = _.get(this.structure, _.chain(path).split('.').dropRight(2).join('.').value())

      if (this.activeItem && this.activeItem._type === 'array') {
        return 'array'
      }
      else if (grandparent && this.activeItem && grandparent._type === 'array' && this.activeItem._type === 'item') {
        return 'array'
      }
      else {
        return 'object'
      }
    },

  },

  watch: {

    activeItem (value) {
      this.redirectToParentIfInvalidPath()
    },

  },

  methods: {

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
  <div class="js-panel">
    <ItemsFromObject v-if="activeType === 'object'"/>
    <ItemsFromArray v-if="activeType === 'array'"/>
  </div>
</aside>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.panel
  background-image: $color-gray--gradient
  height: 100%
  overflow-x: hidden

.js-panel
  height: 100%

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
      border-bottom: 1px solid $color-gray--light
      height: 3rem
      padding: 1.25rem

    > .main
      +gap(2rem)
      display: flex
      flex-direction: column
      overflow-y: auto
      padding: 2rem 1.25rem

</style>
