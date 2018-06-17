<script>
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'
import firebase from '@/utils/firebase'
import Breadcrumb from '@/components/navigate/Breadcrumb'
import Navigation from '@/components/navigate/Navigation'
import webhook from '@/utils/webhook'

export default {
  name: 'Webhook',

  components: {
    Breadcrumb,
    Navigation,
    codemirror,
  },

  data () {
    return {
      config: _.has(this.$store.getters.activeProject, 'settings.webhook.config') ? this.$store.getters.activeProject.settings.webhook.config : '',
      devtoolInfo: false,
    }
  },

  computed: {

    projectId () {
      return this.$store.getters.activeProject.projectId
    },

    enabled () {
      if (!_.has(this.$store.getters.activeProject, 'settings.webhook.enabled')) return false
      return this.$store.getters.activeProject.settings.webhook.enabled
    },

    jsonUrl () {
      return this.$store.getters.jsonUrl
    },

  },

  watch: {

    config: _.debounce(function () {
      this.saveConfig()
    }, 500),

  },

  methods: {

    saveConfig () {
      if (!this.config) {
        this.resetConfig()
        return null
      }

      let updateData = {}
      updateData['settings.webhook.config'] = this.config

      firebase.firestore
        .collection('projects')
        .doc(this.projectId)
        .update(updateData)
        // .then(() => console.log('Webhook config saved', updateData))
        .catch((error) => console.error('Webhook config saving failed', error))
    },

    testWebhook () {
      webhook(this.config, this.jsonUrl, this.$store.state.user.email)
      this.devtoolInfo = true
      this.closeDevtoolInfo()
    },

    closeDevtoolInfo: _.debounce(function () {
      this.devtoolInfo = false
    }, 10000),

    switchEnabled () {
      let updateData = {}
      updateData['settings.webhook.enabled'] = !this.enabled

      console.log('switchEnabled', updateData)

      firebase.firestore
        .collection('projects')
        .doc(this.projectId)
        .update(updateData)
        .then(() => console.log('Webhook enabled saved', updateData))
        .catch((error) => console.error('Webhook enabling failed', error))
    },

    resetConfig () {
      this.config = `{
  "url": "https://example.com",
  "method": "get",
  "params": {
    "content": "{{BASE64_CONTENT}}",
    "versionId": "{{VERSION_ID}}"
  }
}`
    },

  },

}
</script>

<template>
<section class="webhook">

  <ul
    class="alert -info"
    v-if="enabled !== false"
  >
    <!-- <li>You can use API of <a href="https://github.com/axios/axios#axios-api">Axios HTTP client</a>.</li> -->
    <li>Variable <strong><span>{{</span>BASE64_CONTENT<span>}}</span></strong> is published content encoded with <a href="https://github.com/dankogai/js-base64" target="Base64">Base64</a>.</li>
    <li>Variable <strong><span>{{</span>VERSION_ID<span>}}</span></strong> is version of published JSON.</li>
    <li>Variable <strong><span>{{</span>PUBLISHER_EMAIL<span>}}</span></strong> is email of publisher.</li>
  </ul>

  <codemirror
    v-if="enabled !== false"
    v-model="config"
    class="-dracula"
    :options="{
      theme: 'dracula',
      tabSize: 2,
      lineNumbers: false,
      mode: 'application/ld+json',
    }"
  />

  <div class="tools" v-if="enabled !== false">
    <button class="button -small" @click="switchEnabled()">Disable webhook</button>
    <button class="button -small" @click="testWebhook()">Test webhook</button>
    <span class="debug" :class="{'-hidden': !devtoolInfo}">Open web console to debug</span>
    <span class="spacer"></span>
    <div><a href="https://github.com/axios/axios#axios-api" target="AxiosDocs">Axios API</a></div>
  </div>

  <div class="" v-if="enabled === false">
    <button class="button" @click="switchEnabled()">Enable webhook</button>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.webhook
  +gap()

.tools
  +chain(1rem)
  width: 100%
  // justify-content: space-between

  .debug
    display: none
    transition: opacity .5s
    font-size: .8rem

    &.-hidden
      opacity: 0

    +breakpoint('small')
      display: block

  .spacer
    flex-grow: 1

.link.-danger
  color: $color-danger

.webhook /deep/

  .CodeMirror
    height: auto

</style>
