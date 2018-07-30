<script>
export default {
  name: 'LoaderOverlay',
}
</script>

<template>
<div class="loader-overlay">

  <icon name="spinner" spin/>
  <div class="text">Loading</div>

</div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.loader-overlay
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 99999999
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  background-image: linear-gradient(to right, $color-gray--lightest, $color-gray--lighter)
  color: $color-primary
  +gap(.5rem)

  .fa-icon
    display: flex
    background-color: $color-primary
    border-radius: 50%
    height: 4rem
    width: 4rem
    justify-content: center
    align-items: center
    fill: $color-white
    padding: 1rem

</style>
