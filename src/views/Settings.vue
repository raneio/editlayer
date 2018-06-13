<script>
// import validator from 'validator'
import firebase from '@/firebase'
import Navigation from '@/components/navigate/Navigation'
import Webhook from '@/components/settings/Webhook'
import Permissions from '@/components/settings/Permissions'
import License from '@/components/utils/License'

export default {
  name: 'Settings',

  components: {
    Navigation,
    Webhook,
    Permissions,
    License,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    jsonUrl () {
      return this.$store.getters.jsonUrl
    },

    jsonTarget () {
      if (!this.activeProject) return false
      return this.activeProject.projectId
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
<section class="app-layout">
  <Navigation/>

  <main class="main -settings" v-if="activeProject">
    <h1 class="heading -main">Project settings</h1>

    <section class="group">
      <header class="heading -feature">
        <h2 class="heading">File location</h2>
        <p class="tagline">You can always find latest published JSON file from this URL address</p>
      </header>

      <a class="file-link" :href="jsonUrl" :target="jsonTarget" v-text="jsonUrl"></a>
    </section>

    <section class="group">
      <h2 class="heading -feature">User permissions</h2>
      <Permissions/>
    </section>

    <section class="group">
      <header class="heading -feature">
        <h1 class="heading">Webhook</h1>
        <p class="tagline">We will send a custom POST/GET request to the URL when publishing is done.</p>
      </header>

      <Webhook class="group"/>
    </section>

    <section class="group">
      <header class="heading -feature">
        <h2 class="heading">Delete project</h2>
        <p class="tagline">Your project will be deleted permanently and you can’t undo this.</p>
      </header>

      <button class="button -danger" @click="deleteProject()">
        Delete Project Permamently
      </button>
    </section>

    <License/>
  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.main.-settings
  padding-top: 2rem
  +gap(6rem)

.group
  +gap(.5rem)
  max-width: $breakpoint--medium

.file-link
  display: block
  font-weight: 700
  overflow: hidden
  text-overflow: ellipsis

</style>
