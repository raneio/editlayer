<script>
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'
import firebase from '@/firebase'
import Breadcrumb from '@/components/Breadcrumb'
import Navigation from '@/components/Navigation'
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
      enabled: false,
      config: false,
      openDevtoolInfo: false,
    }
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    jsonUrl () {
      return this.$store.getters.jsonUrl
    },

  },

  watch: {

    activeProject () {
      this.updateData()
    },

    config: _.debounce(function () {
      this.saveConfig()
    }, 500),

    enabled () {
      this.saveEnabled()
    },

  },

  methods: {

    saveConfig () {
      console.log('saveConfig')
      let updateData = {}
      updateData['settings.webhook.config'] = this.config
      // updateData['webhook.url'] = this.webhook.url

      firebase.firestore
        .collection('projects')
        .doc(this.activeProject.projectId)
        .update(updateData)
        .then(() => console.log('Webhook config saved', updateData))
        .catch((error) => console.error('Webhook config saving failed', error))
    },

    saveEnabled () {
      console.log('saveEnabled')
      let updateData = {}
      updateData['settings.webhook.enabled'] = this.enabled

      firebase.firestore
        .collection('projects')
        .doc(this.activeProject.projectId)
        .update(updateData)
        .then(() => console.log('Webhook enabled saved', updateData))
        .catch((error) => console.error('Webhook enabling failed', error))
    },

    updateData () {
      if (_.has(this.activeProject, 'settings.webhook.config')) {
        this.config = this.activeProject.settings.webhook.config
      }
      if (_.has(this.activeProject, 'settings.webhook.enabled')) {
        this.enabled = this.activeProject.settings.webhook.enabled
      }
    },

    testWebhook () {
      webhook(this.config, this.jsonUrl)
      this.openDevtoolInfo = true

      _.delay(() => {
        this.openDevtoolInfo = false
      }, 10000)
    },

    enableWebhook () {
      this.enabled = true

      if (!this.config) {
        this.resetConfig()
      }
    },

    disableWebhook () {
      this.enabled = false
    },

    resetConfig () {
      this.config = `{
  "url": "https://example.com",
  "method": "post",
  "header": {
    "content-type": "application/json"
  },
  "data": {
    "content": "{{BASE64_CONTENT}}",
    "versionId": "{{VERSION_ID}}"
  }
}`
    },

  },

  mounted () {
    this.updateData()
  },

}
</script>

<template>
<section class="webhook">

  <header class="heading-group">
    <h1 class="heading">Webhook</h1>
    <p class="tagline">We will send a custom POST/GET request to the URL when publishing is done.</p>
  </header>

  <ul
    class="alert -info"
    v-if="enabled !== false"
  >
    <li>You can use <a href="https://github.com/axios/axios#axios-api">Axios HTTP client API</a>.</li>
    <li>Variable <i><span>{{</span>BASE64_CONTENT<span>}}</span></i> is published content encoded with <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding">Base64</a>.</li>
    <li>Variable <i><span>{{</span>VERSION_ID<span>}}</span></i> is version of published JSON.</li>
  </ul>

  <codemirror
    v-if="enabled !== false"
    v-model="config"
    :options="{
      theme: 'dracula',
      tabSize: 2,
      lineNumbers: false,
      mode: 'application/ld+json',
    }"
  />

  <!-- <div class="input-group">
    <select v-model="method" class="select-method">
      <option value="post">POST</option>
      <option value="get">GET</option>
    </select>
    <input class="grow" type="text" v-model="url" placeholder="https://example.com/folder/?foo=bar">
    <textarea name="name" rows="14" cols="80" v-model="config"></textarea>
    <button class="button" name="button" @click="testWebhook()">Test</button>
  </div> -->

  <div class="tools" v-if="enabled !== false">
    <div class="tool -test">
      <button class="button -link" @click="testWebhook()">Test webhook</button>
      <span class="debug" :class="{'-hidden': !openDevtoolInfo}">- open web console to debug</span>
    </div>
    <div class="tool -remove">
      <button class="button -link -danger" @click="disableWebhook()">Disable webhook</button>
    </div>
  </div>

  <div class="" v-if="enabled === false">
    <a class="button" @click="enableWebhook()">Enable webhook</a>
  </div>

  <!-- <div class="console">
    POST https://cdn.editlayer.com/marketing-example/content.json
  </div> -->

  <!-- <div class="">
    Fetch options. Check documents <a href="https://github.github.io/fetch/">https://github.github.io/fetch/</a>
  </div>

  <textarea v-model="config" rows="10"></textarea> -->

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/features'

.webhook
  +margin-to-childs()

.tools
  +chain()
  font-size: .8rem
  justify-content: space-between

  .debug
    transition: opacity .5s

    &.-hidden
      opacity: 0

.link.-danger
  color: $color-danger

.webhook /deep/

  .CodeMirror
    height: auto

</style>
