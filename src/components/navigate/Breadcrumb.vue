<script>
import _ from 'lodash'
import anime from 'animejs'
import titleCase from 'title-case'

export default {
  name: 'Breadcrumb',

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    structure () {
      return this.$store.getters.structure
    },

    activeStructure (state, getters) {
      return this.$store.getters.activeStructure
    },

    breadcrumb () {
      let breadcrumb = []
      let breadcrumbItems = []

      if (this.$route.params.path) {
        breadcrumbItems = _.split(this.$route.params.path, '>')
      }

      if (_.has(this.activeStructure, 'EDITOR')) {
        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      while (breadcrumbItems.length > 0) {
        let path = _.join(breadcrumbItems, '.')
        let item = _.get(this.structure, path)

        if (item && !_.has(item, '_order')) {
          breadcrumb.unshift({
            name: titleCase(item.TITLE),
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

    isMobile () {
      return this.$store.getters.isMobile
    },

  },

  methods: {

    selectItem (item) {
      let path = _.replace(item.path, /\./g, '>')

      anime.timeline()
        .add({
          targets: '.panel > .content',
          translateX: '100%',
          opacity: 0,
          easing: 'linear',
          duration: 100,
        })
        .add({
          targets: '.panel > .content',
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
          targets: '.panel > .content',
          translateX: 0,
          opacity: 1,
          easing: 'linear',
          duration: 100,
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

    <button
      class="button -link"
      v-if="idx < breadcrumb.length-1 || isMobile"
      v-text="item.name"
      @click.prevent="selectItem(item)"
    />

    <span
      v-else
      v-text="item.name"
    />

  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.breadcrumb
  +chain(.6em)
  transition: opacity .2s
  font-size: .9rem
  border-bottom: 1px solid $hr-color
  height: 3rem
  color: $color-gray

.button.-link
  text-transform: none

.crumb
  +chain(.6em)

.fa-icon
  width: .4rem
  fill: mix($content-color, $background-color, 30%)

</style>
