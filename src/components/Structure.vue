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
  name: 'Structure',

  components: {
    codemirror,
  },

  data () {
    return {
      structure: '',
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

    'activeProject.structure' (value) {
      this.setStructure()
    },

    structure: _.debounce(function () {
      this.saveStructure()
    }, 500)

  },

  methods: {

    saveStructure () {
      // console.log('saveStructure')
      this.syntaxError = false

      try {
      	JSON.parse(this.structure)
      } catch (err) {
        console.warn('Syntax Error')
        this.syntaxError = true
        return false
      }

      firebase.firestore.collection('projects').doc(this.activeProject.projectId).update({
        structure: this.structure,
      })
      .then(() => console.log('Structure successfully written!'))
      .catch((error) => console.error('Error writing structure:', error))

      // this.$store.dispatch('saveStructure', {
      //   projectId: this.activeProject.projectId,
      //   structure: this.structure,
      // })

      // console.log('saveStructure', payload)

    },

    setStructure () {
      if (_.has(this.activeProject, 'structure')) {
        this.structure = this.activeProject.structure
      }
    }

  },

  created () {
    this.setStructure()
  },

}
</script>


<template>
<section class="structure" :class="{'-syntax-error': syntaxError}">

  <h1 class="heading">
    Structure of JSON
  </h1>

  <div class="error-message">
    Invalid JSON Syntax
  </div>

  <codemirror
    v-model="structure"
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

.structure
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

.structure /deep/

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
