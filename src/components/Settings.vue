<script>
import validator from 'validator'
import firebase from '@/firebase'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'Settings',

  components: {
    Breadcrumb,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    user () {
      return this.$store.state.user
    },

  },

  methods: {

    newPermission () {

      let email = prompt('email', 'name@example.com');

      if (email !== null && !validator.isEmail(email)) {
        console.error('Email is invalid', email)
      }
      else if (email !== null) {

        firebase.firestore
          .collection('projects')
          .doc(this.activeProject.projectId)
          .collection('permissionJobs')
          .add({
            role: 'editor',
            email: email,
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

    deletePermission (roleId) {
      let deleteConfirm = confirm('Are you sure?');

      if (deleteConfirm === true) {

        let updateData = {}
        updateData[`roles.${roleId}`] = firebase.firestoreDelete

        firebase.firestore
          .collection('projects')
          .doc(this.activeProject.projectId)
          .update(updateData)
          .then(() => console.log('Permission deleted'))
          .catch((error) => console.error('Permission deleting failed', error))

      }

    },

  },

}
</script>


<template>
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
        v-for="(role, roleId) in activeProject.roles"
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
          @click="deletePermission(roleId)"
          >
            <img src="../assets/icon-delete.svg" alt="">
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
    <h1 class="heading">
      Trigger request after publish
    </h1>
    <input type="text" name="" value="" placeholder="https://example.com/folder/?foo=bar">
  </section>

  <section class="group">
    <h1 class="heading">
      Delete project
    </h1>
    <div class="danger">
      <strong>Caution!</strong> Your project will be deleted permanently and you can’t undo this.
    </div>
    <button class="button -danger">
      Delete Project Permamently
    </button>
  </section>

</main>
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
  // border: 1px solid $color-danger
  // +invert-colors()
  // background-color: $color-danger
  background-color: mix($color-background, $color-danger, 75%)
  color: $color-danger
  border-radius: $button-border-radius
  padding: .5rem 1rem
  font-size: .9rem

</style>
