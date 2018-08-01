<script>
export default {
  name: 'PartnerInfo',

  computed: {
    partnersUrl () {
      return `${this.$store.state.utils.editlayerUrl}/partners`
    },
  },
}
</script>

<template>
<section class="partner-info">

  <alert-core mode="warning">
    This editor is available only for official partners of Editlayer.
  </alert-core>

  <button-core :href="partnersUrl" target="editlayer" mode="primary">
    Become a partner
  </button-core>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.partner-info
  +gap()

</style>
