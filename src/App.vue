<script>
import Auth from '@/Auth'
import Notifications from '@/components/notification/Notifications'
import LoaderOverlay from '@/components/utils/LoaderOverlay'

export default {
  name: 'app',

  components: {
    Auth,
    Notifications,
    LoaderOverlay,
  },

  computed: {

    showLoaderOverlay () {
      return !this.routerViewIsReady && this.$store.state.user.isLoggedIn === true
    },

    routerViewIsReady () {
      return this.$store.state.user.isLoggedIn === true &&
        this.$store.state.projects.admin !== null &&
        this.$store.state.projects.editor !== null
    },

  },

  created () {
    // console.log('process', process.env)
    this.$store.dispatch('authState')
    this.$store.dispatch('resizeListener')
  },
}
</script>

<template>
<div id="app">

  <transition name="fade">
    <LoaderOverlay v-if="showLoaderOverlay"/>
  </transition>
  <Auth v-if="$store.state.user.isLoggedIn === false"/>
  <router-view v-if="routerViewIsReady"/>
  <Notifications/>
</div>
</template>

<style lang="sass" scoped>
.fade-enter-active,
.fade-leave-active
  transition: opacity .2s

.fade-enter,
.fade-leave-to
  opacity: 0
</style>
