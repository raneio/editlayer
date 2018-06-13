<script>
import Notification from '@/components/notification/Notification'

export default {
  name: 'Notifications',

  components: {
    Notification,
  },

  computed: {

    notifications () {
      return this.$store.state.notifications
    },

  },

}
</script>

<template>
<section class="license">

  <!-- <div><a href="https://editlayer.com" class="button -link"><icon name="editlayer" class="logo"/></a></div> -->
  <div class="copyright">
    <span>Copyright &copy; 2018 <a href="https://twitter.com/raneio">Rane Ahonen</a></span>
    <!-- <a href="https://editlayer.com" class="button -link"><icon name="editlayer" class="logo"/></a> -->
  </div>
  <div class="licensed">Licensed <a class="button -link">MIT</a>. Do you want to upgrade to <a href="https://editlayer.com/pro" class="button -link">Editlayer PRO</a> ?</div>

  <!-- <div class="colors">
    <div class="white"></div>
    <div class="lightest"></div>
    <div class="lighter"></div>
    <div class="light"></div>
    <div class="gray"></div>
    <div class="dark"></div>
    <div class="darker"></div>
    <div class="darkest"></div>
    <div class="black"></div>
  </div> -->

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.license
  margin-top: 6rem
  +gap(.5rem)
  font-size: .9rem
  text-align: center
  opacity: .5
  transition: opacity .2s
  padding-top: 2rem
  padding-bottom: 2rem

  &:hover
    opacity: 1

// .copyright
//   +chain(.5em)
//
//   .logo
//     height: 1rem

// .colors
//   +chain(1rem)
//   width: 100%
//
//   > *
//     height: 50px
//     flex-grow: 1
//
//   .white
//     background-color: $color-white
//
//   .lightest
//     background-color: $color-gray--lightest
//
//   .lighter
//     background-color: $color-gray--lighter
//
//   .light
//     background-color: $color-gray--light
//
//   .gray
//     background-color: $color-gray
//
//   .dark
//     background-color: $color-gray--dark
//
//   .darker
//     background-color: $color-gray--darker
//
//   .darkest
//     background-color: $color-gray--darkest
//
//   .black
//     background-color: $color-black

</style>
