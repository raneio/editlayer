<script>
import _ from 'lodash'
import anime from 'animejs'
import ItemsFromProjects from '@/components/ItemsFromProjects'
import ItemsFromObject from '@/components/ItemsFromObject'
import ItemsFromArray from '@/components/ItemsFromArray'

export default {
  name: 'SidePanel',

  components: {
    ItemsFromProjects,
    ItemsFromObject,
    ItemsFromArray,
  },

  methods: {

    selectItem (item) {
      let projectId = (item.FILE_ID) ? item.FILE_ID : this.$route.params.projectId
      let routeName = (item.TYPE === 'value') ? 'edit' : this.$route.name
      let path = _.replace(item.PATH, /\./g, '>')

      if (item.TYPE === 'value') {
        this.$router.push({ name: routeName, params: { projectId: projectId, path: path }})
        return false
      }

      anime.timeline()
      .add({
        targets: '.side-panel > .content',
        translateX: '-100%',
        opacity: 0,
        easing: 'linear',
        duration: 100,
      })
      .add({
        targets: '.side-panel > .content',
        translateX: '100%',
        duration: 0,
        complete: (anim) => {
          if (path) {
            this.$router.push({ name: routeName, params: { projectId: projectId, path: path }})
          } else {
            this.$router.push({ name: routeName, params: { projectId: projectId }})
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

      // anime({
      //   targets: '.side-panel > .content',
      //   translateX: -100,
      //
      //   complete: (anim) => {
      //     console.log(anim.completed);
      //     this.$router.push({ name: routeName, params: { projectId: this.$route.params.projectId, path: path }})
      //   },
      //   // translateX: [
      //   //   { value: 100, duration: 1200 },
      //   //   { value: 0, duration: 800 }
      //   // ],
      //   // rotate: '1turn',
      //   // backgroundColor: '#FFF',
      //   // duration: 2000,
      //   // loop: true
      // })


      // this.$router.push({ name: routeName, params: { projectId: this.$route.params.projectId, path: path }})
    },

  },

  computed: {

    schema () {
      return this.$store.getters.schema
    },

    activeSchema () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (_.has(this.schema, path)) {
        return _.get(this.schema, path)
      } else {
        return {}
      }
    },

    activeType () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let activeItem = _.get(this.schema, path)
      let grandparent = _.get(this.schema, _.chain(path).split('.').dropRight(2).join('.').value())

      if (!this.$route.params.projectId) {
        return 'project'
      } else if (this.activeSchema && this.activeSchema.TYPE === 'array') {
        return 'array'
      } else if (grandparent && this.activeSchema && grandparent.TYPE === 'array' && this.activeSchema.TYPE === 'value') {
        return 'array'
      } else {
        return 'object'
      }
    },

  },

}
</script>


<template>
<aside class="side-panel">
  <div class="content">

    <ItemsFromProjects :selectItem="selectItem" v-if="activeType === 'project'"/>
    <ItemsFromObject :selectItem="selectItem" v-if="activeType === 'object'"/>
    <ItemsFromArray :selectItem="selectItem" v-if="activeType === 'array'"/>

  </div>
</aside>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.side-panel
  background-color: $color-light
  padding: 1.25rem
  overflow-y: auto

// Under /deep/ you can also change style of child components
.side-panel /deep/

  .header
    +chain(1rem)
    justify-content: space-between
    align-items: center
    transition: opacity .2s
    margin-top: -1rem
    // padding-bottom: .25rem
    font-size: .9rem
    border-bottom: 1px solid $color-hr
    height: 3rem

  .items
    +margin-to-childs(1rem)


</style>
