<script>
import _ from 'lodash'
// import firebase from '@/utils/firebase'
import editorConfig from '@/editors'

// Codemirror
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import '@/sass/codemirror.sass'

export default {
  name: 'SchemaEditor',

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

    activeProject () {
      return this.$store.getters.activeProject
    },

    editors () {
      let editors = []
      _.each(editorConfig, configItem => {
        editors.push(configItem.schemaName)
      })
      return editors
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

      if (this.schema !== this.activeProject.schema) {
        this.$store.dispatch('updateSchema', this.schema)
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
<section class="schema-editor" :class="{'-error': syntaxError}">
  <section class="editor">
    <transition name="fade">
      <div class="error-message" v-if="syntaxError">Invalid JSON Syntax</div>
    </transition>

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
  </section>

  <alert-core mode="info" size="small">
    <strong>Supported editors: </strong>
    <i>{{editors.join(', ')}}</i>
  </alert-core>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.schema-editor
  +gap()

.editor
  position: relative
  border-radius: .5rem
  transition: box-shadow $time

.error-message
  position: absolute
  right: 0
  top: -2rem
  color: $color-danger
  font-weight: 800
  font-size: .9rem

.schema-editor /deep/

  &.-error .editor
    box-shadow: 0 0 0 .4rem $color-danger

</style>
