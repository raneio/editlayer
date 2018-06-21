<script>
export default {
  name: 'License',
}
</script>

<template>
<section class="license">
  <div class="copyright">
    Copyright &copy; 2018
    <button-core light href="https://twitter.com/raneio" target="twitter">
      Rane Ahonen
    </button-core>
    from
    <button-core light href="https://deviloper.org" target="deviloper">
      <icon class="logo" name="deviloper"/>
    </button-core>
  </div>

  <div class="licensed">
    Licensed <button-core light>AGPL</button-core>. Do you want to upgrade to <button-core light href="https://editlayer.com/pro">Editlayer PRO</button-core> ?
  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.license
  font-size: .8rem
  text-align: center
  opacity: .5
  transition: opacity .2s

  &:hover
    opacity: 1

    .logo
      color: #EB242D

  .button-core
    padding-top: .5em
    padding-bottom: .5em

  .fa-icon.logo
    height: 1.5rem

</style>
