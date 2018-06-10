<script>
import Navigation from '@/components/navigate/Navigation'
import Projects from '@/components/dashboard/Projects'
import License from '@/components/utils/License'
import firebase from '@/firebase'

export default {
  name: 'Dashboard',

  components: {
    Navigation,
    Projects,
    License,
  },

  computed: {
    email () {
      return this.$store.state.user.email
    },
  },

  methods: {

    logout () {
      firebase.auth.signOut().then(() => {
        window.location.href = 'https://editlayer.com'
      }).catch((error) => {
        console.error('Logout failed', error)
      })
    },

  },

  mounted () {
    if (this.$route.params.view && this.$route.params.view !== 'structure') {
      this.$router.push({ name: 'Content', params: { projectId: this.$route.params.view } })
    }
  },

}
</script>

<template>
<section class="app-layout">
  <Navigation class="navigation"/>

  <main class="main -dashboard">
    <header class="header">
      <!-- <div class="logo">
        <icon name="editlayer"/>
        <div class="text">Editlayer</div>
      </div> -->

      <div class="account">
        <span class="email" v-text="email"></span>
        <a class="button" @click="logout()">Logout</a>
      </div>
    </header>
    <Projects class="content"/>
    <License/>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.main.-dashboard
  background-image: linear-gradient(to right, $color-gray--lightest, $color-gray--lighter)

.header
  +chain(1rem)
  align-items: center
  justify-content: flex-end

  .logo
    +chain(.5rem)
    align-items: center
    font-size: 1.4rem
    font-weight: 900
    letter-spacing: -.05em
    color: $color-brand

    .fa-icon
      height: 1.4rem

  .account
    +chain(1rem)
    align-items: center

    .email
      display: none

      +breakpoint('medium')
        display: block

    .button
      font-size: .8rem

.navigation
  max-width: 1rem

  +breakpoint('medium')
    max-width: none

</style>
