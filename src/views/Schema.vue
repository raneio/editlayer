<script>
import SchemaEditor from '@/components/schema/SchemaEditor'

export default {
  name: 'Schema',

  components: {
    SchemaEditor,
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

  },

  created () {
    if (this.activeProject.auth.permissions.updateSchema !== true) {
      this.$router.replace({name: 'Content', params: {projectId: this.activeProject.id}})
    }
  },
}
</script>

<template>
<section class="schema">
  <heading-core mode="primary">
    <h1>Schema</h1>
  </heading-core>

  <SchemaEditor/>
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.schema
  +gap()
  background-color: $background-color
  padding: 2rem 1.5rem

  +breakpoint('medium')
    padding: 2rem 3rem

</style>
