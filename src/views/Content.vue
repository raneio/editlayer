<script>
import _ from 'lodash'
import Navigation from '@/components/navigate/Navigation'
import SidePanel from '@/components/panel/Panel'
import Breadcrumb from '@/components/navigate/Breadcrumb'
import BackButton from '@/components/navigate/BackButton'
import License from '@/components/utils/License'
import Editor from '@/components/content/Editor'

export default {
  name: 'Content',

  components: {
    Navigation,
    SidePanel,
    Breadcrumb,
    BackButton,
    License,
    Editor,
  },

  computed: {

    schema () {
      return this.$store.getters.schema
    },

    activeSchema () {
      return this.$store.getters.activeSchema
    },

    isMobile () {
      return this.$store.getters.isMobile
    },

    mobileView () {
      return this.activeSchema._type === 'value' ? 'main' : 'side'
    },

  },

  methods: {

    closeEditor () {
      let pathItems = _.chain(this.$route.params.path).split('>').dropRight().value()

      while (pathItems.length > 0) {
        let path = _.join(pathItems, '.')
        let item = _.get(this.schema, path)

        if (item && !_.has(item, '_order')) {
          this.$router.push({name: 'Content', params: {projectId: this.$store.getters.activeProject.projectId, path: item._path}})
          return false
        }

        pathItems = _.dropRight(pathItems)
      }

      this.$router.push({name: 'Content', params: {projectId: this.$store.getters.activeProject.projectId}})
    },

  },

}
</script>

<template>
<section class="app-layout">
  <Navigation v-show="!isMobile || mobileView === 'side'"/>
  <SidePanel v-show="!isMobile || mobileView === 'side'"/>

  <main class="main -content" v-if="!isMobile || mobileView === 'main'">

    <header>
      <Breadcrumb/>
    </header>

    <section class="content">
      <h1 class="heading -main" v-text="activeSchema.TITLE"/>

      <Editor/>

      <button class="button -info -close" @click="closeEditor()" v-if="isMobile">Close</button>
    </section>

    <License/>

  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.main.-content
  background-color: $background-color
  padding-top: 0
  padding-bottom: 0
  +gap(2rem)

  > *
    max-width: $breakpoint--large

.content
  +gap()

.button.-close
  display: block
  margin-left: auto
  margin-right: auto

</style>
