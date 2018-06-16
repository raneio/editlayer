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
  name: 'StructureEditor',

  components: {
    codemirror,
  },

  data () {
    return {
      structure: '',
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
    <strong>Supported editors:</strong>
    <i>{{editors.join(', ')}}</i>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.structure
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

.structure /deep/

  &.-syntax-error .vue-codemirror
    box-shadow: 0 5px 12px 0 mix(transparent, $color-black, 90%), 0 2px 5px 0 mix(transparent, $color-black, 93%), inset 0 0 0 .2rem $color-danger, 0 0 0 .2rem $color-danger

.alert
  +chain(.25rem)

</style>
