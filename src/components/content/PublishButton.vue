<script>
import _ from 'lodash'
import anime from 'animejs'
import buildJson from '@/utils/buildJson'

export default {
  name: 'PublishButton',

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeProject () {
      return this.$store.getters.activeProject
    },

    isDraft () {
      if (!this.activeProject.published) return true
      return !_.isEqual(this.activeProject.draft, this.activeProject.published.draft) || this.activeProject.schema !== this.activeProject.published.schema
    },

    neverPublished () {
      return this.activeProject.published === null
    },

    publishProcess () {
      if (_.has(this.$store.state.projects.processes, this.activeProject.id)) {
        return _.get(this.$store.state.projects.processes, this.activeProject.id)
      }
      else {
        return null
      }
    },

    publishStatus () {
      if (this.publishProcess && this.publishProcess.status === 'publishing') {
        return 'publishing'
      }
      else if (this.isDraft === true) {
        return 'publish'
      }
      else {
        return 'published'
      }
    },

  },

  methods: {

    publish () {
      let content = buildJson(this.structure)

      let webhookConfig = _.has(this.$store.getters.activeProject, 'settings.webhook.config') ? this.$store.getters.activeProject.settings.webhook.config : null
      let webhookEnabled = _.has(this.$store.getters.activeProject, 'settings.webhook.enabled') ? this.$store.getters.activeProject.settings.webhook.enabled : null

      this.$store.dispatch('publishJson', {
        projectId: this.activeProject.id,
        projectName: this.activeProject.name,
        publishedBy: this.$store.state.auth.id,
        content: content,
        // filename: this.activeProject.filename,
        token: this.activeProject.token,
        draft: this.activeProject.draft,
        schema: this.activeProject.schema,
        jsonUrl: this.activeProject.jsonUrl,
        webhookConfig: webhookConfig,
        webhookEnabled: webhookEnabled,
        email: this.$store.state.auth.email,
        role: this.activeProject.role,
      })
    },

  },

  mounted () {
    anime({
      targets: this.$refs['rotate-icon'],
      rotate: '360deg',
      easing: 'linear',
      duration: 1000,
      loop: true,
    })
  },

}
</script>

<template>
<section class="publish-button">

  <div
    v-if="publishStatus === 'published'"
    class="item -published"
    title="Publised"
  >
    <icon name="check"/>
  </div>

  <a
    v-if="publishStatus === 'publish'"
    class="item -publish"
    @click="publish()"
    title="Publish"
  >
    <icon name="cloud-upload-alt"/>
    <div class="text">
      Publish
    </div>
  </a>

  <div
    v-show="publishStatus === 'publishing'"
    class="item -publishing"
    title="Publishing"
  >
    <icon name="spinner" spin/>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.item
  +gap(.2rem)
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 5rem
  font-size: .7rem
  font-weight: 800
  background-color: mix(black, transparent, 30%)
  color: $color-white

  .fa-icon
    width: 2rem

  &.-published

    .fa-icon
      opacity: .5
      // color: $color-success

  &.-publish

    .fa-icon,
    .text
      transition: opacity .2s
      opacity: .8

    &:hover
      .fa-icon,
      .text
        opacity: 1

  &.-publishing

    .fa-icon
      width: 2rem

</style>
