<script>
import _ from 'lodash'
import validator from 'validator'
import firebase from '@/firebase'
import Breadcrumb from '@/components/Breadcrumb'
import Navigation from '@/components/Navigation'

export default {
  name: 'Settings',

  components: {
    Breadcrumb,
    Navigation
  },

  data () {
    return {
      trigger: {
        method: 'GET',
        url: null
      }
    }
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    user () {
      return this.$store.state.user
    },

    roles () {
      return this.activeProject.roles
    }

  },

  watch: {

    activeProject () {
      if (this.activeProject !== null) {
        this.trigger.method = this.activeProject.trigger.method
        this.trigger.url = this.activeProject.trigger.url
      }
    },

    'trigger.method': function () {
      this.updateTrigger()
    },

    'trigger.url': _.debounce(function () {
      this.updateTrigger()
    }, 500)

  },

  methods: {

    newPermission () {
      let email = prompt('Email address', 'name@example.com')

      if (email !== null && !validator.isEmail(email)) {
        console.error('Email is invalid', email)
      } else if (email !== null) {

        let notificationId = Math.random().toString(36).slice(-8)

        this.$store.commit('setNotification', {
          id: notificationId,
          status: 'info',
          message: `Adding user "${email}", please wait...`,
        })

        firebase.firestore
          .collection('projects')
          .doc(this.activeProject.projectId)
          .collection('permissionJobs')
          .add({
            role: 'editor',
            email: email
          })
          .then(() => {
            console.log('Permission job added')
          })
          .catch(error => {
            console.error('Permission job adding failed', error)
          })
      }
    },

    updatePermission (payload) {
      let updateData = {}
      updateData[`roles.${payload.roleId}.role`] = payload.role

      console.log('updatePermission', updateData)

      firebase.firestore
        .collection('projects')
        .doc(this.activeProject.projectId)
        .update(updateData)
        .then(() => console.log('Permission updated!'))
        .catch((error) => console.error('Permission updating failed', error))
    },

    removePermission (payload) {
      let deleteConfirm = confirm(`You want to remove "${payload.email}". Are you sure?`)

      if (deleteConfirm === true) {
        let updateData = {}
        updateData[`roles.${payload.roleId}`] = firebase.firestoreDelete

        firebase.firestore
          .collection('projects')
          .doc(this.activeProject.projectId)
          .update(updateData)
          .then(() => console.log('Permission deleted'))
          .catch((error) => console.error('Permission deleting failed', error))
      }
    },

    updateTrigger (payload) {
      let updateData = {}
      updateData['trigger.method'] = this.trigger.method
      updateData['trigger.url'] = this.trigger.url

      firebase.firestore
        .collection('projects')
        .doc(this.activeProject.projectId)
        .update(updateData)
        .then(() => console.log('Trigger updated', updateData))
        .catch((error) => console.error('Trigger updating failed', error))
    },

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
            deleteProjectId: this.activeProject.projectId
          })
          .then(() => {
            this.$router.push({ name: 'Content' })
            console.log('Project Deleted')
          })
          .catch((error) => console.error('Project deleting failed', error))
      }
    }

  },

  mounted () {
    if (this.activeProject !== null) {
      this.trigger.method = (this.activeProject.trigger.method) ? this.activeProject.trigger.method : 'GET'
      this.trigger.url = this.activeProject.trigger.url
    }
  }

}
</script>

<template>
<section class="layout">
  <Navigation/>

  <main class="settings" v-if="activeProject">

    <Breadcrumb/>

    <section class="group">
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
        class="button -link -new"
        @click="newPermission()"
      >
        + New User
      </button>
    </section>

    <section class="group">

      <header class="heading-group">
        <h1 class="heading">Webhook</h1>
        <p class="tagline">Trigger request when publish is done</p>
      </header>


      <div class="input-group">
        <select v-model="trigger.method" class="select-method">
          <option>GET</option>
          <option>POST</option>
        </select>
        <input class="grow" type="text" v-model="trigger.url" placeholder="https://example.com/folder/?foo=bar">
      </div>
    </section>

    <section class="group">
      <h1 class="heading">
        Delete project
      </h1>
      <div class="danger">
        Your project will be deleted permanently and you can’t undo this.
      </div>
      <button class="button -danger delete-project" @click="deleteProject()">
        Delete Project Permamently
      </button>
    </section>

  </main>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.settings
  overflow-y: auto
  padding: .25rem 2.5rem 2.5rem
  +margin-to-childs(2rem)

.group
  +margin-to-childs(.5rem)
  max-width: 35rem

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
  border: 1px solid $color-danger
  color: $color-danger
  border-radius: $button-border-radius
  padding: .5rem 1rem
  font-size: .9rem
  font-weight: 600

.delete-project
  font-size: .8rem

.select-method
  font-size: .9rem

</style>
