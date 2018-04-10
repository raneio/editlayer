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
      if (!this.activeProject) return false
      return `https://cdn.editlayer.com/${this.$route.params.projectId}/${this.activeProject.filename}.json`
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
        structure: this.activeProject.structure,
        trigger: this.activeProject.trigger
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
      <img class="icon" src="@/assets/icon-published.svg" alt="">
      Published
  </div>

  <div
    v-if="$route.params.projectId && publishStatus === 'publish'"
    class="item -publish"
    @click="publishJson()"
  >
      <img class="icon" src="@/assets/icon-publish.svg" alt="">
      Publish
  </div>

  <div
    v-if="$route.params.projectId && publishStatus === 'publishing'"
    class="item -publishing -disabled"
  >
      <img class="icon" src="@/assets/icon-publishing.svg" alt="">
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

// Under /deep/ you can also change style of child components
.editor /deep/

</style>
