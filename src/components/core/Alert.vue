<script>
export default {
  name: 'Alert',

  props: {
    mode: {
      type: String,
      default: 'default',
    },
    size: {
      type: [String],
      default: 'medium',
    },
  },

}
</script>

<template>
<div
  class="alert-core"
  :class="[
    '-mode-'+mode,
    '-size-'+size,
  ]"
>
  <slot></slot>
</div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

@mixin mode($color)
  border: 1px solid mix($color, $color-white, 30%)
  background-color: mix($color, $color-white, 10%)
  color: mix($color, $content-color, 40%)

.alert-core
  padding: .75em 1rem
  border-radius: $radius--small
  // overflow: hidden
  // text-overflow: ellipsis

  &.-mode-default
    +mode($color-gray--dark)

  &.-mode-success
    +mode($color-success)

  &.-mode-warning
    +mode($color-warning)

  &.-mode-danger
    +mode($color-danger)

  &.-mode-info
    +mode($color-info)

  &.-size-small
    font-size: .9rem
    line-height: 1.3em

  &.-size-large
    font-size: 1.4rem

</style>
