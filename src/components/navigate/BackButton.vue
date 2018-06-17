<script>
import _ from 'lodash'
import anime from 'animejs'

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
      return this.$store.getters.activeSchema
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

        if (item && !_.has(item, '_order')) {
          breadcrumb.unshift({
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

  },

  methods: {

    goBack () {
      let backItem = this.breadcrumb[this.breadcrumb.length - 2]
      if (backItem) {
        this.selectItem(backItem)
      }
      else {
        this.$router.push({name: 'Dashboard'})
      }
    },

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
<button class="button -link" @click.prevent="goBack()">
  <icon name="chevron-left"/>
  <div v-if="breadcrumb.length === 1">Dashboard</div>
  <div v-else>Back</div>
</button>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.button
  .fa-icon
    height: 1.15rem
    width: auto

</style>
