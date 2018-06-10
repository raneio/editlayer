<script>
import _ from 'lodash'
import Navigation from '@/components/navigate/Navigation'
import SidePanel from '@/components/panel/Panel'
import Breadcrumb from '@/components/navigate/Breadcrumb'
import BackButton from '@/components/navigate/BackButton'
import Editors from '@/components/editors/Editors'
import License from '@/components/utils/License'

export default {
  name: 'Content',

  components: {
    Navigation,
    SidePanel,
    Breadcrumb,
    Editors,
    BackButton,
    License,
  },

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeStructure () {
      return this.$store.getters.activeStructure
    },

    isMobile () {
      return this.$store.getters.isMobile
    },

    mobileView () {
      return this.activeStructure.TYPE === 'value' ? 'main' : 'side'
    },

  },

  methods: {

    closeEditor () {
      let pathItems = _.chain(this.$route.params.path).split('>').dropRight().value()

      while (pathItems.length > 0) {
        let path = _.join(pathItems, '.')
        let item = _.get(this.structure, path)

        if (item && !_.has(item, 'ORDER')) {
          this.$router.push({name: 'Content', params: {projectId: this.$store.getters.activeProject.projectId, path: item.PATH}})
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
      <Editors/>
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
  padding: .25rem 1.5rem 1.5rem

  +breakpoint('medium')
    padding: .25rem 2.5rem 2.5rem

.button.-close
  display: block
  margin-left: auto
  margin-right: auto

</style>
