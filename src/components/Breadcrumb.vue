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

        if (item && !_.has(item, 'ORDER')) {
          breadcrumb.unshift({
            name: titleCase(item.NAME),
            path: path,
            projectId: this.$route.params.projectId
          })
        }

        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      if (this.$route.params.projectId && this.activeProject) {
        breadcrumb.unshift({
          name: this.activeProject.name,
          projectId: this.$route.params.projectId
        })
      }

      return breadcrumb
    }

  },

  methods: {

    selectItem (item) {
      let path = _.replace(item.path, /\./g, '>')

      anime.timeline()
        .add({
          targets: '.side-panel > .content',
          translateX: '100%',
          opacity: 0,
          easing: 'linear',
          duration: 100
        })
        .add({
          targets: '.side-panel > .content',
          translateX: '-100%',
          duration: 0,
          complete: (anim) => {
            if (item.projectId && path) {
              this.$router.push({name: this.$route.name, params: {projectId: item.projectId, path: path}})
            } else if (item.projectId) {
              this.$router.push({name: this.$route.name, params: {projectId: item.projectId}})
            }
          }
        })
        .add({
          targets: '.side-panel > .content',
          translateX: 0,
          opacity: 1,
          easing: 'linear',
          duration: 100
        })
    }

  }

}
</script>

<template>
<section class="breadcrumb">

  <div
    class="crumb"
    v-for="(item, idx) in breadcrumb"
    :key="idx"
  >

    <svg width="6" height="8" viewBox="0 0 6 8" xmlns="http://www.w3.org/2000/svg" v-if="idx > 0">
      <path d="M5.219 4.25v.031A.457.457 0 0 0 5.312 4a.457.457 0 0 0-.093-.281L1.53.094A.338.338 0 0 0 1.281 0 .457.457 0 0 0 1 .094l-.219.25a.338.338 0 0 0-.094.25c0 .104.032.198.094.281L3.97 4 .78 7.125a.389.389 0 0 0-.125.281c0 .104.042.188.125.25L1 7.875A.389.389 0 0 0 1.281 8a.297.297 0 0 0 .25-.125L5.22 4.25z" fill="#797979" fill-rule="evenodd"/>
    </svg>

    <button
      class="button -link"
      v-if="idx < breadcrumb.length-1"
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
@import '../sass/features'

.breadcrumb
  +chain(.6em)
  transition: opacity .2s
  font-size: .8rem
  border-bottom: 1px solid mix($color-violet, transparent, 10%)
  height: 3rem
  color: $color-gray

.button.-link
  text-transform: none

.crumb
  +chain(.6em)
  align-items: center

</style>
