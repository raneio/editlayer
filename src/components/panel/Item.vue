<script>
import _ from 'lodash'
import editorConfig from '@/editors'

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
    selectItem: Function,
  },

  components,

  computed: {

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

    <h2 class="heading" v-text="item.TITLE"/>

    <span v-if="isDraft" class="draft">draft</span>

    <span class="spacer"></span>

    <icon v-if="isParent" name="chevron-right"/>

  </header>

  <component :is="activePreviewComponentName" :item="item"/>

  <!-- <Preview :item="item"/> -->

  <!-- <div
    class="content -text"
    v-if="preview.type === 'text'"
    v-text="preview.content"
  />

  <div
    class="content -code"
    v-if="preview.type === 'code'"
    v-text="preview.content"
  />

  <div
    class="content -color"
    :class="{'-isDark': preview.isDark}"
    :style="{'backgroundColor': preview.color}"
    v-if="preview.type === 'color'"
    v-text="preview.content"
  />

  <div
    class="content -switch"
    :class="{'-isOn': preview.content === 'ON', '-isOff': preview.content === 'OFF'}"
    v-if="preview.type === 'switch'"
    v-text="preview.content"
  />

  <div
    class="content -image"
    v-if="preview.type === 'image'"
  >
    <img class="image" :src="preview.content" alt="" v-if="preview.content !== null">
  </div> -->

</card-core>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.item
  position: relative
  overflow: hidden

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

  .draft
    color: $color-warning
    font-size: .75rem

  .spacer
    flex-grow: 1

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
