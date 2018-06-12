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
          .collection('deleteJobs')
          .add({
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

    <section class="content">

      <section class="group">
        <header class="heading-group -feature">
          <h1 class="heading">File location</h1>
          <p class="tagline">You can always find latest published JSON file from this URL address</p>
        </header>
        <div class="file-location">
          <a class="link" :href="jsonUrl" :target="jsonTarget" v-text="jsonUrl"></a>
        </div>
      </section>

      <Permissions class="group"/>

      <Webhook class="group"/>

      <section class="group">

        <header class="heading-group -feature">
          <h1 class="heading">Delete project</h1>
          <p class="tagline danger">Your project will be deleted permanently and you can’t undo this.</p>
        </header>

        <button class="button -danger" @click="deleteProject()">
          Delete Project Permamently
        </button>
      </section>

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
  +gap(5rem)

.content
  max-width: $breakpoint--medium

.group
  +gap(.5rem)

  & + .group
    margin-top: 6rem

.roles
  +gap(.5rem)

  .role
    +chain(.25rem)
    align-items: center

    .email
      flex-shrink: 1
      min-width: 4rem
      overflow-x: hidden
      text-overflow: ellipsis

    .button.-pill
      font-size: .8rem

      &.-delete
        width: 2.5rem
        flex-shrink: 0

    &.-me
      padding-right: 2.75rem

  .spacer
    height: .8rem
    flex-grow: 1
    background-image: linear-gradient(to right, $color-gray 10%, transparent 0%)
    background-position: bottom
    background-size: 10px 1px
    background-repeat: repeat-x

.danger
  color: $color-danger

.file-location
  +chain(1.5rem)

  .link
    font-weight: 700
    overflow: hidden
    text-overflow: ellipsis

</style>
