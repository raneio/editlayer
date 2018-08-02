<script>

export default {
  name: 'NewUserModal',

  data () {
    return {
      email: '',
    }
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

  },

  methods: {

    newProject () {
      if (this.name !== null && this.name !== '') {
        this.$store.dispatch('newProject', {
          name: this.name,
        })

        this.closeModal()
      }
    },

    newUser () {
      if (!/\S+@\S+\.\S+/.test(this.email)) {
        console.error('Email is invalid', this.email)

        this.$store.commit('setNotification', {
          mode: 'danger',
          message: `Email ${this.email} is invalid`,
        })
        return false
      }

      this.$store.dispatch('addUserToProject', {
        email: this.email,
        projectId: this.activeProject.id,
      })

      // this.$store.dispatch('newPermission', {
      //   email: this.email,
      //   projectId: this.activeProject.id,
      // })

      this.closeModal()
    },

    closeModal () {
      this.$store.commit('setActiveModal', null)
    },

  },

  mounted () {
    this.$refs.emailAddress.focus()
  },

}
</script>

<template>
<form class="modal" @click.self="closeModal()" @submit.prevent="newUser()" method="post">
  <card-core>
    <header class="header">
      <h1 class="heading -feature">New user</h1>
    </header>

    <main class="main">
      <label class="label">
        <div>Email address</div>
        <input type="text" v-model="email" ref="emailAddress">
      </label>

      <alert-core mode="info" size="small">
        You can add new user even before that user is registered. When user register with the same email address user gets permissions to this project. The invitation will not be sent automatically.
      </alert-core>
    </main>

    <footer class="footer">
      <hr>
      <button-core type="button" light @click.native="closeModal()">Cancel</button-core>
      <button-core type="submit" mode="success">Add new user</button-core>
    </footer>
  </card-core>
</form>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.modal
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: mix($color-black, transparent, 80%)
  z-index: 99999
  +center()

  .card-core
    width: $breakpoint--small
    box-shadow: $shadow--small, $shadow--large
    border: 1px solid $color-gray--light

  .main
    +gap()

  .label
    +gap(.5rem)

</style>
