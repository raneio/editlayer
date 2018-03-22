<script>
import _ from 'lodash'
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

  methods: {

    // close (notification) {
    //   this.$store.commit('updateUploadProcess', {
    //     projectId: notification.projectId,
    //     path: notification.path,
    //     status: 'done',
    //   })
    // },

  },

}
</script>


<template>
<section class="notifications">

  <div v-for="(notification, notificationId) in notifications">
    <transition name="fade">
      <Notification
        :status="notification.status"
        :message="notification.message"
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

// .notification
//   background-color: $color-background
//   width: 15rem
//   +chain()
//   border-top-left-radius: $button-border-radius
//   border-bottom-left-radius: $button-border-radius
//   box-shadow: 0 0 1.5rem 0 mix(transparent, $color-content, 88%), 0 .2rem .2rem 0 mix(transparent, black, 95%)
//   font-size: .8rem
//   cursor: pointer

  // &.-error
  //   align-items: center

// .image
//   height: 3rem
//   width: 3rem
//   border-top-left-radius: $button-border-radius
//   border-bottom-left-radius: $button-border-radius
//   object-fit: cover
//   background-image: url('../assets/image-background.png')

// .error
//   padding: .25rem
//   color: $color-danger
//   font-weight: 600

// .content
//   flex-grow: 1
//   display: flex
//   flex-direction: column
//   overflow: hidden
//
//   .filename
//     padding: .25rem
//     white-space: nowrap
//     text-overflow: ellipsis
//     overflow: hidden
//     border-bottom: 1px solid $color-hr
//
//
//   .progress-bar
//     background-color: $color-new
//     border-right: .5rem solid $color-new
//     flex-grow: 1
//     transition: width 1s

.fade-enter,
.fade-leave-to
  opacity: 0

.fade-enter-active,
.fade-leave-active
  transition: opacity .5s


</style>
