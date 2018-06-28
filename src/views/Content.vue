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
  <div class="no-content" v-if="activeSchema._type !== 'value'">
    <icon class="icon" name="regular/times-circle"/>
  </div>

  <Editor v-if="activeSchema._type === 'value'"/>
</main>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../core/sass/mixins'

.content
  display: flex
  +gap()
  padding: 2rem 3rem

.no-content
  align-self: stretch
  width: 100%
  +center()

  .icon
    width: 50%
    max-height: 50%
    min-height: 5rem
    color: $color-gray--lighter

</style>
