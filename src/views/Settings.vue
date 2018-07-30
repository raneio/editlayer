<script>
import FileLocation from '@/components/settings/FileLocation'
import Webhook from '@/components/settings/Webhook'
import Users from '@/components/settings/Users'
import DeleteProject from '@/components/settings/DeleteProject'

export default {
  name: 'Settings',

  components: {
    FileLocation,
    Webhook,
    Users,
    DeleteProject,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

  },

  created () {
    if (this.activeProject.auth.permissions.updateSettings !== true) {
      this.$router.replace({name: 'Content', params: {projectId: this.activeProject.id}})
    }
  },

}
</script>

<template>
<section class="settings">
  <heading-core mode="primary">
    <h1>Project settings</h1>
  </heading-core>

  <!-- <section class="section">
    <label>
      Project Name
      <input type="text" name="" value="">
    </label>

    <label>
      Published content JSON
      <input type="text" name="" value="https://firebasestorage.googleapis.com/v0/b/editlayer-development.appspot.com/o/xdev%2Fcontent.json?alt=media&token=hgai3jgal2lp2z">
      <button-core>Copy</button-core>
      <button-core>Open</button-core>
    </label>
  </section> -->

  <FileLocation class="section"/>

  <Users class="section"/>

  <Webhook class="section"/>

  <DeleteProject class="section"/>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.settings
  background-image: $color-gray--gradient
  padding: 2rem 1.5rem

  +breakpoint('medium')
    padding: 2rem 3rem

.section
  padding-top: 5rem
  padding-bottom: 5rem
  padding-right: calc(100% - #{$breakpoint--medium})
  border-bottom: 1px solid $color-gray--light

</style>
