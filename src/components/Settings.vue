<script>
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

  },
}
</script>


<template>
<main class="settings">
  <Breadcrumb/>

  <section class="group">
    <h1 class="heading">
      User permissions
    </h1>
    <p>
      User permissions, file removing, and other settings will come  available later.
    </p>
  </section>

  <section class="group">
    <h1 class="heading">
      Trigger GET request after publish
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
  max-width: 35rem


.group
  +margin-to-childs(.5rem)

  & + .group
    margin-top: 6rem

.danger
  border: 1px solid $color-danger
  background-color: mix($color-background, $color-danger, 95%)
  border-radius: $button-border-radius
  padding: .5rem 1rem
  font-size: .9rem

</style>
