<script>
export default {
  name: 'Heading',

  props: {
    mode: {
      type: String,
      default: 'secondary',
    },
  },

}
</script>

<template>
<header
  class="heading-core"
  :class="['-mode-'+mode,]"
>
  <slot></slot>
</header>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.heading-core
  color: $color-gray

  &.-mode-primary
    font-size: 1.2rem

    +hx
      font-size: 2.4rem

  &.-mode-secondary
    font-size: 1rem

    +hx
      font-size: 1.4rem
      font-weight: 800
      text-transform: uppercase

</style>
