<script>
/**
 * Select Editor
 * @param {string|array} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.OPTIONS[].value
 * @param {string} config.OPTIONS[].label
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'SelectEditor',

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
<section class="editor -select">

  <alert-core mode="warning" v-if="!options">
    OPTIONS is required with "select" editor. Fix your schema.
  </alert-core>

  <select class="select" v-model="content" v-if="options">
    <option
      :value="option.value"
      v-text="label(option)"
      v-for="(option, index) in options" :key="index"
    />
  </select>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'
</style>
