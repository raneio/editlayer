<script>
import _ from 'lodash'

export default {
  name: 'Notification',

  props: {
    status: String,
    message: String,
    link: Object,
    progress: Number,
    image: String,
    deleteTime: {
      type: Number,
      default: 10,
    },
    id: String,
  },

  computed: {

    statusClass () {
      return `-${this.status}`
    },

  },

  watch: {

    progress (value) {
      if (value === 100) {
        _.delay(() => {
          this.close()
        }, 1000)
      }
    },

  },

  methods: {

    close () {
      console.log('close', this.id)
      this.$store.commit('deleteNotification', this.id)
    },

  },

  created () {
    if (this.progress === undefined && this.deleteTime !== false) {
      console.log('created', this.id)
      _.delay(() => {
        console.log('delay')
        this.close()
      }, this.deleteTime * 1000)
    }
  },

}
</script>

<template>
<div
  class="notification"
  :class="statusClass"
  v-if="status !== 'done'"
  @click="close()"
>

  <div class="status-bar"></div>

  <div class="content">
    <div class="message" v-html="message"></div>

    <div class="link" v-if="link && link.url && link.text">
      <a class="button" :href="link.url" :target="link.target" v-text="link.text"></a>
    </div>

    <div class="progress" v-if="progress !== undefined">
      <div class="percent" :style="{ width: progress + '%'}"></div>
    </div>
  </div>

  <img class="image" :src="image" alt="" v-if="image">

  <div class="icon"></div>

</div>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.notification
  background-color: $color-background
  width: 20rem
  min-height: 3rem
  +chain()
  align-items: center
  border-top-left-radius: $button-border-radius
  border-bottom-left-radius: $button-border-radius
  box-shadow: 0 0 1.5rem 0 mix(transparent, $color-content, 88%), 0 .2rem .2rem 0 mix(transparent, black, 95%)
  font-size: .8rem
  cursor: pointer

  .status-bar
    align-self: stretch
    background-color: $color-disabled
    width: .5rem
    border-top-left-radius: $button-border-radius
    border-bottom-left-radius: $button-border-radius

  .content
    flex-grow: 1
    padding: .5rem
    +margin-to-childs(.5rem)

    .progress
      height: .4rem
      background-color: $color-hr

    .percent
      width: 0
      height: .4rem
      background-color: $color-new
      transition: width 1s

  .image
    width: 3rem
    height: 3rem
    border-top-right-radius: $button-border-radius
    border-bottom-right-radius: $button-border-radius
    object-fit: cover
    background-image: url('../assets/image-background.png')

  &.-info

    .status-bar
      background-color: $color-info

  &.-success

    .status-bar
      background-color: $color-new

  &.-warning

    .status-bar
      background-color: $color-draft

  &.-error

    .status-bar
      background-color: $color-danger

    .message
      font-weight: 600
      color: $color-danger

</style>
