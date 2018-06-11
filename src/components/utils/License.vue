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

  <div><a href="https://editlayer.com" class="button -link"><icon name="editlayer" class="logo"/></a></div>
  <div>Copyright &copy; 2018 <a href="https://twitter.com/raneio">Rane Ahonen</a></div>
  <div>Licensed <a class="button -link">MIT</a>. Do you want to upgrade to <a href="mailto:editlayer@gmail.com?subject=I'm interesting for the commercial license" class="button -link">Commercial</a> ?</div>

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
  padding-top: 6rem
  +gap(.5rem)
  display: flex
  align-items: center
  flex-direction: column
  color: $color-gray--darker
  font-size: .9rem
  text-align: center

  .logo
    height: 1.5rem

.colors
  +chain(1rem)
  width: 100%

  > *
    height: 50px
    flex-grow: 1

  .white
    background-color: $color-white

  .lightest
    background-color: $color-gray--lightest

  .lighter
    background-color: $color-gray--lighter

  .light
    background-color: $color-gray--light

  .gray
    background-color: $color-gray

  .dark
    background-color: $color-gray--dark

  .darker
    background-color: $color-gray--darker

  .darkest
    background-color: $color-gray--darkest

  .black
    background-color: $color-black

</style>
