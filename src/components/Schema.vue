<script>
import _ from 'lodash'
import CodeMirror from 'codemirror'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/material.css'
// import 'codemirror/theme/icecoder.css'
// import 'codemirror/theme/dracula.css'
// import 'codemirror/theme/base16-dark.css'
import firebase from '@/firebase'

export default {
  name: 'Schema',

  components: {
    codemirror,
  },

  data () {
    return {
      schema: '',
      syntaxError: false,
    }
  },

  computed: {

    // files () {
    //   return this.$store.getters.projects
    // },

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
    }, 500)

  },

  methods: {

    saveSchema () {
      // console.log('saveSchema')
      this.syntaxError = false

      try {
      	JSON.parse(this.schema)
      } catch (err) {
        console.warn('Syntax Error')
        this.syntaxError = true
        return false
      }

      firebase.firestore.collection('projects').doc(this.activeProject.projectId).update({
        schema: this.schema,
      })
      .then(() => console.log('Schema successfully written!'))
      .catch((error) => console.error('Error writing schema:', error))

      // this.$store.dispatch('saveSchema', {
      //   projectId: this.activeProject.projectId,
      //   schema: this.schema,
      // })

      // console.log('saveSchema', payload)

    },

    setSchema () {
      if (_.has(this.activeProject, 'schema')) {
        this.schema = this.activeProject.schema
      }
    }

  },

  created () {
    this.setSchema()
  },

}
</script>


<template>
<section class="schema" :class="{'-syntax-error': syntaxError}">

  <h1 class="heading">
    File Schema
  </h1>

  <div class="error-message">
    Invalid JSON Syntax
  </div>

  <codemirror
    v-model="schema"
    :options="{
      tabSize: 2,
      mode: 'application/ld+json',
      lineWrapping: true,
      theme: 'editlayer',
      lineNumbers: true,
    }"
  />

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.schema
  padding: 2rem .5rem

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

  .CodeMirror
    margin-left: -.5rem
    margin-right: -.5rem
    border-radius: $button-border-radius
    box-shadow: 0 5px 12px 0 mix(transparent, $color-content, 90%), 0 2px 5px 0 mix(transparent, black, 93%)
    height: auto
    transition: box-shadow .2s

  &.-syntax-error .CodeMirror
    box-shadow: 0 5px 12px 0 mix(transparent, $color-content, 90%), 0 2px 5px 0 mix(transparent, black, 93%), inset 0 0 0 .2rem $color-danger, 0 0 0 .2rem $color-danger

</style>
