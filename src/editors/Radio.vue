<script>
import EditorBase from '@/editors/common/BaseEditor'
// import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the schema (read-only)
  name: 'RadioEditor',

  computed: {

    options () {
      return this.config.OPTIONS
    },

  },

  methods: {

    label (option) {
      console.log('option', option)
      return option.LABEL ? option.LABEL : option.VALUE
    },

  },

}
</script>

<template>
<section class="editor -radio">

  <label class="radio" v-for="(option, index) in options" :key="index">
    <input
      class="input"
      type="radio"
      v-model="content"
      :value="option.VALUE"
    >
    <span v-text="label(option)"></span>
  </label>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.editor.-radio
  +gap(.5rem)

.radio
  +chain(.5rem)

  .input
    transform: scale(1.25)

</style>
