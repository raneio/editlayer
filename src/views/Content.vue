<script>
import Editor from '@/components/content/Editor'

export default {
  name: 'Content',

  components: {
    Editor,
  },

  computed: {
    activeItem () {
      return this.$store.getters.activeItem
    },
  },
}
</script>

<template>
<main class="content">
  <div class="no-content" v-if="activeItem._type !== 'item'">
    <icon class="icon" name="kiwi-bird"/>
  </div>

  <Editor v-if="activeItem._type === 'item'"/>
</main>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.content
  +gap()
  display: flex
  flex-shrink: 0
  padding: 2rem 1.5rem

  +breakpoint('medium')
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
