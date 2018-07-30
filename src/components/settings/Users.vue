<script>
import NewUserButton from '@/components/settings/NewUserButton'

export default {
  name: 'Users',

  components: {
    NewUserButton,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    auth () {
      return this.$store.getters.auth
    },

  },

  methods: {

    updatePermission (user) {
      // console.log('updatePermission', user)
      let permissions = {}

      if (user.role === 'admin') {
        permissions = {
          publish: true,
          updateDraft: true,
          updateSchema: true,
          updateSettings: true,
          updateUsers: true,
          createJob: true,
        }
      }
      else if (user.role === 'editor') {
        permissions = {
          publish: true,
          updateDraft: true,
          updateSchema: false,
          updateSettings: false,
          updateUsers: false,
          createJob: false,
        }
      }

      this.$store.dispatch('updatePermission', {
        userId: user.id,
        projectId: this.activeProject.id,
        permissions,
      })

      // this.$store.dispatch('updatePermission', payload)
    },

    removeUser (user) {
      let deleteConfirm = confirm(`You want to remove "${user.email}". Are you sure?`)

      if (deleteConfirm === true) {
        this.$store.dispatch('removeUserFromProject', {
          userId: user.id,
          projectId: this.activeProject.id,
        })
      }
    },

  },

}
</script>

<template>
<section class="users">
  <heading-core mode="secondary">
    <h2>Users</h2>
    <p>You can add permissions to other users.</p>
  </heading-core>

  <card-core>
    <main class="main">

      <ul class="users">
        <li
          v-for="user in activeProject.users"
          :key="user.id"
          class="user"
        >
          <div class="email" :title="user.email" v-text="user.email"></div>

          <hr>

          <div class="user">
            <select
              class="select"
              v-model="user.role"
              @change="updatePermission(user)"
              :disabled="user.id === auth.id"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div class="remove">
            <button-core
              light
              @click.native="removeUser(user)"
              :disabled="user.id === auth.id"
            >
                <icon name="trash"/>
            </button-core>
          </div>
        </li>
      </ul>

    </main>
  </card-core>

  <NewUserButton/>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.card
  padding: 1rem 1rem

  +breakpoint('small')
    padding-left: 2rem
    padding-right: 2rem

.users
  +gap()

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

    .select
      padding-top: .25rem
      padding-bottom: .25rem

    .user
      flex-shrink: 0

    .remove
      flex-shrink: 0

    .fa-icon
      height: 1rem

</style>
