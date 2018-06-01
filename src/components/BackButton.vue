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
      } else {
        this.$router.push({name: 'Dashboard'})
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
              this.$router.push({name: this.$route.name, params: {projectId: item.projectId, path: path}})
            } else if (item.projectId) {
              this.$router.push({name: this.$route.name, params: {projectId: item.projectId}})
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
  <svg width="11" height="20" viewBox="0 0 11 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.227 19.203a.465.465 0 0 1-.344.129.465.465 0 0 1-.344-.129l-9.11-9.11a.465.465 0 0 1-.128-.343c0-.143.043-.258.129-.344L9.539.296a.465.465 0 0 1 .344-.128c.143 0 .258.043.344.129l.343.344c.086.086.13.2.13.343a.628.628 0 0 1-.13.387L2.148 9.75l8.422 8.379a.628.628 0 0 1 .13.387.465.465 0 0 1-.13.343l-.343.344z" fill="#252525" fill-rule="evenodd"/>
  </svg>

  <div v-if="breadcrumb.length === 1">
    Dashboard
  </div>
  <div v-else>
    Back
  </div>
</button>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.button
  +chain(.75rem)

</style>
