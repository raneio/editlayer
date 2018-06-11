<script>
import Navigation from '@/components/navigate/Navigation'
import Projects from '@/components/dashboard/Projects'
import NewProjectButton from '@/components/dashboard/NewProjectButton'
import License from '@/components/utils/License'
import firebase from '@/firebase'

export default {
  name: 'Dashboard',

  components: {
    Navigation,
    Projects,
    NewProjectButton,
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

      <div class="account">
        <span class="email" v-text="email"></span>
        <button class="button -link" @click="logout()">
          <span>Logout</span>
          <icon class="icon -logout" name="sign-out-alt"/>
        </button>
      </div>

      <h1 class="heading -main">My Projects</h1>

      <NewProjectButton class="new-project-button"/>

      <div class="spacer"/>

    </header>

    <hr/>

    <Projects class="content"/>

    <License/>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.main.-dashboard
  +gap(2rem)
  background-image: linear-gradient(to right, $color-gray--lightest, $color-gray--lighter)
  padding: 1.25rem

  +breakpoint('small')
    padding: 2rem 2.5rem

.header
  +center()
  +chain()
  +gap(2rem)
  width: 100%
  flex-wrap: wrap
  align-items: center

  .heading.-main,
  .spacer
    display: none

  .account
    +chain(1rem)
    justify-content: space-between
    align-items: center
    width: 100%

    .email
      overflow: hidden
      text-overflow: ellipsis

    .icon.-logout
      height: 1.3rem

  .new-project-button
    white-space: nowrap
    margin-right: 2rem

  +breakpoint('small')
    +gap(0)
    +chain()
    flex-wrap: nowrap

    .spacer
      display: block
      flex-grow: 1

    .account
      width: auto
      order: 1

  +breakpoint('medium')

    .heading.-main
      display: block
      margin-right: 2rem
      white-space: nowrap

  // .logo
  //   +chain(.5rem)
  //   align-items: center
  //   font-size: 1.4rem
  //   font-weight: 900
  //   letter-spacing: -.05em
  //   color: $color-brand
  //
  //   .fa-icon
  //     height: 1.4rem

// .navigation
//   max-width: 1rem
//
//   +breakpoint('medium')
//     max-width: none

</style>
