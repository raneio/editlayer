<script>
import _ from 'lodash'
import Auth from '@/Auth'
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
  <Auth v-if="$store.state.user.isLoggedIn === false"/>
  <router-view v-if="$store.state.user.isLoggedIn === true"/>
  <Notifications/>
</div>
</template>
