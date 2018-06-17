<script>
import 'codemirror/mode/javascript/javascript'
import Navigation from '@/components/navigate/Navigation'
import SidePanel from '@/components/panel/Panel'
import Breadcrumb from '@/components/navigate/Breadcrumb'
import SchemaEditor from '@/components/schema/SchemaEditor'
import License from '@/components/utils/License'

export default {
  name: 'Schema',

  components: {
    Navigation,
    SidePanel,
    Breadcrumb,
    SchemaEditor,
    License,
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
<section class="app-layout">
  <Navigation/>
  <SidePanel v-if="!isMobile"/>

  <main class="main -schema">
    <header>
      <Breadcrumb v-if="!isMobile"/>
    </header>

    <section class="content">
      <SchemaEditor v-if="$route.params.projectId"/>
    </section>

    <License/>

  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.main.-schema
  background-color: $background-color
  // padding-top: 0
  // padding-bottom: 0

</style>
