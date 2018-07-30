<script>
import _ from 'lodash'
import anime from 'animejs'

export default {
  name: 'Breadcrumb',

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    structure () {
      return this.$store.getters.structure
    },

    activeItem (state, getters) {
      return this.$store.getters.activeItem
    },

    breadcrumb () {
      let breadcrumb = []
      let breadcrumbItems = []

      if (this.$route.params.path) {
        breadcrumbItems = _.split(this.$route.params.path, '>')
      }

      if (_.has(this.activeItem, 'EDITOR')) {
        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      while (breadcrumbItems.length > 0) {
        let path = _.join(breadcrumbItems, '.')
        let item = _.get(this.structure, path)

        if (item && !_.has(item, '_order')) {
          breadcrumb.unshift({
            name: item.TITLE,
            path: path,
            projectId: this.$route.params.projectId,
          })
        }

        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      if (this.$route.params.projectId && this.activeProject) {
        breadcrumb.unshift({
          name: this.activeProject.name,
          projectId: this.$route.params.projectId,
        })
      }

      return breadcrumb
    },

    // isMobile () {
    //   return this.$store.getters.isMobile
    // },

  },

  methods: {

    selectItem (item) {
      let path = _.replace(item.path, /\./g, '>')

      anime.timeline()
        .add({
          targets: '.js-panel',
          translateX: '100%',
          opacity: 0,
          easing: 'linear',
          duration: 150,
        })
        .add({
          targets: '.js-panel',
          translateX: '-100%',
          duration: 0,
          complete: (anim) => {
            if (item.projectId && path) {
              this.$router.push({name: this.$route.name, params: {projectId: item.projectId, path: path}})
            }
            else if (item.projectId) {
              this.$router.push({name: this.$route.name, params: {projectId: item.projectId}})
            }
          },
        })
        .add({
          targets: '.js-panel',
          translateX: 0,
          opacity: 1,
          easing: 'linear',
          duration: 150,
        })
    },

  },

}
</script>

<template>
<section class="breadcrumb">

  <div
    class="crumb"
    v-for="(item, idx) in breadcrumb"
    :key="idx"
  >

    <icon name="chevron-right" v-if="idx > 0"/>

    <button-core
      light
      v-if="idx < breadcrumb.length-1 || $store.state.utils.windowWidth <= 900"
      @click.native="selectItem(item)"
    >
      {{item.name}}
    </button-core>

    <span v-else>
      {{item.name}}
    </span>

  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.breadcrumb
  +chain(.6em)
  transition: opacity .2s
  font-size: .9rem
  // border-bottom: 1px solid $color-gray--light
  height: 3rem
  color: $color-gray

.button-core
  text-transform: none

.crumb
  +chain(.6em)
  line-height: 1em

.fa-icon
  width: .4rem
  color: $color-gray--light

</style>
