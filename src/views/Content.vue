<script>
import Editor from '@/components/content/Editor'

export default {
  name: 'Content',

  components: {
    Editor,
  },

  computed: {
    activeSchema () {
      return this.$store.getters.activeSchema
    },
  },
}
</script>

<template>
<main class="content">
  <heading-core mode="primary">
    <h1>{{activeSchema.TITLE}}</h1>
  </heading-core>

  <alert-core mode="info" v-if="activeSchema.INFO">
    {{activeSchema.INFO}}
  </alert-core>

  <Editor/>
</main>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../core/sass/mixins'

.content
  +gap()
  padding: 2rem

</style>
