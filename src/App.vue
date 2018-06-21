<script>
import Navigation from '@/components/navigation/Navigation'
import Panel from '@/components/panel/Panel'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import License from '@/components/utils/License'
import Auth from '@/components/auth/Auth'
import Notifications from '@/components/utils/Notifications'
import LoaderOverlay from '@/components/utils/LoaderOverlay'
import Dashboard from '@/views/Dashboard'

export default {
  name: 'App',

  components: {
    Navigation,
    Panel,
    Breadcrumb,
    License,
    Auth,
    Notifications,
    LoaderOverlay,
    Dashboard,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    showRouterView () {
      return this.activeProject &&
        this.$store.state.auth.id &&
        this.$store.state.projects.admin !== null &&
        this.$store.state.projects.editor !== null
    },

    showNavPanel () {
      return !!this.activeProject
    },

    showSidePanel () {
      return !!this.activeProject && this.$store.state.route.name !== 'Settings'
      // return !!this.activeProject && this.$store.state.route.name !== 'Settings' && (!this.isMobile || this.mobileView === 'side')
    },

    showBreadcrumb () {
      return !!(this.$store.state.route.name === 'Content' || this.$store.state.route.name === 'Schema')
    },

    showLoaderOverlay () {
      return !this.showRouterView && this.$store.state.auth.isLoggedIn === true
    },

    showAuth () {
      return this.$store.state.auth.id === false
    },

    showMainPanel () {
      return this.$store.state.route.name !== 'Dashboard'
    },

    showDashboard () {
      return this.$store.state.auth.id &&
        this.$store.state.route.name === 'Dashboard'
    },

    // isMobile () {
    //   return this.$store.getters.isMobile
    // },

    // mobileView () {
    //   return this.activeSchema._type === 'value' ? 'main' : 'side'
    // },

  },

  created () {
    this.$store.dispatch('authState')
    this.$store.dispatch('resizeListener')
  },
}
</script>

<template>
<section id="app">
  <Navigation class="nav-panel" v-if="showNavPanel"/>

  <Panel class="side-panel" v-show="showSidePanel"/>

  <section class="main-panel" v-if="showMainPanel">
    <header class="header">
      <Breadcrumb class="readcrumb" v-if="showBreadcrumb"/>
    </header>

    <router-view class="router-view" v-if="showRouterView"/>

    <footer class="footer">
      <License/>
    </footer>
  </section>

  <Dashboard v-if="showDashboard"/>

  <transition name="fade">
    <Auth v-if="showAuth"/>
  </transition>

  <Notifications/>

  <transition name="fade">
    <LoaderOverlay v-if="showLoaderOverlay"/>
  </transition>
</section>
</template>

<style lang="sass" scoped>
@import './sass/variables'
@import './core/sass/mixins'

#app
  display: flex
  width: 100%
  height: 100%
  background-image: linear-gradient(to right, $color-gray--lightest, $color-gray--lighter)

.nav-panel
  flex-shrink: 0
  width: 4rem

  +breakpoint('medium')
    width: 5rem

.side-panel
  flex-shrink: 0
  width: 100%

  +breakpoint(900px)
    flex-shrink: 0
    width: 22rem

.main-panel
  background-color: $background-color
  display: flex
  flex-direction: column
  overflow-y: auto
  width: 100%

  .header
    flex-shrink: 0
    margin-left: 2rem
    margin-right: 2rem
    border-bottom: 1px solid $hr-color

  .router-view
    flex-grow: 1

  .footer
    flex-shrink: 0
    box-shadow: 0 0 5rem $background-color, 0 0 15rem $background-color, 0 0 25rem $background-color
    padding-top: 3rem
    padding-bottom: 1rem

</style>
