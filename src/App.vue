<script>
import Auth from '@/views/Auth'

export default {
  name: 'app',

  components: {
    Auth,
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
</div>
</template>
