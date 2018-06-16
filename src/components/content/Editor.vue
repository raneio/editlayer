<script>
import _ from 'lodash'
import editorConfig from '@/editors/editorConfig'

let components = {}
let editors = []

_.each(editorConfig, configItem => {
  components[configItem.editor.name] = configItem.editor
  editors.push(configItem.schemaName)
})

export default {
  name: 'Editor',

  data () {
    return {
      editors: editors,
      forceEditorReload: false,
    }
  },

  components,

  computed: {

    activeStructure () {
      return this.$store.getters.activeStructure
    },

    activeComponentName () {
      let configItem = _.find(editorConfig, {'schemaName': this.activeStructure.EDITOR})
      return configItem.editor.name
    },

    isSupported () {
      return _.includes(this.editors, this.activeStructure.EDITOR)
    },

    editorContentIsValid () {
      return this.$store.state.editorContentIsValid
    },
  },

  watch: {

    'activeStructure._path' (value) {
      this.forceEditorReload = true
      this.$nextTick(() => {
        this.forceEditorReload = false
      })
    },

  },

}
</script>

<template>
<section class="editor">

  <div class="alert -info" v-if="activeStructure.INFO" v-text="activeStructure.INFO"></div>

  <component :is="activeComponentName" v-if="isSupported && !forceEditorReload"/>

  <div class="alert -warning" v-if="!isSupported">
    Editor "<strong>{{activeStructure.EDITOR}}</strong>" is not supported, please change editor in the structure. Following editors are supported: <i>{{editors.join(', ')}}</i>
  </div>

  <div class="error" v-if="!editorContentIsValid">
    <div class="message">Invalid Content</div>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.editor
  position: relative
  +gap()

.error
  position: absolute
  top: -1.5rem
  left: -.5rem
  right: -.5rem
  bottom: -.5rem
  box-shadow: 0 .3rem .7rem 0 mix(transparent, $color-black, 90%), 0 .25rem .4rem 0 mix(transparent, $color-black, 93%), 0 0 0 .2rem $color-danger
  border-radius: $input-border-radius
  pointer-events: none

  .message
    position: absolute
    right: 0
    top: -2rem
    font-weight: 800
    color: $color-danger

</style>
