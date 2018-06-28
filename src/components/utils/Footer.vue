<script>
export default {
  name: 'Footer',
}
</script>

<template>
<section class="footer">
  <a class="badge" href="https://editlayer.com">
    <img class="image" src="/powered-by-editlayer.svg" alt="">
  </a>

  <div class="text">

    <div class="copyright">
      Copyright &copy; 2018
      <button-core light href="https://twitter.com/raneio" target="twitter">
        Rane Ahonen
      </button-core>
    </div>

    <div class="licensed">
      Licensed <button-core light>DEMO</button-core>. Do you want to upgrade to <button-core light href="https://editlayer.com/pro">Editlayer PRO</button-core> ?
    </div>

    <!-- <div class="licensed">
      Licensed to Storevisio.com
    </div> -->

  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.footer
  font-size: .8rem
  // text-align: center
  opacity: .5
  transition: opacity $time
  +chain(1rem)
  +center()

  &:hover
    opacity: 1

  .button-core
    padding-top: .25em
    padding-bottom: .25em

  .badge
    +center()
    box-shadow: $shadow

    .image
      height: 3rem
      filter: grayscale(1)
      transition: filter $time

    &:hover .image
      filter: none

</style>
