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
  <main class="main">
    <span v-html="message"></span>

    <button-core class="close" light @click.native="close()">
      <icon name="times"/>
    </button-core>
  </main>

  <button-core :mode="mode" size="small" :href="link.url" :target="link.target" v-if="link">
    {{link.text}}
  </button-core>

  <div class="progress" :style="{ width: progressPrecent + '%'}">
  </div>
</alert-core>

<!-- <div
  class="notification"
  :class="statusClass"
  v-if="status !== 'done'"
  @click="close()"
>

  <div class="status-bar"></div>

  <div class="content">
    <div class="message" v-html="message"></div>

    <div class="link" v-if="link && link.url && link.text">
      <button-core light :href="link.url" :target="link.target">
        {{link.text}}
      </button-core>
    </div>

    <div class="progress" v-if="progress !== undefined">
      <div class="percent" :style="{ width: progress + '%'}"></div>
    </div>
  </div>

  <img class="image" :src="image" alt="" v-if="image">

  <div class="icon"></div>

</div> -->
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.notification
  box-shadow: $shadow--large
  position: relative
  +gap(.5em)

  .main
    +chain(1em)
    align-items: flex-start
    justify-content: space-between

  .close
    padding: 0

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
