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
        // .then(() => console.log('Webhook enabled saved', updateData))
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

  <ul
    class="alert -info"
    v-if="enabled !== false"
  >
    <li>You can use API of <a href="https://github.com/axios/axios#axios-api">Axios HTTP client</a>.</li>
    <li>Variable <strong><span>{{</span>BASE64_CONTENT<span>}}</span></strong> is published content encoded with <a href="https://github.com/dankogai/js-base64">Base64</a>.</li>
    <li>Variable <strong><span>{{</span>VERSION_ID<span>}}</span></strong> is version of published JSON.</li>
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
    <button class="button -small" @click="disableWebhook()">Disable webhook</button>
    <button class="button -small" @click="testWebhook()">Test webhook</button>
    <span class="debug" :class="{'-hidden': !openDevtoolInfo}">Open web console to debug</span>
  </div>

  <div class="" v-if="enabled === false">
    <button class="button" @click="enableWebhook()">Enable webhook</button>
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
@import '../../sass/variables'
@import '../../sass/mixins/all'

.webhook
  +gap()

.tools
  +chain(1rem)
  font-size: .8rem
  // justify-content: space-between

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
