<script>
import _ from 'lodash'
import anime from 'animejs'
import titleCase from 'title-case'


export default {
  name: 'BackButton',

  computed: {

    projects () {
      return this.$store.getters.projects
    },

    activeProject () {
      return this.$store.getters.activeProject
    },

    schema () {
      return this.$store.getters.schema
    },

    activeSchema (state, getters) {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (_.has(this.schema, path)) {
        return _.get(this.schema, path)
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

      if (_.has(this.activeSchema, 'EDITOR')) {
        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      while (breadcrumbItems.length > 0) {
        let path = _.join(breadcrumbItems, '.')
        let item = _.get(this.schema, path)

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

      if (this.projects.length > 1) {
        breadcrumb.unshift({
          name: 'Home',
        })
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

    goBack () {
      let backItem = this.breadcrumb[this.breadcrumb.length-2]
      if (backItem) {
        this.selectItem(backItem)
      } else {
        this.selectItem('home')
      }
    },

    selectItem (item) {
      let path = _.replace(item.path, /\./g, '>')

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
          if (item.projectId && path) {
            this.$router.push({ name: this.$route.name, params: { projectId: item.projectId, path: path }})
          } else if (item.projectId) {
            this.$router.push({ name: this.$route.name, params: { projectId: item.projectId }})
          } else {
            this.$router.push({ name: this.$route.name })
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
<button
  class="button -link"
  @click.prevent="goBack()"
>
  <img class="icon" src="../assets/icon-back.svg" alt="">
  <div>Back</div>
</button>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.button
  +chain(.75rem)
  // padding-left: 1.5em
  // position: relative

  // &::after
  //   content: '<'
  //   position: absolute
  //   top: 50%
  //   left: .5em
  //   transform: translateY(-50%)

</style>
