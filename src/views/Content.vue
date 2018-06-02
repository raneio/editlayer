<script>
import _ from 'lodash'
import Navigation from '@/components/Navigation'
import SidePanel from '@/components/SidePanel'
import Breadcrumb from '@/components/Breadcrumb'
import BackButton from '@/components/BackButton'
import Editors from '@/components/Editors'

export default {
  name: 'Content',

  components: {
    Navigation,
    SidePanel,
    Breadcrumb,
    Editors,
    BackButton,
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
<section class="layout">
  <Navigation v-show="!isMobile || mobileView === 'side'"/>
  <SidePanel v-show="!isMobile || mobileView === 'side'"/>

  <main class="main -content" v-if="!isMobile || mobileView === 'main'">
    <Breadcrumb/>
    <Editors/>
    <button class="button -blue -close" @click="closeEditor()" v-if="isMobile">Close</button>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.main.-content
  overflow-y: auto
  padding: .25rem 1.5rem 1.5rem

  +for-tablet-portrait
    padding: .25rem 2.5rem 2.5rem

.button.-close
  display: block
  margin-left: auto
  margin-right: auto

</style>
