<script>
import _ from 'lodash'
// import CodeMirror from 'codemirror'
import { codemirror } from 'vue-codemirror'
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/material.css'
// import 'codemirror/theme/icecoder.css'
// import 'codemirror/theme/dracula.css'
// import 'codemirror/theme/base16-dark.css'
// import 'codemirror/theme/railscasts.css'
import firebase from '@/firebase'

export default {
  name: 'StructureEditor',

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
    }, 500),

  },

  methods: {

    saveStructure () {
      // console.log('saveStructure')
      this.syntaxError = false

      try {
        JSON.parse(this.structure)
      }
      catch (err) {
        console.warn('Syntax Error')
        this.syntaxError = true
        return false
      }

      if (this.structure !== this.activeProject.structure) {
        firebase.firestore.collection('projects').doc(this.activeProject.projectId).update({
          structure: this.structure,
        })
          .then(() => console.log('Structure successfully written!'))
          .catch((error) => console.error('Error writing structure:', error))
      }
    },

    setStructure () {
      if (_.has(this.activeProject, 'structure')) {
        this.structure = this.activeProject.structure
      }
    },

  },

  created () {
    this.setStructure()
  },

}
</script>

<template>
<section class="structure" :class="{'-syntax-error': syntaxError}">

  <h1 class="heading -main">
    Content structure
  </h1>

  <div class="error-message">
    Invalid JSON Syntax
  </div>

  <codemirror
    class="-dracula"
    v-model="structure"
    :options="{
      theme: 'dracula',
      tabSize: 2,
      lineNumbers: true,
      mode: 'application/ld+json',
    }"
  />

  <div class="alert -info">
    <strong>Supported editors:</strong> <i>{{$store.state.editors.join(', ')}}</i>
  </div>

</section>
</template>

<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../../sass/variables'
@import '../../sass/mixins/all'

.structure
  padding: 2rem .5rem
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

.structure /deep/

  &.-syntax-error .vue-codemirror
    box-shadow: 0 5px 12px 0 mix(transparent, $color-black, 90%), 0 2px 5px 0 mix(transparent, black, 93%), inset 0 0 0 .2rem $color-danger, 0 0 0 .2rem $color-danger

</style>
