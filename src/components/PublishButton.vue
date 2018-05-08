<script>
import _ from 'lodash'
import anime from 'animejs'
import buildJson from '@/utils/buildJson'
import Loader from '@/components/Loader'

export default {
  name: 'PublishButton',

  components: {
    Loader,
  },

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeProject () {
      return this.$store.getters.activeProject
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
      if (!this.activeProject) return null
      if (_.has(this.$store.state.publishProcesses, this.activeProject.projectId)) {
        return _.get(this.$store.state.publishProcesses, this.activeProject.projectId)
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
        projectId: this.activeProject.projectId,
        publishedBy: this.$store.state.user.id,
        content: content,
        filename: this.activeProject.filename,
        draft: this.activeProject.draft,
        structure: this.activeProject.structure
      })

    }

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
      <svg class="icon" width="33" height="25" viewBox="0 0 33 25" xmlns="http://www.w3.org/2000/svg"><path d="M29.918.273a.687.687 0 0 1 .578-.289c.24 0 .434.097.578.29l.867.794c.145.193.217.41.217.65 0 .242-.072.434-.217.579l-21.68 21.68c-.192.192-.397.289-.614.289-.216 0-.421-.097-.614-.29l-8.6-8.599c-.144-.145-.216-.337-.216-.578 0-.241.072-.458.217-.65l.867-.795a.687.687 0 0 1 .578-.29c.24 0 .433.097.578.29l7.154 7.154L29.918.273z" fill="#3FB143" fill-rule="evenodd"/></svg>
  </div>

  <a
    v-if="publishStatus === 'publish'"
    class="item -publish"
    @click="publishJson()"
    title="Publish"
  >
      <svg class="icon" width="33" height="24" viewBox="0 0 33 24" xmlns="http://www.w3.org/2000/svg"><path d="M27.32 10.777c1.49.305 2.726 1.05 3.707 2.235.982 1.185 1.473 2.556 1.473 4.113a6.445 6.445 0 0 1-.863 3.275 6.324 6.324 0 0 1-2.362 2.362 6.445 6.445 0 0 1-3.275.863H7.312c-1.32 0-2.539-.33-3.656-.99A7.452 7.452 0 0 1 .99 19.969 7.058 7.058 0 0 1 0 16.313c0-1.558.457-2.971 1.371-4.24.914-1.27 2.082-2.159 3.504-2.667V9c0-1.456.364-2.81 1.092-4.062a8.067 8.067 0 0 1 2.97-2.971A7.995 7.995 0 0 1 13.025.875c1.473 0 2.836.372 4.088 1.117 1.253.745 2.235 1.727 2.946 2.946a4.75 4.75 0 0 1 2.69-.813c1.355 0 2.506.474 3.454 1.422.948.948 1.422 2.099 1.422 3.453 0 .61-.102 1.202-.305 1.777zm-7.11 3.2c.238-.237.356-.525.356-.864 0-.338-.118-.626-.355-.863l-4.723-4.672a1.175 1.175 0 0 0-.863-.355c-.339 0-.626.118-.863.355L9.039 12.25a1.175 1.175 0 0 0-.355.863c0 .339.118.627.355.864l.559.558c.237.237.533.356.888.356.356 0 .652-.119.889-.356L13 12.758v6.398c0 .339.118.627.355.864s.525.355.864.355h.812c.339 0 .627-.118.863-.355.237-.237.356-.525.356-.864v-6.398l1.625 1.777c.237.237.533.356.889.356.355 0 .651-.119.888-.356l.559-.558z" fill="#FFF" fill-rule="evenodd"/></svg>
      <div class="text">
        Publish
      </div>
  </a>

  <div
    v-show="publishStatus === 'publishing'"
    class="item -publishing"
    title="Publishing"
  >
    <Loader/>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.item
  +margin-to-childs(.2rem)
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 5rem
  font-size: .7rem
  font-weight: 800
  background-color: mix(black, transparent, 30%)
  color: $color-white

  &.-publish

    .icon,
    .text
      transition: .2s
      opacity: .8

    &:hover
      .icon,
      .text
        opacity: 1

  &.-publishing

</style>
