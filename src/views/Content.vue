<script>
import _ from 'lodash'
import Navigation from '@/components/Navigation'
import SidePanel from '@/components/SidePanel'
import Editors from '@/components/Editors'
import Breadcrumb from '@/components/Breadcrumb'


export default {
  name: 'Content',

  components: {
    Navigation,
    SidePanel,
    Breadcrumb,
    Editors,
  },

}
</script>


<template>
<section class="layout">
  <Navigation/>
  <SidePanel/>

  <main class="main-content">
    <Breadcrumb/>
    <Editors v-if="$route.params.projectId"/>
  </main>
</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.main-content
  overflow-y: auto
  padding: .25rem 2.5rem 2.5rem

  img
    width: 20rem

</style>
