<script>
/**
 * Input Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.MODE
 * @param {string} config.PLACEHOLDER
 * @param {string} config.MIN
 * @param {string} config.MAX
 * @param {string} config.MINLENGTH
 * @param {string} config.MAXLENGTH
 * @param {string} config.STEP
 * @param {string} config.MULTIPLE
 * @param {array} config.DATALIST
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,

  name: 'InputEditor',

  computed: {

    preventSave () {
      return !!(this.content && _.get(this.$refs, 'input.validity.valid') === false)
    },

    inputType () {
      return ['email', 'number', 'password', 'tel', 'url'].includes(this.config.MODE) ? this.config.MODE : 'text'
    },

    isDatalist () {
      return _.isArray(this.config.DATALIST)
    },

    datalistId () {
      return (this.isDatalist) ? 'datalist' : false
    },

  },

  mounted () {
    this.$refs['input'].focus()
  },

}
</script>

<template>
<section class="editor -input">
  <input
    ref="input"
    class="input"
    v-model="content"
    :type="inputType"
    :placeholder="config.PLACEHOLDER"
    :min="config.MIN"
    :max="config.MAX"
    :minlength="config.MINLENGTH"
    :maxlength="config.MAXLENGTH"
    :step="config.STEP"
    :multiple="config.MULTIPLE"
    :list="datalistId"
  >

  <datalist :id="datalistId" v-if="isDatalist">
    <option v-for="(value, key) in config.DATALIST" :value="value" :key="key"/>
  </datalist>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../core/sass/mixins'
</style>
