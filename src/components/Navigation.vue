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

    activeProject () {
      return this.$store.getters.activeProject
    },

    activeRole () {
      return this.$store.getters.activeRole
    },

    jsonUrl () {
      if (!this.activeProject) return false
      return `https://cdn.editlayer.com/${this.$route.params.projectId}/${this.activeProject.filename}.json`
    },

    jsonTarget () {
      if (!this.activeProject) return false
      return this.activeProject.projectId
    },

    neverPublished () {
      if (!this.activeProject) return false
      return this.activeProject.published === null
    },

  },

  methods: {

    logout () {
      firebase.auth.signOut().then(() => {
        window.location.href = 'https://editlayer.com'
      }).catch((error) => {
        console.error('Logout failed', error)
      })
    },

  },

}
</script>


<template>
<nav class="navigation">

  <PublishButton/>

  <router-link
    v-if="$route.params.projectId"
    class="item"
    :class="{ '-active': $route.name === 'Content' }"
    :to="{ name: 'Content', params: { projectId: $route.params.projectId, path: $route.params.path }}"
  >
    <img class="icon" src="@/assets/icon-edit.svg" alt="">
    Content
  </router-link>

  <router-link
    v-if="$route.params.projectId && activeRole === 'admin'"
    class="item"
    :class="{ '-active': $route.name === 'Structure' }"
    :to="{ name: 'Structure', params: { projectId: $route.params.projectId, path: $route.params.path }}"
  >
    <img class="icon" src="@/assets/icon-structure.svg" alt="">
    Structure
  </router-link>

  <router-link
    v-if="$route.params.projectId && activeRole === 'admin'"
    class="item"
    :class="{ '-active': $route.name === 'Settings' }"
    :to="{ name: 'Settings', params: { projectId: this.$route.params.projectId, path: this.$route.params.path }}"
  >
    <img class="icon" src="@/assets/icon-settings.svg" alt="">
    Settings
  </router-link>

  <a
    v-if="$route.params.projectId && activeRole === 'admin'"
    class="item"
    :class="{ '-disabled': neverPublished }"
    :href="jsonUrl"
    :target="jsonTarget"
  >
    <img class="icon" src="@/assets/icon-link.svg" alt="">
    JSON File
  </a>

  <div class="spacer"></div>

  <div class="item" @click="logout()">
    <img class="icon" src="@/assets/icon-account.svg" alt="">
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
