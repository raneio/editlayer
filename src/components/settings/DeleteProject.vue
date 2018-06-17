<script>
// import validator from 'validator'
import firebase from '@/utils/firebase'
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

  methods: {

    deleteProject () {
      let deleteConfirm = prompt(`Write "${this.activeProject.projectId}" if you really want to delete project permanently.`, '')

      if (deleteConfirm !== null && deleteConfirm !== this.activeProject.projectId) {
        console.error('Project Id is invalid', deleteConfirm)
      }
      else if (deleteConfirm !== null) {
        firebase.firestore
          .collection('projects')
          .doc(this.activeProject.projectId)
          .collection('jobs')
          .add({
            job: 'deleteProject',
            deleteProjectId: this.activeProject.projectId,
          })
          .then(() => {
            this.$store.commit('setNotification', {
              status: 'info',
              message: `Deleting project "${this.activeProject.projectId}", please wait...`,
            })

            this.$router.push({ name: 'Dashboard' })
            console.log('Project Deleted')
          })
          .catch((error) => console.error('Project deleting failed', error))
      }
    },

  },

  created () {
    if (this.$store.getters.activeRole !== 'admin') {
      this.$router.replace({name: 'Content', params: {projectId: this.$store.getters.activeProject.projectId}})
    }
  },

}
</script>

<template>
<section class="group -delete-project">
  <header class="heading -feature">
    <h2 class="heading">Delete project</h2>
    <p class="tagline">Your project will be deleted permanently and you can’t undo this.</p>
  </header>

  <button class="button -danger -link" @click="deleteProject()">
    Delete Project Permamently
  </button>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'
</style>
