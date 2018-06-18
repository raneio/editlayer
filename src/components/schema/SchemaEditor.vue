<script>
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'
import firebase from '@/utils/firebase'
import editorConfig from '@/editors/editorConfig'

let editors = []

_.each(editorConfig, configItem => {
  editors.push(configItem.schemaName)
})

export default {
  name: 'SchemaEditor',

  components: {
    codemirror,
  },

  data () {
    return {
      schema: '',
      syntaxError: false,
      editors: editors,
    }
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

  },

  watch: {

    'activeProject.schema' (value) {
      this.setSchema()
    },

    schema: _.debounce(function () {
      this.saveSchema()
    }, 500),

  },

  methods: {

    saveSchema () {
      // console.log('saveSchema')
      this.syntaxError = false

      try {
        JSON.parse(this.schema)
      }
      catch (err) {
        console.warn('Syntax Error')
        this.syntaxError = true
        return false
      }

      // if (_.isEmpty(JSON.parse(this.schema))) {
      //   console.warn('Schema can\'t be empty')
      //   this.syntaxError = true
      //   return false
      // }

      if (this.schema !== this.activeProject.schema) {
        firebase.firestore.collection('projects').doc(this.activeProject.projectId).update({
          schema: this.schema,
        })
          // .then(() => console.log('Schema successfully written!'))
          .catch((error) => console.error('Error writing schema:', error))
      }
    },

    setSchema () {
      if (_.has(this.activeProject, 'schema')) {
        this.schema = this.activeProject.schema
      }
    },

  },

  created () {
    this.setSchema()
  },

}
</script>

<template>
<section class="schema" :class="{'-syntax-error': syntaxError}">

  <h1 class="heading -main">
    Content schema
  </h1>

  <div class="error-message">
    Invalid JSON Syntax
  </div>

  <codemirror
    class="-dracula"
    v-model="schema"
    :options="{
      theme: 'dracula',
      tabSize: 2,
      lineNumbers: true,
      mode: 'application/ld+json',
    }"
  />

  <div class="alert -info">
    <strong>Supported editors:</strong>
    <i>{{editors.join(', ')}}</i>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.schema
  padding-top: 2rem
  +gap()

  .error-message
    margin-top: -.75rem
    margin-bottom: .2rem
    opacity: 0
    color: $color-danger
    text-align: right
    font-weight: 800
    font-size: .9rem
    transition: opacity .2s

  &.-syntax-error .error-message
    opacity: 1

.schema /deep/

  &.-syntax-error .vue-codemirror
    box-shadow: 0 5px 12px 0 mix(transparent, $color-black, 90%), 0 2px 5px 0 mix(transparent, $color-black, 93%), inset 0 0 0 .2rem $color-danger, 0 0 0 .2rem $color-danger

.alert
  +chain(.25rem)

</style>
