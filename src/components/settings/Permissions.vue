<script>
import validator from 'validator'
import firebase from '@/firebase'

export default {
  name: 'Permissions',

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    user () {
      return this.$store.state.user
    },

    roles () {
      return this.activeProject.roles
    },

  },

  methods: {

    newPermission () {
      let email = prompt('Email address', 'name@example.com')

      if (email !== null && !validator.isEmail(email)) {
        console.error('Email is invalid', email)
      }
      else if (email !== null) {
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

  },

  created () {
    if (this.$store.getters.activeRole !== 'admin') {
      this.$router.replace({name: 'Content', params: {projectId: this.$store.getters.activeProject.projectId}})
    }
  },

}
</script>

<template>
<section class="permissions">
  <h1 class="heading -feature">
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
        class="button -link -danger"
        @click="removePermission({
          roleId: roleId,
          email: role.email,
        })"
        >
          <icon name="trash"/>
      </button>
    </li>
  </ul>

  <button
    class="button -link -success"
    @click="newPermission()"
  >
    + New User
  </button>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.group
  +gap(.5rem)
  max-width: 45rem

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

.delete-project
  font-size: .8rem

.select-method
  font-size: .9rem

.file-location
  +chain(1.5rem)

  a
    font-weight: 700

</style>
