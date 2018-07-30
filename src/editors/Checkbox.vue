<script>
/**
 * Checkbox Editor
 * @param {string|array} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.OPTIONS[].label
 * @param {string} config.OPTIONS[].value
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'CheckboxEditor',

  computed: {

    options () {
      if (!_.isObject(this.config.OPTIONS)) return false
      return this.config.OPTIONS
    },

  },

  methods: {

    label (option) {
      return option.label || option.value
    },

    removeNonExitingValues () {
      let content = []

      _.each(this.content, item => {
        if (_.find(this.options, {value: item})) {
          content.push(item)
        }
      })

      this.content = content
    },

  },

  mounted () {
    if (!_.isArray(this.content)) {
      this.content = []
    }

    this.removeNonExitingValues()
  },

}
</script>

<template>
<section class="editor -checkbox">

  <alert-core mode="warning" v-if="!options">
    OPTIONS is required with "checkbox" editor. Fix your schema.
  </alert-core>

  <label class="checkbox" v-for="(option, index) in options" :key="index">
    <input
      class="input"
      type="checkbox"
      v-model="content"
      :value="option.value"
    >
    <span v-text="label(option)"></span>
  </label>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.editor.-checkbox
  +gap(.5rem)

.checkbox
  +chain(.5rem)

  .input
    transform: scale(1.5)

</style>
