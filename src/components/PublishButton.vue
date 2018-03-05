<script>
import _ from 'lodash'
import axios from 'axios'
import firebase from '@/firebase'
import buildJson from '@/utils/buildJson'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'PublishButton',

  data () {
    return {
      publish: {
        running: false,
        versionId: null,
        schema: null,
        draft: null,
      },
    }
  },

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

    isDraft () {
      if (!this.activeFile) return false
      if (!this.activeFile.published) return true
      return !_.isEqual(this.activeFile.draft, this.activeFile.published.draft) || this.activeFile.schema !== this.activeFile.published.schema
    },

    neverPublished () {
      if (!this.activeFile) return false
      return this.activeFile.published === null
    },

    publishStatus () {
      if (this.publish.running === true) {
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

      this.publish.running = true
      this.publish.draft = this.activeFile.draft
      this.publish.schema = this.activeFile.schema

      firebase.firestore.collection('files').doc(this.activeFile.fileId).collection('versions').add({
        publishedBy: this.$store.state.user.id,
        publishedAt: firebase.firestoreTimestamp,
        content: content,
        filename: this.activeFile.filename,
        // downloadToken: payload.downloadToken,
      })
      .then((docRef) => {
        let versionId = docRef.id
        this.publish.versionId = versionId
        console.log('Added version:', versionId)
        this.isPublishReady()
      })
      .catch((error) => console.error('Error adding version:', error))

    },

    isPublishReady (publishTries = 0) {
      publishTries = publishTries + 1

      if (publishTries > 30) {
        console.error('Publishing failed, try again.')
        this.publish.running = false
        return false
      }

      let random = Math.random().toString(36).slice(-4)

      axios({
        // url: `https://editlayer.imgix.net/${this.activeFile.fileId}/${this.activeFile.filename}.json?${random}`,
        url: `${this.$store.state.storageUrlPrefix}${this.activeFile.fileId}/${this.activeFile.filename}.json?${random}`,
        responseType: 'json',
      })
      .then((response) => {

        if (this.publish.versionId !== response.data.VERSION_ID) {
          console.log('Try again', publishTries)
          _.delay(() => {
            this.isPublishReady(publishTries)
          }, publishTries * 1000)
        } else {
          let publishedData = {
            'published.draft': this.publish.draft,
            'published.schema': this.publish.schema,
          }

          firebase.firestore.collection('files').doc(this.activeFile.fileId).update(publishedData)
          .then(() => {
            this.publish.running = false
            console.log('Published successfully updated!')
          })
          .catch((error) => console.error('Publishing failed', error))
        }

      })
      .catch((error) => {
        // console.error('Getting published JSON failed try again', error.response)
        _.delay(() => {
          this.isPublishReady(publishTries)
        }, 1000)
      })

    },

  },

}
</script>


<template>
<section class="publish-button">

  <div
    v-if="$route.params.id && publishStatus === 'published'"
    class="item -published -disabled"
  >
      <img class="icon" src="../assets/icon-published.svg" alt="">
      Published
  </div>

  <div
    v-if="$route.params.id && publishStatus === 'publish'"
    class="item -publish"
    @click="publishJson()"
  >
      <img class="icon animated pulse infinite" src="../assets/icon-publish.svg" alt="">
      Publish
  </div>

  <div
    v-if="$route.params.id && publishStatus === 'publishing'"
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
