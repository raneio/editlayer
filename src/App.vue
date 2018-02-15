<script>
import firebase from './firebase'

export default {
  name: 'app',

  data() {
    return {
      email: '',
      password: '',
    }
  },

  methods: {

    login () {
      this.$store.dispatch('authLogin', {
        email: this.email,
        password: this.password
      })

    },

    register () {
      this.$store.dispatch('authRegister', {
        email: this.email,
        password: this.password
      })
    },

  },

  created () {
    this.$store.dispatch('authState')
  },

}
</script>


<template>
<div id="app">
  <router-view v-if="$store.state.user.isLoggedIn"/>

  <section class="auth" v-if="!$store.state.user.isLoggedIn">
    <input type="email" v-model="email" placeholder="email">
    <input type="password" v-model="password" placeholder="password">
    <button type="button" name="button" @click="login()">Login</button>
    <button type="button" name="button" @click="register()">Register</button>
  </section>

</div>
</template>
