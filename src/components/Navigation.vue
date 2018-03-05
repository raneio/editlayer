<script>
import _ from 'lodash'
import axios from 'axios'
import firebase from '@/firebase'
import buildJson from '@/utils/buildJson'
import Breadcrumb from '@/components/Breadcrumb'
import PublishButton from '@/components/PublishButton'

export default {
  name: 'Navigation',

  components: {
    Breadcrumb,
    PublishButton,
  },

  computed: {

    // schema () {
    //   return this.$store.getters.schema
    // },

    activeFile () {
      return this.$store.getters.activeFile
    },

    // jsonStorage () {
    //   if (!this.activeFile) return false
    //   return `https://editlayer.storage.googleapis.com/${this.$route.params.id}/${this.activeFile.filename}`
    // },

    jsonUrl () {
      if (!this.activeFile) return false
      return `${this.$store.state.storageUrlPrefix}${this.$route.params.id}/${this.activeFile.filename}.json`
    },

    // jsonImgix () {
    //   if (!this.activeFile) return false
    //   return `https://editlayer.imgix.net/${this.$route.params.id}/${this.activeFile.filename}.json`
    // },

    jsonTarget () {
      if (!this.activeFile) return false
      return this.activeFile.fileId
    },

    // isDraft () {
    //   if (!this.activeFile) return false
    //   if (!this.activeFile.published) return true
    //   return !_.isEqual(this.activeFile.draft, this.activeFile.published.draft) || this.activeFile.schema !== this.activeFile.published.schema
    // },

    neverPublished () {
      if (!this.activeFile) return false
      return this.activeFile.published === null
    },

    // publishStatus () {
    //   if (this.publish.running === true) {
    //     return 'publishing'
    //   } else if (this.isDraft === true) {
    //     return 'publish'
    //   } else {
    //     return 'published'
    //   }
    // },

  },

  methods: {

    logout () {
      this.$store.dispatch('authLogout')
      this.$router.replace({ name: 'home' })
    },

  },

}
</script>


<template>
<nav class="navigation">

  <PublishButton/>

  <router-link
    v-if="$route.params.id"
    class="item"
    :class="{ '-active': $route.name === 'edit' }"
    :to="{ name: 'edit', params: { id: $route.params.id, path: $route.params.path }}"
  >
    <img class="icon" src="../assets/icon-edit.svg" alt="">
    Edit
  </router-link>

  <router-link
    v-if="$route.params.id"
    class="item"
    :class="{ '-active': $route.name === 'schema' }"
    :to="{ name: 'schema', params: { id: $route.params.id, path: $route.params.path }}"
  >
    <img class="icon" src="../assets/icon-schema.svg" alt="">
    Schema
  </router-link>

  <router-link
    v-if="$route.params.id"
    class="item"
    :class="{ '-active': $route.name === 'settings' }"
    :to="{ name: 'settings', params: { id: this.$route.params.id, path: this.$route.params.path }}"
  >
    <img class="icon" src="../assets/icon-settings.svg" alt="">
    Settings
  </router-link>

  <a
    v-if="$route.params.id"
    class="item"
    :class="{ '-disabled': neverPublished }"
    :href="jsonUrl"
    :target="jsonTarget"
  >
    <img class="icon" src="../assets/icon-link.svg" alt="">
    JSON File
  </a>

  <div class="spacer"></div>

  <div class="item" @click="logout()">
    <img class="icon" src="../assets/icon-account.svg" alt="">
    Logout
  </div>
</nav>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.navigation
  +invert-colors()
  display: flex
  flex-direction: column
  background-color: $color-navigation
  // padding-top: .5rem
  padding-bottom: .5rem
  overflow-y: auto

.spacer
  flex-grow: 1

.navigation /deep/

  .item
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: 4.75rem
    transition: background-color .1s
    cursor: pointer
    font-size: .75rem
    font-weight: 600
    min-height: 3.5rem

    &:hover
      background-color: mix(white, $color-navigation, 2.5%)

    &.-active
      background-color: mix($color-active, $color-navigation, 80%)

      &:hover
        background-color: mix($color-active, $color-navigation, 85%)

    &.-disabled
      opacity: .5
      pointer-events: none

    .icon
      display: block
      margin-bottom: .2rem


</style>
