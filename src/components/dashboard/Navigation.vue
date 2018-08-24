<script>
import firebase from '@/utils/firebase'

export default {
  name: 'Navigation',

  computed: {
    email () {
      return this.$store.getters.auth.email
    },
  },

  methods: {

    logout () {
      firebase.auth.signOut()
        .catch(error => console.error('Logout failed', error))
    },

  },

}
</script>

<template>
<nav class="navigation">
  <button-core mode="invert" light class="logo" href="https://editlayer.org">
    <icon name="editlayer"/>
    <span>Editlayer</span>
  </button-core>

  <hr>

  <button-core mode="invert" light class="logout" @click.native="logout()">
    <div class="text">
      <span>Logout</span>
      <div class="email" v-text="email"></div>
    </div>

    <icon class="icon -logout" name="sign-out-alt"/>

  </button-core>
</nav>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.navigation
  +container('huge')
  padding-top: .5rem
  padding-bottom: .5rem
  width: 100%
  background: linear-gradient(to bottom, $color-primary, mix($color-primary, $color-black, 85%))
  justify-content: space-between
  flex-shrink: 0
  text-align: center

  +breakpoint('small')
    +chain()

  .logo
    +chain(.5rem)
    +center()
    font-weight: 900
    font-size: 1.7rem
    text-transform: none

    .light
      font-weight: 300

.logout

  .text
    text-align: right
    line-height: 1.2em

  .email
    text-transform: none
    font-weight: 400
    font-size: .8rem

  .icon.-logout
    width: 2rem
    height: 1.5rem

</style>
