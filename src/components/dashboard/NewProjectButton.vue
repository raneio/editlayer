<script>
import NewProjectModal from '@/components/dashboard/NewProjectModal'

export default {
  name: 'NewProjectButton',

  components: {
    NewProjectModal,
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
      this.$store.commit('setActiveModal', 'new-project')
    },
  },

}
</script>

<template>
<section class="new-project">
  <button-core
    size="large"
    mode="success"
    @click.native="openModal()"
  >
    <icon name="plus"/>
    <span>New Project</span>
  </button-core>

  <transition name="fade--fast">
    <NewProjectModal v-if="activeModal === 'new-project'"/>
  </transition>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'
</style>
