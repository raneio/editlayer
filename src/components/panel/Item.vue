<script>
import _ from 'lodash'
import anime from 'animejs'
import editorConfig from '@/editors/config'

let components = {}
let editors = []

_.each(editorConfig, configItem => {
  components[configItem.preview.name] = configItem.preview
  editors.push(configItem.schemaName)
})

export default {
  name: 'Item',

  props: {
    item: Object,
    parentItems: Object,
    // selectItem: Function,
  },

  components,

  computed: {

    projectId () {
      return this.$route.params.projectId
    },

    isActive () {
      if (this.$route.name !== 'Content') return false
      return !!(this.item._path === _.replace(this.$route.params.path, />/g, '.'))
    },

    isParent () {
      return this.item._type === 'object' || this.item._type === 'array'
    },

    isDraft () {
      return this.item._status === 'draft'
    },

    activePreviewComponentName () {
      let configItem = _.find(editorConfig, {'schemaName': this.item.EDITOR})
      return configItem ? configItem.preview.name : false
    },

    title () {
      if (!this.item.TITLE) return '…'
      return this.item.TITLE
    },

  },

  methods: {

    selectItem (item) {
      let projectId = (item.FILE_ID) ? item.FILE_ID : this.projectId
      let routeName = (item._type === 'item') ? 'Content' : this.$route.name
      let path = _.replace(item._path, /\./g, '>')

      if (item._type === 'item') {
        this.$router.push({name: routeName, params: {projectId: projectId, path: path}})
        return false
      }

      if (routeName === 'Dashboard') {
        routeName = (this.$route.params.view === 'schema') ? 'Schema' : 'Content'
      }

      anime.timeline()
        .add({
          targets: '.js-panel',
          translateX: '-100%',
          opacity: 0,
          easing: 'linear',
          duration: 150,
        })
        .add({
          targets: '.js-panel',
          translateX: '100%',
          duration: 0,
          complete: (anim) => {
            if (path) {
              this.$router.push({name: routeName, params: {projectId: projectId, path: path}})
            }
            else {
              this.$router.push({name: routeName, params: {projectId: projectId}})
            }
          },
        })
        .add({
          targets: '.js-panel',
          translateX: 0,
          opacity: 1,
          easing: 'linear',
          duration: 150,
        })
    },

  },

}
</script>

<template>
<card-core
  size="small"
  link
  class="item"
  :class="{
    '-parent': isParent,
    '-active': isActive,
    '-draft': isDraft,
  }"
  @click.native="selectItem(item)"
>

  <header class="header">
    <h2 class="heading" v-text="title"/>
    <hr>
    <span v-if="isDraft" class="draft">draft</span>
    <icon v-if="isParent" name="chevron-right"/>
  </header>

  <component :is="activePreviewComponentName" :item="item"/>

</card-core>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.item
  position: relative
  overflow: hidden
  flex-shrink: 0

  &::after
    content: ''
    position: absolute
    left: 0
    top: 0
    bottom: 0
    right: 0
    border-left: .5rem solid $color-info
    transition: opacity .2s
    opacity: 0

  &.-active::after
    opacity: 1

    .text
      +chain(.25rem)

  &.-parent

    .header
      padding-top: 1.5em
      padding-bottom: 1.5em

    .heading
      white-space: normal

  .draft
    color: $color-warning
    font-size: .75rem

  .content
    flex-grow: 1
    overflow: hidden

    &.-code
      font-size: .7em
      font-family: monospace
      background-color: $color-gray
      color: mix($color-gray, $color-white, 20%)

    &.-color
      font-family: monospace
      color: $color-black

      &.-isDark
        color: $color-white

    &.-switch
      font-size: 1rem
      font-weight: 900

      &.-isOn
        color: $color-success

      &.-isOff
        color: $color-danger

    &.-image
      position: relative
      background-image: url('../../assets/image-background.png')
      background-position: center
      border-bottom-left-radius: $button-border-radius
      border-bottom-right-radius: $button-border-radius
      height: 5em
      display: flex
      justify-content: center
      align-items: center
      padding: 0

      .image
        height: 6em
        width: 100%
        object-fit: cover
        filter: brightness(93%)

</style>
