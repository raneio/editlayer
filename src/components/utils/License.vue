<script>
export default {
  name: 'License',
}
</script>

<template>
<section class="license">
  <div class="copyright">
    Copyright &copy; 2018 <a href="https://twitter.com/raneio">Rane Ahonen</a> @ <a href="https://editlayer.org">Editlayer.org</a>
  </div>

  <div class="licensed">
    Licensed <a class="button -link">???</a>. Do you want to upgrade to <a href="https://editlayer.com/pro" class="button -link">Editlayer PRO</a> ?
  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.license
  +container('default', 6rem, 3rem)
  +gap(.5rem)
  font-size: .9rem
  text-align: center
  opacity: .5
  transition: opacity .2s

  &:hover
    opacity: 1

</style>
