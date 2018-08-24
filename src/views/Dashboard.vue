<script>
import _ from 'lodash'
import Projects from '@/components/dashboard/Projects'
import NewProjectButton from '@/components/dashboard/NewProjectButton'
import Navigation from '@/components/dashboard/Navigation'
import FooterContent from '@/components/utils/FooterContent'

export default {
  name: 'Dashboard',

  components: {
    Navigation,
    Projects,
    NewProjectButton,
    FooterContent,
  },

  computed: {
    allowCreateProject () {
      return _.get(this.$store.getters, 'auth.permissions.createProject') === true
    },

    isProjects () {
      return !_.isEmpty(this.$store.getters.projects)
    },
  },

  mounted () {
    if (this.$route.params.view && this.$route.params.view !== 'schema') {
      this.$router.push({ name: 'Content', params: { projectId: this.$route.params.view } })
    }
  },

}
</script>

<template>
<section class="dashboard">
  <Navigation/>

  <main class="content">
    <section class="tools">
      <heading-core mode="primary">
        <h1 v-if="isProjects">My projects</h1>
      </heading-core>

      <hr>

      <NewProjectButton v-if="allowCreateProject"/>
    </section>

    <section class="no-projects" v-if="!isProjects">
      <div class="content">
        <icon class="icon" name="kiwi-bird"/>
        <div v-if="allowCreateProject">You don't have any projects. Create the first project by clicking the "New Project" button.</div>
        <div v-if="!allowCreateProject">You don't have a permission to any projects. Come back later or ask more from the administrator.</div>
      </div>
    </section>

    <Projects/>
  </main>

  <footer class="footer">
    <FooterContent/>
  </footer>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.dashboard
  display: flex
  flex-direction: column
  height: 100%
  width: 100%
  overflow-y: auto
  background-image: $color-gray--gradient

  > .content
    display: flex
    flex-direction: column
    flex-grow: 1
    flex-shrink: 0
    +gap(4rem)
    +container($breakpoint--huge)
    padding-top: 2rem
    padding-bottom: 2rem
    // align-items: stretch

    +breakpoint('small')
      padding-top: 4rem
      +gap(3rem)

    .tools
      +gap()
      text-align: center

      +breakpoint('small')
        +gap(0)
        text-align: left
        +chain()

.no-projects
  +center()
  flex-grow: 1

  .content
    +container(300px)
    text-align: center

  .fa-icon
    width: 12rem
    color: $color-gray--light

.footer
  padding-top: 3rem
  padding-bottom: 1rem

</style>
