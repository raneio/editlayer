<script>
export default {
  name: 'Notifications',

  computed: {

    notifications () {
      return this.$store.state.notifications
    },

  },

}
</script>

<template>
<section class="notifications">
  <div v-for="(item, itemId) in notifications.items" :key="itemId">
    <transition name="fade">

      <notification-core
        :mode="item.mode"
        :message="item.message"
        :link="item.link"
        :progress="item.progress"
        :id="itemId"
      ></notification-core>

    </transition>
  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.notifications
  position: fixed
  right: 2rem
  top: 2rem
  width: 20rem
  max-width: calc(100% - 4rem)
  +gap(.5rem)

</style>
