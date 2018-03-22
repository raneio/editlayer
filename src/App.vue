<script>
import Auth from '@/views/Auth'
import Notifications from '@/components/Notifications'

export default {
  name: 'app',

  components: {
    Auth,
    Notifications,
  },

  created () {
    this.$store.dispatch('authState')
  },

}
</script>

<template>
<div id="app">
  <Auth v-if="$store.state.user.isLoggedIn === false && $route.name !== 'home'"/>
  <router-view v-else/>
  <Notifications/>
</div>
</template>
