<script>
import _ from 'lodash'

export default {
  name: 'UserInfo',

  data () {
    return {
        text: 'foo',
    }
  },

  computed: {

    email () {
      return this.$store.state.user.email
    },

  },

  methods: {

    logout () {
      this.$store.dispatch('authLogout')
    },

  },

}
</script>


<template>
<section class="user-info">
  {{ email }} | <a href="#" @click.prevent="logout()">Logout</a>
</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

// Under /deep/ you can also change style of child components
.editor /deep/


</style>
