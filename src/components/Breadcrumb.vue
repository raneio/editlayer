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
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (_.has(this.structure, path)) {
        return _.get(this.structure, path)
      } else {
        return {}
      }
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
            name: this.stringToTitle(item.NAME),
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

      if (this.$route.name === 'Settings') {
        breadcrumb = [
          {
            name: this.activeProject.name,
            projectId: this.$route.params.projectId,
          },

          {
            name: 'Settings',
            projectId: this.$route.params.projectId,
          },
        ]
      }


      return breadcrumb
    },

  },

  methods: {

    stringToTitle (text) {
      if (_.endsWith(text, '.json')) {
        text = text.slice(0, -5)
      }

      return titleCase(text)
    },

    selectItem (item) {
      let path = _.replace(item.path, /\./g, '>')

      let routeName = this.$route.name

      if (routeName === 'Settings') {
        routeName = 'Content'
      }

      anime.timeline()
      .add({
        targets: '.side-panel > .content',
        translateX: '100%',
        opacity: 0,
        easing: 'linear',
        duration: 100,
      })
      .add({
        targets: '.side-panel > .content',
        translateX: '-100%',
        duration: 0,
        complete: (anim) => {
          console.log('selectItem', routeName)
          if (item.projectId && path) {
            this.$router.push({ name: routeName, params: { projectId: item.projectId, path: path }})
          } else if (item.projectId) {
            this.$router.push({ name: routeName, params: { projectId: item.projectId }})
          } else {
            let view = (this.$route.name === 'Structure') ? 'structure' : null
            this.$router.push({ name: 'Dashboard', params: { view: view } })
          }
        },
      })
      .add({
        targets: '.side-panel > .content',
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

  <div class="crumb" v-if="!$route.params.projectId">
    <img src="@/assets/icon-home-disabled.svg" alt="">
  </div>

  <a @click="selectItem({})" class="crumb button -link" v-if="$route.params.projectId">
    <img src="@/assets/icon-home.svg" alt="">
  </a>

  <div v-for="(item, idx) in breadcrumb" class="crumb">

    <img src="@/assets/icon-crumb.svg" alt="">

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
  +chain(.75rem)
  transition: opacity .2s
  padding-bottom: .25rem
  font-size: .9rem
  border-bottom: 1px solid $color-hr
  height: 3rem
  color: $color-disabled

  .crumb
    +chain(.75rem)
    align-items: center

  .button
    // text-transform: none

    &[disabled]
      cursor: default

</style>
