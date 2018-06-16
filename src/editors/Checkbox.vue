<script>
import EditorBase from '@/editors/common/BaseEditor'
// import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the structure (read-only)
  name: 'CheckboxEditor',

  computed: {

    label () {
      return (this.config.LABEL) ? this.config.LABEL : this.config.TITLE
    },

  },
}
</script>

<template>
<section class="editor -checkbox">

  <label class="default">
    <input class="checkbox" type="checkbox" v-model="content">
    <span v-text="label"></span>
  </label>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.default
  +chain(.5rem)

  .checkbox
    transform: scale(1.5)

</style>
