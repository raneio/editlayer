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
  <Auth v-if="$store.state.user.isLoggedIn === false"/>
  <router-view v-if="$store.state.user.isLoggedIn === true"/>
</div>
</template>
