<script>
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
        <h1>My Projects</h1>
      </heading-core>

      <NewProjectButton/>
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
@import '../core/sass/mixins'

.dashboard
  display: flex
  flex-direction: column
  height: 100%
  width: 100%
  background-image: $color-gray--gradient

.content
  flex-grow: 1
  +gap(4rem)
  +container($breakpoint--huge)
  padding-top: 2rem
  padding-bottom: 2rem

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
    justify-content: space-between

.footer
  padding-top: 3rem
  padding-bottom: 1rem

</style>
