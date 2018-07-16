<script>
import validator from 'validator'

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
      if (!validator.isEmail(this.email)) {
        console.error('Email is invalid', this.email)
        this.$store.commit('setNotification', {
          mode: 'danger',
          message: `Email ${this.email} is invalid`,
        })
        return false
      }

      this.$store.dispatch('newPermission', {
        email: this.email,
        projectId: this.activeProject.id,
      })

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
<form class="modal" @click.self="closeModal()" @submit.prevent="newUser" method="post">
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
        You can add new user even before that user is registered. When user register with the same email address user gets permissions to this project.
      </alert-core>
    </main>

    <footer class="footer">
      <span class="spacer"></span>
      <button-core light @click.native="closeModal()">Cancel</button-core>
      <button-core type="submit" mode="success">Add new user</button-core>
    </footer>
  </card-core>
</form>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

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
    border: 1px solid $hr-color

  .main
    +gap()

  .label
    +gap(.5rem)

  // .header,
  // .content,
  // .footer
  //   padding: 1rem 1.5rem

  // .content
  //   +gap(2rem)
  //
  // .footer
  //   +chain(1rem)
  //   font-size: .8rem

  .spacer
    flex-grow: 1

</style>
