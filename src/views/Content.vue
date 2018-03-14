<script>
import _ from 'lodash'
// import Auth from '@/views/Auth'
import Navigation from '@/components/Navigation'
import SidePanel from '@/components/SidePanel'
// import MainContent from '@/components/MainContent'
// import Settings from '@/components/Settings'
import UploadNotifications from '@/components/UploadNotifications'
import Editors from '@/components/Editors'
import Breadcrumb from '@/components/Breadcrumb'
// import Structure from '@/components/Structure'


export default {
  name: 'Content',

  components: {
    // Auth,
    Navigation,
    SidePanel,
    // MainContent,
    // Settings,
    UploadNotifications,
    Breadcrumb,
    Editors,
  },

  computed: {

    // activeRole () {
    //   return this.$store.getters.activeRole
    // },

  },

  watch: {

    // activeRole () {
    //   this.selectRouteName()
    // },

    // '$route.name': function() {
    //   this.selectRouteName()
    // },

    // '$route.params.projectId': function() {
    //   this.selectRouteName()
    // },

  },

  methods: {

    // selectRouteName () {
    //   if (this.activeRole === 'editor' && (this.$route.name === 'Structure' || this.$route.name === 'Settings')) {
    //     this.$router.replace({ name: 'Content', params: { projectId: this.$route.params.projectId, path: this.$route.params.path } })
    //   }
    // },

  },

  mounted () {
    // this.selectRouteName()
  },

}
</script>


<template>
<section class="layout">
  <Navigation/>
  <SidePanel/>

  <main class="main-content">
    <Breadcrumb/>
    <Editors/>
  </main>

  <!-- <MainContent/> -->
  <UploadNotifications/>
</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.main-content
  overflow-y: auto
  padding: .25rem 2.5rem 2.5rem

</style>
