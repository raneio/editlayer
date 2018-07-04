<script>
import Editor from '@/components/content/Editor'

export default {
  name: 'Content',

  components: {
    Editor,
  },

  computed: {
    activeStructure () {
      return this.$store.getters.activeStructure
    },
  },
}
</script>

<template>
<main class="content">
  <div class="no-content" v-if="activeStructure._type !== 'item'">
    <icon class="icon" name="kiwi-bird"/>
  </div>

  <Editor v-if="activeStructure._type === 'item'"/>
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
    width: 40%
    max-height: 40%
    min-height: 5rem
    color: $color-gray--lighter

</style>
