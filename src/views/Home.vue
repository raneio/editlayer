<script>
export default {
  name: 'home',
}
</script>


<template>
<section class="home">

  <div class="content">
    <h1 class="heading">Editlayer</h1>
    <div class="">
      <router-link :to="{ name: 'admin', params: {} }">Admin Mode</router-link> |
      <router-link :to="{ name: 'edit', params: {} }">Edit Mode</router-link>
    </div>
  </div>

</section>
</template>


<style lang="sass" scoped>
// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.home
  display: flex
  justify-content: center
  align-items: center
  height: 100vh
  text-align: center

.content
  +margin-to-childs()


</style>
