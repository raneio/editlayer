<script>
import _ from 'lodash'
import buildJson from '@/utils/buildJson'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'PublishButton',

  components: {
    Breadcrumb
  },

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeProject () {
      return this.$store.getters.activeProject
    },

    projectId () {
      return this.$route.params.projectId
    },

    jsonUrl () {
      return this.$store.getters.jsonUrl
    },

    jsonTarget () {
      if (!this.activeProject) return false
      return this.projectId
    },

    isDraft () {
      if (!this.activeProject) return false
      if (!this.activeProject.published) return true
      return !_.isEqual(this.activeProject.draft, this.activeProject.published.draft) || this.activeProject.structure !== this.activeProject.published.structure
    },

    neverPublished () {
      if (!this.activeProject) return false
      return this.activeProject.published === null
    },

    publishProcess () {
      if (_.has(this.$store.state.publishProcesses, this.projectId)) {
        return _.get(this.$store.state.publishProcesses, this.projectId)
      } else {
        return null
      }
    },

    publishStatus () {
      if (this.publishProcess && this.publishProcess.status === 'publishing') {
        return 'publishing'
      } else if (this.isDraft === true) {
        return 'publish'
      } else {
        return 'published'
      }
    }

  },

  methods: {

    publishJson () {
      let content = buildJson(this.structure)

      this.$store.dispatch('publishJson', {
        projectId: this.projectId,
        publishedBy: this.$store.state.user.id,
        content: content,
        filename: this.activeProject.filename,
        draft: this.activeProject.draft,
        structure: this.activeProject.structure
      })
    }

  }

}
</script>

<template>
<section class="publish-button">

  <div
    v-if="$route.params.projectId && publishStatus === 'published'"
    class="item -published -disabled"
  >
      <svg class="icon" width="23" height="22" viewBox="0 0 23 22" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.257 9.913l-5.887 5.888a.884.884 0 0 1-1.256 0l-4.101-4.102a.884.884 0 0 1 0-1.255L7.436 9.02a.884.884 0 0 1 1.255 0l2.05 2.05 3.837-3.836a.884.884 0 0 1 1.256 0l1.423 1.423a.884.884 0 0 1 0 1.255zm1.967 1.158c0-4.185-3.404-7.589-7.59-7.589-4.184 0-7.589 3.404-7.589 7.59 0 4.185 3.405 7.589 7.59 7.589 4.185 0 7.59-3.404 7.59-7.59zm3.125 0c0 5.916-4.799 10.715-10.714 10.715S.92 16.986.92 11.07 5.72.357 11.635.357s10.714 4.8 10.714 10.714z" fill="#FFF" fill-rule="evenodd"/>
      </svg>
      Published
  </div>

  <div
    v-if="$route.params.projectId && publishStatus === 'publish'"
    class="item -publish"
    @click="publishJson()"
  >
      <svg class="icon" height="22" viewBox="0 0 23 22" width="23" xmlns="http://www.w3.org/2000/svg">
        <path d="m16.39 10.792a.457.457 0 0 1 -.418.28h-2.678v4.91a.44.44 0 0 1 -.447.447h-2.677a.44.44 0 0 1 -.447-.447v-4.91h-2.679a.44.44 0 0 1 -.447-.447c0-.126.056-.237.14-.335l4.45-4.45a.492.492 0 0 1 .32-.126c.112 0 .224.042.322.126l4.464 4.464c.126.14.167.321.098.488zm-4.882-7.31c-4.185 0-7.59 3.404-7.59 7.59 0 4.185 3.405 7.589 7.59 7.589s7.59-3.404 7.59-7.59c0-4.185-3.405-7.589-7.59-7.589zm10.714 7.59c0 5.915-4.799 10.714-10.714 10.714s-10.714-4.8-10.714-10.716 4.799-10.713 10.714-10.713 10.714 4.8 10.714 10.714z" fill="#f5bf68" fill-rule="evenodd"/>
      </svg>
      Publish
  </div>

  <div
    v-if="$route.params.projectId && publishStatus === 'publishing'"
    class="item -publishing -disabled"
  >
      <svg class="icon" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.576 11.091c0-5.302-3.889-9.687-8.944-10.445v2.786c3.548.72 6.222 3.884 6.222 7.66 0 4.312-3.488 7.818-7.778 7.818-4.29 0-7.778-3.506-7.778-7.819 0-3.775 2.674-6.939 6.223-7.66V.647C4.465 1.404.576 5.79.576 11.091c0 5.827 4.703 10.555 10.5 10.555s10.5-4.728 10.5-10.555z" fill="#FFF" fill-rule="evenodd"/>
      </svg>
      Publishing
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.item

  &.-publish
    color: $color-draft
    font-weight: 800
    font-size: .9rem

  &.-publishing

    .icon
      animation-name: spin
      animation-duration: .5s
      animation-iteration-count: infinite
      animation-timing-function: linear

@keyframes spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)

</style>
