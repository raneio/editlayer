<script>
// import validator from 'validator'
import NewUserButton from '@/components/settings/NewUserButton'

export default {
  name: 'Permissions',

  components: {
    NewUserButton,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    auth () {
      return this.$store.state.auth
    },

  },

  methods: {

    // newPermission () {
    //   let email = prompt('Email address', '')
    //   if (email === null) return false
    //
    //   if (!validator.isEmail(email)) {
    //     console.error('Email is invalid', email)
    //     this.$store.commit('setNotification', {
    //       mode: 'danger',
    //       message: `Email ${email} is invalid`,
    //     })
    //     return false
    //   }
    //
    //   this.$store.dispatch('newPermission', {
    //     email,
    //     projectId: this.activeProject.id,
    //   })
    // },

    updatePermission (payload) {
      this.$store.dispatch('updatePermission', payload)
    },

    removePermission (payload) {
      let deleteConfirm = confirm(`You want to remove "${payload.email}". Are you sure?`)

      if (deleteConfirm === true) {
        this.$store.dispatch('removePermission', payload)
      }
    },

  },

  created () {
    if (this.$store.getters.activeProject.role !== 'admin') {
      this.$router.replace({name: 'Content', params: {projectId: this.activeProject.id}})
    }
  },

}
</script>

<template>
<section class="permission">
  <heading-core mode="secondary">
    <h2>User permissions</h2>
  </heading-core>

  <card-core>
    <main class="main">

      <ul class="users">
        <li class="user">

          <div class="email" :title="auth.email" v-text="auth.email"></div>

          <div class="spacer"></div>

          <div class="permission">
            <select class="select" disabled>
              <option>Admin</option>
            </select>
          </div>

          <div class="remove">
            <button-core light disabled>
                <icon name="trash"/>
            </button-core>
          </div>

        </li>

        <li
          v-for="(user, userId) in activeProject.users"
          :key="userId"
          v-if="userId !== auth.id"
          class="user"
        >
          <div class="email" :title="user.email" v-text="user.email"></div>

          <div class="spacer"></div>

          <div class="permission">
            <select
              class="select"
              v-model="user.role"
              @change="updatePermission({userId, role: user.role})"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div class="remove">
            <button-core light @click.native="removePermission({userId, email: user.email})">
                <icon name="trash"/>
            </button-core>
          </div>

        </li>
      </ul>

    </main>
  </card-core>

  <NewUserButton/>

  <!-- <button-core mode="success" @click.native="newPermission()">
    <icon name="plus"/>
    <span>New User</span>
  </button-core> -->
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.permission
  +gap()

.card
  padding: 1rem 1rem

  +breakpoint('small')
    padding-left: 2rem
    padding-right: 2rem

.users
  +gap(.5rem)

  .user
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
