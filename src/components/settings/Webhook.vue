<script>
import _ from 'lodash'
import firebase from '@/utils/firebase'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import Navigation from '@/components/navigation/Navigation'
import webhook from '@/utils/webhook'

// Codemirror
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'

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
      return this.$store.getters.activeProject.id
    },

    enabled () {
      if (!_.has(this.$store.getters.activeProject, 'settings.webhook.enabled')) return false
      return this.$store.getters.activeProject.settings.webhook.enabled
    },

    // jsonUrl () {
    //   return this.$store.getters.activeProject.jsonUrl
    // },

    json () {
      return this.$store.getters.activeProject.publishedVersion.json
    },

    versionId () {
      return this.$store.getters.activeProject.publishedVersion.versionId
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
      webhook({
        configString: this.config,
        email: this.$store.getters.auth.email,
        json: this.json,
        versionId: this.versionId,
      })
      this.devtoolInfo = true
      this.closeDevtoolInfo()
    },

    closeDevtoolInfo: _.debounce(function () {
      this.devtoolInfo = false
    }, 10000),

    switchEnabled () {
      let updateData = {}
      updateData['settings.webhook.enabled'] = !this.enabled

      if (!this.config) {
        this.resetConfig()
      }

      firebase.firestore
        .collection('projects')
        .doc(this.projectId)
        .update(updateData)
        // .then(() => console.log('Webhook enabled saved', updateData))
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
  <heading-core mode="secondary">
    <h2>Webhook</h2>
    <p>We will send a custom POST/GET request when publishing is done.</p>
  </heading-core>

  <alert-core mode="info" size="small" v-if="enabled !== false">
    <div>Variable <code><strong><span>{{</span>BASE64_CONTENT<span>}}</span></strong></code> is published content encoded with <a href="https://github.com/dankogai/js-base64" target="Base64">Base64</a>.</div>
    <div>Variable <code><strong><span>{{</span>VERSION_ID<span>}}</span></strong></code> is version of published JSON.</div>
    <div>Variable <code><strong><span>{{</span>PUBLISHER_EMAIL<span>}}</span></strong></code> is email of publisher.</div>
  </alert-core>

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
    <button-core size="small" @click.native="switchEnabled()">Disable webhook</button-core>
    <button-core size="small" @click.native="testWebhook()">Test webhook</button-core>
    <transition name="fade">
      <span class="debug" v-show="devtoolInfo">Open web console to debug</span>
    </transition>
    <hr>
    <button-core mode="info" light href="https://github.com/axios/axios#axios-api" target="AxiosDocs">Axios API</button-core>
  </div>

  <div class="" v-if="enabled === false">
    <button-core @click.native="switchEnabled()">Enable webhook</button-core>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.webhook
  +gap()

.tools
  +chain(1rem)
  width: 100%

  .debug
    display: none
    font-size: .8rem

    +breakpoint('small')
      display: block

.link.-danger
  color: $color-danger

.webhook /deep/

  .CodeMirror
    height: auto

</style>
