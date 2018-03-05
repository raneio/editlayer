<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'Settings',

  components: {
    Breadcrumb,
  },
}
</script>


<template>
<main class="settings">
  <Breadcrumb/>

  <section class="group">
    <h1 class="heading">
      Settings
    </h1>
    <p>
      User permissions, file removing, and other settings will come  available later.
    </p>
  </section>

</main>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.settings
  overflow-y: auto
  padding: .25rem 2.5rem 2.5rem
  +margin-to-childs(2rem)

</style>
