<script>
import _ from 'lodash'
import firebase from '../firebase'

export default {
  name: 'UploadNotifications',

  computed: {

    uploadProcesses () {
      return this.$store.state.uploadProcesses
    }

  },

}
</script>


<template>
<section class="upload-notifications">

  <div v-for="uploadProcess in uploadProcesses">
    <transition name="fade">
    <div class="upload-process" v-if="uploadProcess.status !== 'done'">

      <img class="image" :src="uploadProcess.blobUrl" alt="" v-if="uploadProcess.blobUrl">

      <div class="content">
        <div class="filename" v-text="uploadProcess.filename"></div>
        <div class="progress-bar" :style="{ width: uploadProcess.percent + '%'}">
      </div>

      </div>
    </div>
    </transition>
  </div>

</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.upload-notifications
  position: fixed
  right: 2rem
  bottom: 2rem
  +margin-to-childs(.5rem)

.upload-process
  background-color: $color-background
  border: 1px solid $color-hr
  width: 15rem
  +chain()
  border-top-left-radius: $button-border-radius
  border-bottom-left-radius: $button-border-radius
  box-shadow: 0 5px 12px 0 mix(transparent, $color-content, 90%), 0 2px 5px 0 mix(transparent, black, 93%)

.image
  height: 3rem
  width: 3rem
  border-top-left-radius: $button-border-radius
  border-bottom-left-radius: $button-border-radius
  object-fit: cover

.content
  flex-grow: 1
  display: flex
  flex-direction: column
  overflow: hidden

  .filename
    padding: .25rem
    font-size: .8rem
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden
    border-bottom: 1px solid $color-hr


  .progress-bar
    background-color: $color-new
    border-right: .5rem solid $color-new
    flex-grow: 1
    transition: width 1s

.fade-enter,
.fade-leave-to
  opacity: 0

.fade-enter-active,
.fade-leave-active
  transition: opacity .5s


</style>
