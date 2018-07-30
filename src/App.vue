<script>
// import _ from 'lodash'
import Navigation from '@/components/navigation/Navigation'
import Panel from '@/components/panel/Panel'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import FooterContent from '@/components/utils/FooterContent'
import Notifications from '@/components/utils/Notifications'
import LoaderOverlay from '@/components/utils/LoaderOverlay'
import Dashboard from '@/views/Dashboard'
import Auth from '@/views/Auth'

export default {
  name: 'App',

  components: {
    Navigation,
    Panel,
    Breadcrumb,
    FooterContent,
    Auth,
    Notifications,
    LoaderOverlay,
    Dashboard,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    activeItem () {
      return this.$store.getters.activeItem
    },

    showRouterView () {
      return this.activeProject &&
        this.$store.getters.isLoggedIn === true &&
        this.$store.state.projects.admin !== null &&
        this.$store.state.projects.editor !== null
    },

    showNavPanel () {
      return !!this.activeProject
    },

    showSidePanel () {
      return !!this.activeProject &&
        this.$store.state.route.name !== 'Settings' &&
        (this.$store.state.route.name !== 'Schema' || this.$store.state.utils.windowWidth > 900) &&
        (this.activeItem._type !== 'item' || this.$store.state.utils.windowWidth > 900)
      // return !!this.activeProject && this.$store.state.route.name !== 'Settings' && (!this.isMobile || this.mobileView === 'side')
    },

    showBreadcrumb () {
      return !!this.activeProject &&
        (this.$store.state.route.name === 'Content' || this.$store.state.route.name === 'Schema')
    },

    showLoaderOverlay () {
      return this.$store.getters.isLoggedIn === null || this.$store.getters.projects === null
    },

    showAuth () {
      return this.$store.getters.isLoggedIn === false
    },

    showMainPanel () {
      return this.$store.state.route.name !== 'Dashboard' &&
        (this.$store.state.route.name !== 'Content' || (this.activeItem._type === 'item' || this.$store.state.utils.windowWidth > 900))
    },

    showDashboard () {
      return this.$store.getters.isLoggedIn === true &&
        this.$store.state.route.name === 'Dashboard'
    },

    showFooterContent () {
      return !!this.activeProject
    },

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

    <footer class="footer" v-if="showFooterContent">
      <FooterContent/>
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
@import './sass/core/mixins'

#app
  display: flex
  width: 100%
  height: 100%
  background-image: linear-gradient(to right, $color-gray--lightest, $color-gray--lighter)

.nav-panel
  flex-shrink: 0
  width: 3.5rem
  font-size: .8rem

  +breakpoint('medium')
    width: 5rem

.side-panel
  flex-grow: 1

  +breakpoint('medium')
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
    padding-left: 1.5rem
    padding-right: 1.5rem

    +breakpoint('medium')
      padding-left: 3rem
      padding-right: 3rem

  .router-view
    flex-grow: 1

  .footer
    flex-shrink: 0
    box-shadow: 0 0 5rem $background-color, 0 0 15rem $background-color, 0 0 25rem $background-color
    padding-top: 3rem
    padding-bottom: 1rem

</style>
