<script>
// import validator from 'validator'
import firebase from '@/firebase'
import Navigation from '@/components/Navigation'
import Webhook from '@/components/settings/Webhook'
import Permissions from '@/components/settings/Permissions'

export default {
  name: 'Settings',

  components: {
    Navigation,
    Webhook,
    Permissions,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    // user () {
    //   return this.$store.state.user
    // },

    // roles () {
    //   return this.activeProject.roles
    // },

    jsonUrl () {
      return this.$store.getters.jsonUrl
    },

    jsonTarget () {
      if (!this.activeProject) return false
      return this.activeProject.projectId
    },

  },

  methods: {

    // newPermission () {
    //   let email = prompt('Email address', 'name@example.com')
    //
    //   if (email !== null && !validator.isEmail(email)) {
    //     console.error('Email is invalid', email)
    //   } else if (email !== null) {
    //     let notificationId = Math.random().toString(36).slice(-8)
    //
    //     this.$store.commit('setNotification', {
    //       id: notificationId,
    //       status: 'info',
    //       message: `Adding user "${email}", please wait...`,
    //     })
    //
    //     firebase.firestore
    //       .collection('projects')
    //       .doc(this.activeProject.projectId)
    //       .collection('permissionJobs')
    //       .add({
    //         role: 'editor',
    //         email: email,
    //       })
    //       .then(() => {
    //         console.log('Permission job added')
    //       })
    //       .catch(error => {
    //         console.error('Permission job adding failed', error)
    //       })
    //   }
    // },

    // updatePermission (payload) {
    //   let updateData = {}
    //   updateData[`roles.${payload.roleId}.role`] = payload.role
    //
    //   console.log('updatePermission', updateData)
    //
    //   firebase.firestore
    //     .collection('projects')
    //     .doc(this.activeProject.projectId)
    //     .update(updateData)
    //     .then(() => console.log('Permission updated!'))
    //     .catch((error) => console.error('Permission updating failed', error))
    // },

    // removePermission (payload) {
    //   let deleteConfirm = confirm(`You want to remove "${payload.email}". Are you sure?`)
    //
    //   if (deleteConfirm === true) {
    //     let updateData = {}
    //     updateData[`roles.${payload.roleId}`] = firebase.firestoreDelete
    //
    //     firebase.firestore
    //       .collection('projects')
    //       .doc(this.activeProject.projectId)
    //       .update(updateData)
    //       .then(() => console.log('Permission deleted'))
    //       .catch((error) => console.error('Permission deleting failed', error))
    //   }
    // },

    deleteProject () {
      let deleteConfirm = prompt(`Write "${this.activeProject.projectId}" if you really want to delete project permanently.`, '')

      if (deleteConfirm !== null && deleteConfirm !== this.activeProject.projectId) {
        console.error('Project Id is invalid', deleteConfirm)
      } else if (deleteConfirm !== null) {
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
<section class="layout">
  <Navigation/>

  <main class="main -settings" v-if="activeProject">

    <section class="group">
      <header class="heading-group">
        <h1 class="heading">File location</h1>
        <p class="tagline">You can always find latest published JSON file from this URL address</p>
      </header>
      <div class="file-location">
        <a :href="jsonUrl" :target="jsonTarget" v-text="jsonUrl"></a>
        <button class="button -link">
          <svg width="22" height="19" viewBox="0 0 22 19" xmlns="http://www.w3.org/2000/svg"><path d="M17.187.25c.141 0 .258.07.352.211l3.516 5.73c.117.164.105.329-.036.493l-9.703 11.425c-.07.094-.175.141-.316.141-.14 0-.246-.047-.316-.14L.98 6.683C.84 6.52.828 6.355.945 6.19L4.461.461c.094-.14.21-.211.351-.211h12.375zm-.492 1.266H14.41l1.969 4.359h2.918l-2.602-4.36zm-3.691 0H8.996L6.992 5.875h8.016l-2.004-4.36zm-7.7 0l-2.6 4.359H5.62l1.969-4.36H5.305zM3.02 7l5.449 6.75L5.586 7H3.02zm3.937 0L11 16.281 15.043 7H6.957zm6.574 6.75L18.981 7h-2.567l-2.883 6.75z" fill="#252525" fill-rule="evenodd"/></svg>
          <div>Copy</div>
        </button>
      </div>
    </section>

    <Permissions class="group"/>

    <!-- <section class="group">
      <h1 class="heading">
        User permissions
      </h1>

      <ul class="roles">
        <li class="role -me">
          <div class="email" :title="user.email" v-text="user.email"></div>
          <div class="spacer"></div>
          <button class="button -pill -active">Admin</button>
        </li>
        <li
          v-for="(role, roleId) in roles"
          :key="roleId"
          v-if="roleId !== user.id"
          class="role"
        >
          <div class="email" :title="role.email" v-text="role.email"></div>

          <div class="spacer"></div>

          <button
            class="button -pill"
            :class="{ '-active': role.role === 'editor'}"
            @click="updatePermission({
              roleId, roleId,
              role: 'editor',
              email: role.email,
            })"
            >
            Editor
          </button>

          <button
            class="button -pill"
            :class="{ '-active': role.role === 'admin'}"
            @click="updatePermission({
              roleId: roleId,
              role: 'admin',
              email: role.email,
            })"
            >
            Admin
          </button>

          <button
            class="button -pill -danger -delete"
            @click="removePermission({
              roleId: roleId,
              email: role.email,
            })"
            >
              <img src="@/assets/icon-delete.svg" alt="">
          </button>
        </li>
      </ul>

      <button
        class="button -link -green"
        @click="newPermission()"
      >
        + New User
      </button>
    </section> -->

    <Webhook class="group"/>

    <section class="group">

      <header class="heading-group">
        <h1 class="heading">Delete project</h1>
        <p class="tagline danger">Your project will be deleted permanently and you can’t undo this.</p>
      </header>

      <button class="button -red delete-project" @click="deleteProject()">
        Delete Project Permamently
      </button>
    </section>

  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.main.-settings
  background-image: linear-gradient(to left, mix($color-violet, transparent, 4%), mix($color-violet, transparent, 8%))
  overflow-y: auto
  padding: 2.5rem
  +margin-to-childs(2rem)

.group
  +margin-to-childs(.5rem)
  max-width: 45rem

  & + .group
    margin-top: 6rem

.roles
  +margin-to-childs(.5rem)

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
    background-image: linear-gradient(to right, $color-disabled 10%, transparent 0%)
    background-position: bottom
    background-size: 10px 1px
    background-repeat: repeat-x

.danger
  color: $color-danger

.delete-project
  font-size: .8rem

.select-method
  font-size: .9rem

.file-location
  +chain(1.5rem)

  a
    font-weight: 700

</style>
