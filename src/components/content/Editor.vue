<script>
import _ from 'lodash'
import editorConfig from '@/editors/config'

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
    activeItem () {
      return this.$store.getters.activeItem
    },

    activeComponentName () {
      let configItem = _.find(editorConfig, {'schemaName': this.activeItem.EDITOR})
      return configItem.editor.name
    },

    isSupported () {
      return _.includes(this.editors, this.activeItem.EDITOR)
    },

    editorContentIsValid () {
      return this.$store.state.utils.editorContentIsValid
    },
  },

  watch: {
    'activeItem._path' (value) {
      this.forceEditorReload = true
      this.$nextTick(() => {
        this.forceEditorReload = false
      })
    },
  },

  methods: {
    closeEditor () {
      let pathItems = _.chain(this.$route.params.path).split('>').dropRight().value()

      while (pathItems.length > 0) {
        let path = _.join(pathItems, '.')
        let item = _.get(this.schema, path)

        if (item && !_.has(item, '_order')) {
          this.$router.push({name: 'Content', params: {projectId: this.$store.getters.activeProject.id, path: item._path}})
          return false
        }

        pathItems = _.dropRight(pathItems)
      }

      this.$router.push({name: 'Content', params: {projectId: this.$store.getters.activeProject.id}})
    },
  },

}
</script>

<template>
<section class="editor">
  <heading-core mode="primary">
    <h1>{{activeItem.TITLE}}</h1>
  </heading-core>

  <alert-core mode="info" v-if="activeItem.INFO">
    {{activeItem.INFO}}
  </alert-core>

  <component :is="activeComponentName" v-if="isSupported && !forceEditorReload"/>

  <alert-core mode="warning" v-if="!isSupported && activeItem.EDITOR">
    Editor "<strong>{{activeItem.EDITOR}}</strong>" is not supported, please change editor in the schema. Following editors are supported: <i>{{editors.join(', ')}}</i>
  </alert-core>

  <div class="error" v-if="!editorContentIsValid">
    <div class="message">Invalid Content</div>
  </div>

  <footer class="close-button">
    <button-core @click.native="closeEditor()">Close</button-core>
  </footer>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.editor
  position: relative
  width: 100%
  flex-shrink: 0
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

.close-button
  +center()
  margin-top: 3rem

  +breakpoint('medium')
    display: none

</style>
