<script>
import Navigation from '@/components/navigate/Navigation'
import FileLocation from '@/components/settings/FileLocation'
import Webhook from '@/components/settings/Webhook'
import Permissions from '@/components/settings/Permissions'
import DeleteProject from '@/components/settings/DeleteProject'
import License from '@/components/utils/License'

export default {
  name: 'Settings',

  components: {
    Navigation,
    FileLocation,
    Webhook,
    Permissions,
    DeleteProject,
    License,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

  },

  created () {
    if (this.$store.getters.activeRole !== 'admin') {
      this.$router.replace({name: 'Content', params: {projectId: this.activeProject.projectId}})
    }
  },

}
</script>

<template>
<section class="app-layout">
  <Navigation/>

  <main class="main -settings" v-if="activeProject">
    <div class="container">
    <h1 class="heading -main">Project settings</h1>

    <FileLocation class="group"/>

    <hr>

    <Permissions class="group"/>

    <hr>

    <Webhook class="group"/>

    <hr>

    <DeleteProject class="group"/>

    <License/>

    </div>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.main.-settings
  padding-top: 2rem

.container
  max-width: $breakpoint--medium
  +gap(3rem)

.main.-settings /deep/

  .group
    +gap(.5rem)

</style>
