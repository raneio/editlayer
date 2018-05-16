<script>
import Notification from '@/components/Notification'

export default {
  name: 'Notifications',

  components: {
    Notification,
  },

  computed: {

    notifications () {
      return this.$store.state.notifications
    },

  },

}
</script>

<template>
<section class="notifications">

  <div
    v-for="(notification, notificationId) in notifications"
    :key="notificationId"
  >
    <transition name="fade">
      <Notification
        :status="notification.status"
        :message="notification.message"
        :link="notification.link"
        :progress="notification.progress"
        :image="notification.image"
        :deleteTime="notification.deleteTime"
        :id="notificationId"
      />
    </transition>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.notifications
  position: fixed
  right: 2rem
  bottom: 2rem
  +margin-to-childs(.5rem)

.fade-enter,
.fade-leave-to
  opacity: 0

.fade-enter-active,
.fade-leave-active
  transition: opacity .5s

</style>
