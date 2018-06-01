<script>
import Navigation from '@/components/Navigation'
import Projects from '@/components/Projects'
import firebase from '@/firebase'

export default {
  name: 'Dashboard',

  components: {
    Navigation,
    Projects,
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
<section class="layout">
  <Navigation class="navigation"/>

  <main class="main -dashboard">
    <header class="header">
      <div class="logo">
        <svg height="20" viewBox="0 0 28 20" width="28" xmlns="http://www.w3.org/2000/svg"><g fill="#6643ad" fill-rule="evenodd" transform=""><path d="m13.8461538 15.8859592 10.8869191-5.238444 2.9592348 1.2250892v1.1380841l-13.8461539 6.433133-13.8461538-6.433133v-1.1380841l2.86214193-1.2250892z"/><path d="m13.8461538 0 13.8461539 6.72571046v1.13808415l-13.8461539 6.43313299-13.8461538-6.43313299v-1.13808415z"/></g></svg>
        <div class="text">
          Editlayer
        </div>
      </div>
      
      <div class="account">
        <span class="email" v-text="email"></span>
        <a class="button" @click="logout()">Logout</a>
      </div>
    </header>
    <Projects/>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.main.-dashboard
  background-image: linear-gradient(to left, mix($color-violet, transparent, 4%), mix($color-violet, transparent, 8%))
  overflow-y: auto
  padding: 2.5rem
  +margin-to-childs(2rem)

.header
  +chain(1rem)
  align-items: center
  justify-content: space-between

  .logo
    +chain(.5rem)
    align-items: center
    font-size: 1.4rem
    font-weight: 900
    letter-spacing: -.05em
    color: $color-violet

  .account
    +chain(1rem)
    align-items: center

    .email
      display: none

      +for-tablet-portrait
        display: block

    .button
      font-size: .8rem

.navigation
  max-width: 1rem

  +for-tablet-portrait
    max-width: none

</style>
