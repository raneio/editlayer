<script>
import _ from 'lodash'
import anime from 'animejs'
import titleCase from 'title-case'


export default {
  name: 'Breadcrumb',

  computed: {

    // files () {
    //   return this.$store.getters.projects
    // },

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

      if (this.$route.name === 'settings') {
        breadcrumb.push({
          name: 'Settings',
          projectId: this.$route.params.projectId,
        })
      }

      // if (this.projects.length > 1) {
      //   breadcrumb.unshift({
      //     name: 'Home',
      //   })
      // }


      return breadcrumb
    },

    // showBreadcrumb () {
    //   return true
    //   if (this.breadcrumb.length === 1 && !_.find(this.navItems, { type: 'object' })) {
    //     return false
    //   } else {
    //     return true
    //   }
    // },

  },

  methods: {

    stringToTitle (text) {
      if (_.endsWith(text, '.json')) {
        text = text.slice(0, -5)
      }

      return titleCase(text)
    },

    // goBack () {
    //   let backItem = this.breadcrumb[this.breadcrumb.length-2]
    //   if (backItem) {
    //     this.selectItem(backItem)
    //   }
    // },

    selectItem (item) {
      let path = _.replace(item.path, /\./g, '>')

      let routeName = this.$route.name

      if (routeName === 'settings') {
        routeName = 'edit'
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
          if (item.projectId && path) {
            this.$router.push({ name: routeName, params: { projectId: item.projectId, path: path }})
          } else if (item.projectId) {
            this.$router.push({ name: routeName, params: { projectId: item.projectId }})
          } else {
            this.$router.push({ name: routeName })
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
    <img src="../assets/icon-home-disabled.svg" alt="">
    <!-- <div>DASHBOARD</div> -->
  </div>

  <a @click="selectItem({})" class="crumb button -link" v-if="$route.params.projectId">
    <img src="../assets/icon-home.svg" alt="">
    <!-- <div>DASHBOARD</div> -->
  </a>

  <div v-for="(item, idx) in breadcrumb" class="crumb">

    <img src="../assets/icon-crumb.svg" alt="">

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
  // padding-left: .5rem
  // padding-right: .5rem
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

  // .crumb + .crumb
    // padding-left: 1.5em
    // position: relative
    //
    // &::after
    //   content: '>'
    //   position: absolute
    //   top: 50%
    //   left: .5em
    //   transform: translateY(-50%)
    //   color: mix(transparent, $color-content--invert, 50%)

</style>
