<script>
/**
 * Radio button Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.OPTIONS[].value
 * @param {string} config.OPTIONS[].label
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'RadioEditor',

  computed: {

    options () {
      if (!_.isObject(this.config.OPTIONS)) return false
      return this.config.OPTIONS
    },

  },

  methods: {

    label (option) {
      return option.label ? option.label : option.value
    },

  },

}
</script>

<template>
<section class="editor -radio">

  <alert-core mode="warning" v-if="!options">
    OPTIONS is required with "radio" editor. Fix your schema.
  </alert-core>

  <label class="radio" v-for="(option, index) in options" :key="index">
    <input
      class="input"
      type="radio"
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

.editor.-radio
  +gap(.5rem)

.radio
  +chain(.5rem)

  .input
    transform: scale(1.25)

</style>
