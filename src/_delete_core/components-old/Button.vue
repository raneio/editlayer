<script>
export default {
  name: 'Button',

  props: {
    mode: {
      type: String,
      default: 'secondary',
    },
    size: {
      type: String,
      default: 'medium',
    },
    light: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    href: {
      type: [String, Boolean],
      default: false,
    },
  },

  computed: {
    tag () {
      if (this.href === false) {
        return 'button'
      }
      else {
        return 'a'
      }
    },
  },

}
</script>

<template>
<component
  :is="tag"
  class="button-core"
  :href="href"
  :class="[
    '-mode-'+mode,
    '-size-'+size,
    {'-light': light},
    {'-circle': circle},
    {'-active': active},
  ]"
>
  <slot></slot>
</component>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

@mixin mode($color, $hover: $color-white)
  background: $color
  color: $button-text-color

  &:hover
    background: mix($color, $hover, 90%)
    color: $button-text-color--hover

  &:active,
  &.-active
    background: mix($color, $hover, 88%)
    color: $button-text-color--active
    // transform: translateY(1px)

  &[disabled]
    background: mix($color, $hover, 30%)
    color: $button-text-color--disabled

  &.-light
    background: transparent
    box-shadow: none
    color: $color
    padding-left: 0
    padding-right: 0

    &:hover
      color: mix($color, $hover, 90%)

    &:active,
    &.-active
      color: mix($color, $hover, 88%)

    &[disabled]
      color: mix($color, $hover, 30%)

.button-core
  +chain(.5em)
  box-shadow: inset 0 -.1em .5em 0 mix($color-black, transparent, 5%), $shadow
  display: inline-flex
  position: relative
  transition: box-shadow $time--small, background-color $time--small

  &:hover
    box-shadow: inset 0 -.1em .5em 0 mix($color-black, transparent, 5%), $shadow--large

  &.-mode-primary
    +mode($color-primary)

  &.-mode-secondary
    +mode($color-secondary)

  &.-mode-success
    +mode($color-success)

  &.-mode-warning
    +mode($color-warning)

  &.-mode-danger
    +mode($color-danger)

  &.-mode-info
    +mode($color-info)

  &.-mode-invert
    +mode($color-white, $color-black)

  &.-size-small
    font-size: .8em

  &.-size-large
    font-size: 1.3em

  &.-circle
    +center()
    border-radius: 50%
    height: 2.75em
    padding: 0
    width: 2.75em

  > .fa-icon
    height: 1em

</style>
