<script>
import _ from 'lodash'

export default {
  name: 'Notification',

  props: {
    mode: {
      type: String,
      default: 'default',
    },
    message: {
      type: String,
      default: '',
      required: true,
    },
    link: {
      type: [Object, Boolean],
      default: false,
    },
    progress: {
      type: [Number, Boolean],
      default: 0,
    },
    id: String,
    required: true,
  },

  data () {
    return {
      progressPrecent: 0,
      isMouseOver: false,
    }
  },

  watch: {

    progress (value) {
      if (_.isNumber(value)) {
        this.progressPrecent = value
      }
    },

  },

  methods: {

    runProgress () {
      if (this.isMouseOver !== true && this.progress !== false) {
        this.progressPrecent = this.progressPrecent + 2
      }

      _.delay(() => {
        if (this.progressPrecent >= 100) {
          _.delay(() => {
            this.close()
          }, 1000)
          return null
        }

        this.runProgress()
      }, 200)
    },

    mouseover () {
      this.isMouseOver = true
    },

    mouseleave () {
      this.isMouseOver = false
    },

    close () {
      this.$store.commit('deleteNotification', {id: this.id})
    },

  },

  created () {
    this.runProgress()
  },

}
</script>

<template>
<alert-core class="notification" :mode="mode" size="small" @mouseover.native="mouseover" @mouseleave.native="mouseleave">
  <button-core class="close" light @click.native="close()">
    <icon name="times"/>
  </button-core>

  <main class="main" v-text="message"></main>

  <button-core :mode="mode" size="small" :href="link.url" :target="link.target" v-if="link.url">
    {{link.text}}
  </button-core>

  <div class="progress" :style="{ width: progressPrecent + '%'}"></div>
</alert-core>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.notification
  box-shadow: $shadow--large
  position: relative
  +gap(.5em)

  .close
    position: absolute
    top: -.5rem
    right: .5rem

    .fa-icon
      height: 1rem

  .progress
    position: absolute
    left: 0
    bottom: 0
    background-color: $color-gray
    height: .25em
    transition: width .3s linear

  &.-mode-default
    .progress
      background-color: $color-gray

  &.-mode-success
    .progress
      background-color: $color-success

  &.-mode-warning
    .progress
      background-color: $color-warning

  &.-mode-danger
    .progress
      background-color: $color-danger

  &.-mode-info
    .progress
      background-color: $color-info

</style>
