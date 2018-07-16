<script>
import firebase from '@/utils/firebase'

export default {
  name: 'Navigation',

  methods: {

    logout () {
      firebase.auth.signOut().then(() => {
        window.location.href = 'https://editlayer.com'
      }).catch((error) => {
        console.error('Logout failed', error)
      })
    },

  },

}
</script>

<template>
<nav class="navigation">
  <button-core mode="invert" light class="logo" href="https://editlayer.com">
    <icon name="editlayer"/>
    <span>Editlayer</span>
    <!-- <span class="light">Tietokeskus</span><span>TV</span> -->
  </button-core>

  <button-core mode="invert" light class="logout" @click.native="logout()">
    <span>Logout</span>
    <icon class="icon -logout" name="sign-out-alt"/>
  </button-core>
</nav>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.navigation
  +chain()
  +container('huge')
  padding-top: .5rem
  padding-bottom: .5rem
  width: 100%
  background: linear-gradient(to bottom, $color-primary, mix($color-primary, $color-black, 85%))
  justify-content: space-between
  flex-shrink: 0

  .logo
    +chain(.5rem)
    font-weight: 900
    font-size: 1.7rem
    text-transform: none

    .light
      font-weight: 300

</style>
