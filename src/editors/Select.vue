<script>
/**
 * Select Editor
 * @param {string|array} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.OPTIONS[].VALUE
 * @param {string} config.OPTIONS[].LABEL
 */

import EditorBase from '@/editors/common/BaseEditor'

export default {
  extends: EditorBase,

  name: 'SelectEditor',

  computed: {

    options () {
      return this.config.OPTIONS
    },

  },

  methods: {

    label (option) {
      return option.LABEL ? option.LABEL : option.VALUE
    },

  },

}
</script>

<template>
<section class="editor -select">

  <select class="select" v-model="content">
    <option
      :value="option.VALUE"
      v-text="label(option)"
      v-for="(option, index) in options" :key="index"
    />
  </select>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../core/sass/mixins'
</style>
