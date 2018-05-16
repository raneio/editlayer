<script>
import LoaderIcon from '@/components/LoaderIcon'

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
@import '../sass/features'

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
  background-image: linear-gradient(to left, mix($color-violet, transparent, 4%), mix($color-violet, transparent, 8%))
  color: $color-violet
  +margin-to-childs(.5rem)

  .icon
    display: flex
    background-color: $color-violet
    border-radius: 50%
    height: 4rem
    width: 4rem
    justify-content: center
    align-items: center

</style>
