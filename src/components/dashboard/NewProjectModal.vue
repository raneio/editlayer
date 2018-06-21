<script>

export default {
  name: 'NewProjectModal',

  data () {
    return {
      name: '',
    }
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

    closeModal () {
      this.$store.commit('setActiveModal', null)
    },

  },

  mounted () {
    this.$refs.projectName.focus()
  },

}
</script>

<template>
<form class="modal" @click.self="closeModal()" @submit.prevent="newProject" method="post">
  <card-core>
    <header class="header">
      <h1 class="heading -feature">New Project</h1>
    </header>

    <main class="main">
      <label class="label">
        <div>Project name</div>
        <input type="text" v-model="name" ref="projectName">
      </label>
    </main>

    <footer class="footer">
      <span class="spacer"></span>
      <button-core light @click.native="closeModal()">Cancel</button-core>
      <button-core type="submit" mode="success">Create new project</button-core>
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
  +center()

  .card-core
    width: $breakpoint--small
    box-shadow: $shadow--small, $shadow--large
    border: 1px solid $hr-color

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
