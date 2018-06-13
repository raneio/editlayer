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
<section class="dashboard-layout">

  <nav class="navigation">
    <a class="button -link -invert logo" href="https://editlayer.com">
      <icon name="editlayer"/>
      <span>Editlayer</span>
    </a>

    <button class="button -link -invert logout" @click="logout()">
      <span>Logout</span>
      <icon class="icon -logout" name="sign-out-alt"/>
    </button>
  </nav>

  <main class="main">
    <div class="tools">
      <h1 class="heading -main">My Projects</h1>
      <NewProjectButton/>
    </div>
    <Projects/>
  </main>

  <License/>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.dashboard-layout
  display: flex
  flex-direction: column
  height: 100%

.navigation
  +chain()
  +gap(2rem)
  +invert()
  width: 100%
  background: linear-gradient(to bottom, $color-brand, mix($color-brand, $color-black, 85%))
  padding: 2rem 1.25rem
  justify-content: space-between

  +breakpoint('small')
    padding: 1.5rem 2.5rem

  .logo
    +chain(.5rem)
    font-weight: 900
    font-size: 1.5rem

    .link
      +center()

    .fa-icon
      flex-shrink: 0
      height: 1.5rem

  .logout

    .fa-icon
      flex-shrink: 0
      height: 1.5rem

.main
  flex-grow: 1
  padding: 2rem 1.25rem
  +gap(2rem)

  +breakpoint('small')
    padding: 3rem 2.5rem

  .tools
    +chain()
    justify-content: space-between

    +breakpoint('small')
      font-size: 1.5rem

</style>
