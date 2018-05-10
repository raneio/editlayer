<script>
import Auth from '@/Auth'
import Notifications from '@/components/Notifications'
import LoaderOverlay from '@/components/LoaderOverlay'

export default {
  name: 'app',

  components: {
    Auth,
    Notifications,
    LoaderOverlay
  },

  computed: {

    showLoaderOverlay () {
      return !this.routerViewIsReady && this.$store.state.user.isLoggedIn === true
    },

    routerViewIsReady () {
      return this.$store.state.user.isLoggedIn === true &&
        this.$store.state.projects.admin !== null &&
        this.$store.state.projects.editor !== null
    }

  },

  created () {
    this.$store.dispatch('authState')
    this.$store.dispatch('resizeListener')
  }
}
</script>

<template>
<div id="app">
  <LoaderOverlay v-if="showLoaderOverlay"/>
  <Auth v-if="$store.state.user.isLoggedIn === false"/>
  <router-view v-if="routerViewIsReady"/>
  <Notifications/>
</div>
</template>
