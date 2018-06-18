<script>
/**
 * Checkbox Editor
 * @param {string|array} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.OPTIONS[].LABEL
 * @param {string} config.OPTIONS[].VALUE
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'CheckboxEditor',

  data () {
    return {
      values: [],
    }
  },

  watch: {

    values () {
      this.saveValues()
    },

  },

  computed: {

    options () {
      if (_.has(this.config, 'OPTIONS')) {
        return this.config.OPTIONS
      }
      else {
        return [{
          VALUE: (this.config.VALUE) ? this.config.VALUE : true,
          LABEL: (this.config.LABEL) ? this.config.LABEL : this.config.TITLE,
        }]
      }
    },

  },

  methods: {

    initValues () {
      if (_.has(this.config, 'OPTIONS')) {
        this.values = this.content ? this.content : []
      }
      else {
        this.values = this.content === this.config.VALUE ? [this.content] : []
      }
    },

    saveValues () {
      if (_.has(this.config, 'OPTIONS')) {
        let newValues = []

        _.each(this.config.OPTIONS, option => {
          if (_.includes(this.values, option.VALUE)) {
            newValues.push(option.VALUE)
          }
        })

        this.content = newValues
      }
      else {
        this.content = (this.values.length > 0) ? this.values[0] : false
      }
    },

    label (option) {
      return option.LABEL ? option.LABEL : option.VALUE
    },

  },

  created () {
    this.initValues()
  },

}
</script>

<template>
<section class="editor -checkbox">

  <label class="checkbox" v-for="(option, index) in options" :key="index">
    <input
      class="input"
      type="checkbox"
      v-model="values"
      :value="option.VALUE"
    >
    <span v-text="label(option)"></span>
  </label>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.editor.-checkbox
  +gap(.5rem)

.checkbox
  +chain(.5rem)

  .input
    transform: scale(1.5)

</style>
