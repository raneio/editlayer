<script>
import Navigation from '@/components/Navigation'
import SidePanel from '@/components/SidePanel'
import Breadcrumb from '@/components/Breadcrumb'
import StructureEditor from '@/components/StructureEditor'

export default {
  name: 'Structure',

  components: {
    Navigation,
    SidePanel,
    Breadcrumb,
    StructureEditor,
  },

  computed: {

    isMobile () {
      return this.$store.getters.isMobile
    },

  },

  created () {
    if (this.$store.getters.activeRole !== 'admin') {
      this.$router.replace({name: 'Content', params: {projectId: this.$store.getters.activeProject.projectId}})
    }
  },
}
</script>

<template>
<section class="layout">
  <Navigation/>
  <SidePanel v-if="!isMobile"/>

  <main class="main -structure">
    <Breadcrumb v-if="!isMobile"/>
    <StructureEditor v-if="$route.params.projectId"/>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.main.-structure
  overflow-y: auto
  padding: .25rem 1.5rem 1.5rem

  +for-tablet-portrait
    padding: .25rem 2.5rem 2.5rem

</style>
