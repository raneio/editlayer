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
      let email = prompt('Email address', '')

      if (email === null) return false

      if (!validator.isEmail(email)) {
        console.error('Email is invalid', email)
        this.$store.commit('setNotification', {
          status: 'error',
          message: `Email ${email} is invalid`,
        })
        return false
      }

      let notificationId = Math.random().toString(36).slice(-8)

      this.$store.commit('setNotification', {
        id: notificationId,
        status: 'info',
        message: `Adding user "${email}", please wait...`,
      })

      firebase.firestore
        .collection('projects')
        .doc(this.activeProject.projectId)
        .collection('jobs')
        .add({
          job: 'attachRole',
          role: 'editor',
          email: email,
        })
        .then(() => {
          // console.log('Permission job added')
        })
        .catch(error => {
          console.error('Permission job adding failed', error)
        })
    },

    updatePermission (payload) {
      let updateData = {}
      updateData[`roles.${payload.roleId}.role`] = payload.role

      // console.log('updatePermission', updateData)

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

  <div class="card">

    <ul class="roles">
      <li class="role">

        <div class="email" :title="user.email" v-text="user.email"></div>

        <div class="spacer"></div>

        <div class="permission">
          <select class="select" disabled>
            <option>Admin</option>
          </select>
        </div>

        <div class="remove">
          <button class="button -link -danger" disabled>
              <icon name="trash"/>
          </button>
        </div>

      </li>

      <li
        v-for="(role, roleId) in roles"
        :key="roleId"
        v-if="roleId !== user.id"
        class="role"
      >
        <div class="email" :title="role.email" v-text="role.email"></div>

        <div class="spacer"></div>

        <div class="permission">
          <select
            class="select"
            v-model="role.role"
            @change="updatePermission({roleId, roleId, role: role.role})"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        <div class="remove">
          <button class="button -link -danger" @click="removePermission({roleId: roleId, email: role.email})">
              <icon name="trash"/>
          </button>
        </div>

      </li>
    </ul>

  </div>

  <button class="button -success -small" @click="newPermission()">
    <icon name="plus"/>
    <span>New User</span>
  </button>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.permissions
  +gap(1rem)

.card
  padding: 1rem 1rem

  +breakpoint('small')
    padding-left: 2rem
    padding-right: 2rem

.roles
  +gap(.5rem)

  .role
    +chain(1rem)

    +breakpoint('small')
      +chain(2rem)

    &:hover
      .email
        color: $color-gray--dark

    .email
      min-width: 4rem
      overflow-x: hidden
      text-overflow: ellipsis

    .spacer
      flex-grow: 1

    .select
      padding-top: .25rem
      padding-bottom: .25rem

    .permission
      flex-shrink: 0

    .remove
      flex-shrink: 0

    .fa-icon
      height: 1rem

</style>
