<script>
import _ from 'lodash'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import PublishButton from '@/components/content/PublishButton'

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

    permissions () {
      return _.get(this.activeProject, 'auth.permissions') || {}
    },

    neverPublished () {
      if (!this.activeProject) return false
      return this.activeProject.publishedVersion === null
    },

  },

}
</script>

<template>
<nav class="navigation">

  <template v-if="$route.params.projectId">

    <PublishButton  class="publish-button"/>

    <router-link
      v-if="$route.params.projectId"
      class="item"
      :class="{'-active': $route.name === 'Content'}"
      :to="{name: 'Content', params: {projectId: $route.params.projectId, path: $route.params.path}}"
    >
      <icon name="regular/edit"/>
      <div class="text">Content</div>
    </router-link>

    <router-link
      v-if="$route.params.projectId && permissions.updateSchema === true"
      class="item"
      :class="{'-active': $route.name === 'Schema'}"
      :to="{name: 'Schema', params: {projectId: $route.params.projectId, path: $route.params.path}}"
    >
      <icon name="schema"/>
      <div class="text">Schema</div>
    </router-link>

    <router-link
      v-if="$route.params.projectId && permissions.updateSettings === true"
      class="item"
      :class="{'-active': $route.name === 'Settings'}"
      :to="{name: 'Settings', params: {projectId: this.$route.params.projectId, path: this.$route.params.path}}"
    >
      <icon name="cogs"/>
      <div class="text">Settings</div>
    </router-link>

    <hr>

    <router-link
      class="item"
      :to="{ name: 'Dashboard' }"
    >
      <icon name="home"/>
      <div class="text">Dashboard</div>
    </router-link>

  </template>

</nav>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.navigation
  +invert()
  display: flex
  flex-direction: column
  background-color: $color-primary
  background-image: linear-gradient(to right, $color-primary, mix($color-primary, $color-black, 85%))
  padding-bottom: .5rem
  overflow-y: auto

  &:hover

    .item .text
      transition: opacity 0s
      opacity: 1

  hr
    flex-grow: 1

.publish-button
  margin-bottom: 1rem

.item
  +gap(.2rem)
  display: flex
  flex-direction: column
  align-items: center
  transition: opacity .2s
  font-size: .65rem
  font-weight: 700
  opacity: .6
  padding-top: 1rem
  padding-bottom: 1rem

  &:hover
    opacity: 1

  &.-active
    filter: drop-shadow(0 0 10px mix($color-white, transparent, 60%))
    opacity: 1

  .text
    transition: opacity 1s
    transition-delay: 1s
    opacity: 0
    flex-shrink: 0

  .fa-icon
    width: 1.7rem
    fill: $color-white
    min-height: 1rem

</style>
