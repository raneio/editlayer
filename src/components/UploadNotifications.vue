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

  methods: {

    close (uploadProcess) {
      this.$store.commit('updateUploadProcess', {
        projectId: uploadProcess.projectId,
        path: uploadProcess.path,
        status: 'done',
      })
    },

  },

}
</script>


<template>
<section class="upload-notifications">

  <div v-for="uploadProcess in uploadProcesses">
    <transition name="fade">
    <div
      class="upload-process"
      :class="{ '-error': uploadProcess.status === 'error'}"
      v-if="uploadProcess.status !== 'done'"
      @click="close(uploadProcess)"
    >

      <img class="image" :src="uploadProcess.blobUrl" alt="" v-if="uploadProcess.blobUrl">

      <div class="content" v-if="uploadProcess.status !== 'error'">
        <div class="filename" v-text="uploadProcess.filename"></div>
        <div class="progress-bar" :style="{ width: uploadProcess.percent + '%'}"></div>
      </div>

      <div class="error" v-if="uploadProcess.status === 'error'">
        {{ uploadProcess.message }}
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
  font-size: .8rem
  cursor: pointer

  &.-error
    align-items: center

.image
  height: 3rem
  width: 3rem
  border-top-left-radius: $button-border-radius
  border-bottom-left-radius: $button-border-radius
  object-fit: cover
  background-image: url('../assets/image-background.png')

.error
  padding: .25rem
  color: $color-danger
  font-weight: 600

.content
  flex-grow: 1
  display: flex
  flex-direction: column
  overflow: hidden

  .filename
    padding: .25rem
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
