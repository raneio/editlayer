<script>
import EditorBase from '@/editors/common/BaseEditor'
// import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the schema (read-only)
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
@import '../sass/mixins/all'
</style>
