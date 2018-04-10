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
    StructureEditor
  }

}
</script>

<template>
<section class="layout">
  <Navigation/>
  <SidePanel/>

  <main class="main-content">
    <Breadcrumb/>
    <StructureEditor v-if="$route.params.projectId"/>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.main-content
  overflow-y: auto
  padding: .25rem 2.5rem 2.5rem

</style>
