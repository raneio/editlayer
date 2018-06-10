<script>
import LoaderIcon from '@/components/utils/LoaderIcon'

export default {
  name: 'LoaderOverlay',

  components: {
    LoaderIcon,
  },

}
</script>

<template>
<div class="loader-overlay">

  <div class="icon">
    <LoaderIcon/>
  </div>

  <div class="text">
    Loading
  </div>

</div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

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
  color: $color-brand
  +gap(.5rem)

  .icon
    display: flex
    background-color: $color-brand
    border-radius: 50%
    height: 4rem
    width: 4rem
    justify-content: center
    align-items: center

</style>
