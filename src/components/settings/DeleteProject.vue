<script>
import Navigation from '@/components/navigation/Navigation'
import FileLocation from '@/components/settings/FileLocation'
import Webhook from '@/components/settings/Webhook'
import Permissions from '@/components/settings/Permissions'
import DeleteProject from '@/components/settings/DeleteProject'
import Footer from '@/components/utils/Footer'

export default {
  name: 'Settings',

  components: {
    Navigation,
    FileLocation,
    Webhook,
    Permissions,
    DeleteProject,
    Footer,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

  },

  methods: {

    deleteProject () {
      let deleteConfirm = prompt(`Write "${this.activeProject.id}" if you really want to delete project permanently.`, '')
      if (deleteConfirm === null) return null
      if (deleteConfirm !== this.activeProject.id) {
        console.error('Project Id is invalid', deleteConfirm)
        return null
      }

      this.$store.dispatch('deleteProject', {id: this.activeProject.id})

      this.$store.commit('setNotification', {
        mode: 'info',
        message: `Deleting project "${this.activeProject.id}", please wait...`,
      })

      this.$router.push({ name: 'Dashboard' })
    },

  },

  created () {
    if (this.$store.getters.activeProject.role !== 'admin') {
      this.$router.replace({name: 'Content', params: {projectId: this.$store.getters.activeProject.id}})
    }
  },

}
</script>

<template>
<section class="group -delete-project">
  <heading-core mode="secondary">
    <h2>Delete project</h2>
    <p>Your project will be deleted permanently and you can’t undo this.</p>
  </heading-core>

  <button-core mode="danger" size="small" light @click.native="deleteProject()">
    Delete Project Permamently
  </button-core>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'
</style>
