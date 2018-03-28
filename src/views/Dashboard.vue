<script>
import _ from 'lodash'
import Navigation from '@/components/Navigation'
import SidePanel from '@/components/SidePanel'
import Breadcrumb from '@/components/Breadcrumb'


export default {
  name: 'Dashboard',

  components: {
    Navigation,
    SidePanel,
    Breadcrumb,
  },

  mounted () {
    if (this.$route.params.view && this.$route.params.view !== 'structure') {
      this.$router.push({ name: 'Content', params: { projectId: this.$route.params.view } })
    }
  },

}
</script>


<template>
<section class="layout">
  <Navigation/>
  <SidePanel/>

  <main class="main-content">
    <Breadcrumb/>
    <h1 class="heading">
      Dashboard
    </h1>
  </main>
</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.main-content
  overflow-y: auto
  padding: .25rem 2.5rem 2.5rem
  +margin-to-childs(2rem)

  img
    width: 20rem

</style>
