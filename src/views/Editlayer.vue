<script>
import _ from 'lodash'
import Auth from '@/views/Auth'
import Navigation from '@/components/Navigation'
import SidePanel from '@/components/SidePanel'
import MainContent from '@/components/MainContent'
import Settings from '@/components/Settings'
import UploadNotifications from '@/components/UploadNotifications'


export default {
  name: 'Editlayer',

  components: {
    Auth,
    Navigation,
    SidePanel,
    MainContent,
    Settings,
    UploadNotifications,
  },

  computed: {

    activeRole () {
      return this.$store.getters.activeRole
    },

  },

  watch: {

    activeRole () {
      this.selectRouteName()
    },

    '$route.name': function() {
      this.selectRouteName()
    },

    '$route.params.projectId': function() {
      this.selectRouteName()
    },

  },

  methods: {

    selectRouteName () {
      if (this.activeRole === 'editor' && (this.$route.name === 'schema' || this.$route.name === 'settings')) {
        this.$router.replace({ name: 'edit', params: { projectId: this.$route.params.projectId, path: this.$route.params.path } })
      }
    },

  },

  mounted () {
    this.selectRouteName()
  },

}
</script>


<template>
<section>

  <Auth v-if="$store.state.user.isLoggedIn === false"/>

  <section v-if="$store.state.user.isLoggedIn === true" class="layout">
    <Navigation/>
    <SidePanel v-if="$route.name === 'edit' || $route.name === 'schema'"/>
    <MainContent v-if="$route.name === 'edit' || $route.name === 'schema'"/>
    <Settings v-if="$route.name === 'settings'"/>
    <UploadNotifications/>
  </section>

</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

</style>
