<script>
export default {
  name: 'app',

  created () {
    this.$store.dispatch('authState')
  },

}
</script>

<template>
<div id="app">
  <router-view/>
</div>
</template>
