<script>
export default {
  name: 'Card',

  props: {
    mode: {
      type: String,
      default: 'default',
    },
    size: {
      type: [String],
      default: 'medium',
    },
    link: {
      type: [Boolean],
      default: false,
    },
  },

}
</script>

<template>
<section
  class="card-core"
  :class="[
    '-mode-'+mode,
    '-size-'+size,
    {'-link': link}
  ]"
>
  <slot></slot>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.card-core
  box-shadow: $shadow--small
  background-color: $background-color
  width: 100%
  border-radius: $radius
  transition: box-shadow $time--small

  .header,
  .footer,
    +chain(1em)
    padding: .5em 1rem

  .header
    border-top-left-radius: $radius
    border-top-right-radius: $radius
    background-color: $color-gray--lightest
    border-bottom: 1px solid $color-gray--lighter

    +hx
      font-size: 1.25em
      font-weight: 400
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

    &:last-child
      border-bottom: 0

  .main
    padding: 1em 1.5rem

  .footer
    border-bottom-left-radius: $radius
    border-bottom-right-radius: $radius

  &.-link:hover
    cursor: pointer
    box-shadow: $shadow

  &.-size-small
    font-size: .8rem

    .header
      +hx
        font-weight: 600

    &.-link:hover
      cursor: pointer
      box-shadow: $shadow

</style>
