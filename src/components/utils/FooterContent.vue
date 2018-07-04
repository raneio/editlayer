<script>
export default {
  name: 'FooterContent',
}
</script>

<template>
<section class="footer-content">
  <!-- <a class="badge" href="https://editlayer.com">
    <img class="image" src="/powered-by-editlayer.svg" alt="">
  </a> -->

  <div class="text">
    <div class="copyright">
      Copyright &copy; 2018 <button-core light href="https://twitter.com/raneio">Rane Ahonen</button-core>
    </div>

    <div class="licensed">
      Licensed <button-core light>AGPL</button-core>. Upgrade to <button-core light href="https://editlayer.com/pro">PRO</button-core> ?
    </div>
  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.footer-content
  font-size: .8rem
  text-align: center
  opacity: .4
  transition: opacity $time
  +center()
  flex-direction: column
  +gap()

  +breakpoint('large')
    +gap(0)
    +chain(1rem)
    flex-direction: row
    text-align: left

  &:hover
    opacity: 1

  .button-core
    padding-top: .25em
    padding-bottom: .25em

  .badge .image
    height: 3.5rem
    filter: grayscale(1)
    transition: filter $time, opacity $time
    box-shadow: $shadow
    opacity: .6

    &:hover
      filter: none
      opacity: 1

</style>
