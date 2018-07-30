<script>
import NewUserModal from '@/components/settings/NewUserModal'

export default {
  name: 'NewUserButton',

  components: {
    NewUserModal,
  },

  data () {
    return {
      name: '',
    }
  },

  computed: {

    activeModal () {
      return this.$store.state.utils.activeModal
    },

  },

  methods: {
    openModal () {
      this.$store.commit('setActiveModal', 'new-user')
    },
  },

}
</script>

<template>
<section class="new-user">
  <button-core
    size="small"
    mode="success"
    @click.native="openModal()"
  >
    <icon name="plus"/>
    <span>New user</span>
  </button-core>

  <transition name="fade--fast">
    <NewUserModal v-if="activeModal === 'new-user'"/>
  </transition>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'
</style>
