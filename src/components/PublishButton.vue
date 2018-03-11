<script>
import _ from 'lodash'
import axios from 'axios'
import firebase from '@/firebase'
import buildJson from '@/utils/buildJson'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'PublishButton',

  // data () {
  //   return {
  //     publish: {
  //       running: false,
  //       versionId: null,
  //       schema: null,
  //       draft: null,
  //     },
  //   }
  // },

  components: {
    Breadcrumb,
  },

  computed: {

    schema () {
      return this.$store.getters.schema
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
      return !_.isEqual(this.activeProject.draft, this.activeProject.published.draft) || this.activeProject.schema !== this.activeProject.published.schema
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
    },

  },

  methods: {

    publishJson () {
      let content = buildJson(this.schema)

      this.$store.dispatch('publishJson', {
        projectId: this.projectId,
        publishedBy: this.$store.state.user.id,
        content: content,
        filename: this.activeProject.filename,
        draft: this.activeProject.draft,
        schema: this.activeProject.schema,
      })

      // this.publish.running = true
      // this.publish.draft = this.activeProject.draft
      // this.publish.schema = this.activeProject.schema

      // firebase.firestore.collection('projects').doc(this.projectId).collection('versions').add({
      //   publishedBy: this.$store.state.user.id,
      //   publishedAt: firebase.firestoreTimestamp,
      //   content: content,
      //   filename: this.activeProject.filename,
      //   // downloadToken: payload.downloadToken,
      // })
      // .then((docRef) => {
      //   let versionId = docRef.id
      //   this.publish.versionId = versionId
      //   console.log('Added version:', versionId)
      //   this.isPublishReady()
      // })
      // .catch((error) => console.error('Error adding version:', error))

    },

    // isPublishReady (publishTries = 0) {
    //   publishTries = publishTries + 1
    //
    //   if (publishTries > 30) {
    //     console.error('Publishing failed, try again.')
    //     this.publish.running = false
    //     return false
    //   }
    //
    //   let random = Math.random().toString(36).slice(-4)
    //
    //   axios({
    //     url: `${this.$store.state.storageUrlPrefix}${this.projectId}/${this.activeProject.filename}.json?${random}`,
    //     responseType: 'json',
    //   })
    //   .then((response) => {
    //
    //     if (this.publish.versionId !== response.data.VERSION_ID) {
    //       console.log('Try again', publishTries)
    //       _.delay(() => {
    //         this.isPublishReady(publishTries)
    //       }, publishTries * 1000)
    //     } else {
    //       let publishedData = {
    //         'published.draft': this.publish.draft,
    //         'published.schema': this.publish.schema,
    //       }
    //
    //       firebase.firestore.collection('projects').doc(this.projectId).update(publishedData)
    //       .then(() => {
    //         this.publish.running = false
    //         console.log('Published successfully updated!')
    //       })
    //       .catch((error) => console.error('Publishing failed', error))
    //     }
    //
    //   })
    //   .catch((error) => {
    //     // console.error('Getting published JSON failed try again', error.response)
    //     _.delay(() => {
    //       this.isPublishReady(publishTries)
    //     }, 1000)
    //   })
    //
    // },

  },

}
</script>


<template>
<section class="publish-button">

  <div
    v-if="$route.params.projectId && publishStatus === 'published'"
    class="item -published -disabled"
  >
      <img class="icon" src="../assets/icon-published.svg" alt="">
      Published
  </div>

  <div
    v-if="$route.params.projectId && publishStatus === 'publish'"
    class="item -publish"
    @click="publishJson()"
  >
      <img class="icon" src="../assets/icon-publish.svg" alt="">
      Publish
  </div>

  <div
    v-if="$route.params.projectId && publishStatus === 'publishing'"
    class="item -publishing -disabled"
  >
      <img class="icon" src="../assets/icon-publishing.svg" alt="">
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
