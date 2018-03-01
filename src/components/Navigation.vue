<script>
import _ from 'lodash'
import buildJson from '@/utils/buildJson'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'Navigation',

  components: {
    Breadcrumb,
  },

  computed: {

    schema () {
      return this.$store.getters.schema
    },

    activeFile () {
      return this.$store.getters.activeFile
    },

    jsonUrl () {
      if (!this.activeFile) return false
      return `https://storage.googleapis.com/editlayerapp.appspot.com/files/${this.$route.params.id}/${this.activeFile.filename}`
    },

    jsonUrlTarget () {
      if (!this.activeFile) return false
      return this.activeFile.fileId
    },

    isDraft () {
      if (!this.activeFile) return false
      if (!this.activeFile.published) return true
      return !_.isEqual(this.activeFile.draft, this.activeFile.published.draft) || this.activeFile.schema !== this.activeFile.published.schema
    },

  },

  methods: {

    publish () {
      let content = buildJson(this.schema)

      this.$store.dispatch('publishJson', {
        fileId: this.$route.params.id,
        content: content,
        filename: this.activeFile.filename,
        downloadToken: this.activeFile.downloadToken,
      })
    },

    // openEdit () {
    //   this.$router.replace({ name: 'edit', params: { id: this.$route.params.id, path: this.$route.params.path }})
    // },
    //
    // openSchema () {
    //   this.$router.replace({ name: 'schema', params: { id: this.$route.params.id, path: this.$route.params.path }})
    // },
    //
    // openUsers () {
    //   this.$router.replace({ name: 'users', params: { id: this.$route.params.id, path: this.$route.params.path }})
    // },

    logout () {
      this.$store.dispatch('authLogout')
      this.$router.replace({ name: 'home' })
    },

    newFile () {
      let filename = prompt('Filename', '');

      if (filename != null && filename != '') {
          this.$store.dispatch('newFile', filename)
      }
    },

  },

}
</script>


<template>
<nav class="navigation">

  <div
    v-if="$route.params.id && !isDraft"
    class="item -published"
  >
      <img class="icon" src="../assets/icon-published.svg" alt="">
      Published
  </div>

  <div
    v-if="$route.params.id && isDraft"
    class="item -publish"
    @click="publish()"
  >
      <img class="icon" src="../assets/icon-publish.svg" alt="">
      Publish
  </div>

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
    :href="jsonUrl"
    :target="jsonUrlTarget"
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
  padding-top: .5rem
  padding-bottom: .5rem

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

  &:hover
    background-color: mix(white, $color-navigation, 2.5%)

  &.-active
    background-color: mix($color-active, $color-navigation, 80%)

    &:hover
      background-color: mix($color-active, $color-navigation, 85%)

  &.-published
    color: mix(white, $color-navigation, 30%)
    pointer-events: none

  &.-publish
    color: $color-draft
    font-weight: 800
    font-size: .9rem

  .icon
    display: block
    margin-bottom: .2rem

.spacer
  flex-grow: 1


// Under /deep/ you can also change style of child components
.editor /deep/


</style>
