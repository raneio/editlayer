<script>
import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing it
  // this.config - Config data from the schema (read-only)

  name: 'InputEditor',

  computed: {

    preventSave () {
      return !!(this.content && _.get(this.$refs, 'input.validity.valid') === false)
    },

    inputType () {
      return ['date', 'datetime-local', 'email', 'month', 'number', 'password', 'tel', 'time', 'url', 'week'].includes(this.config.TYPE) ? this.config.TYPE : 'text'
    },

    isDatalist () {
      return _.isArray(this.config.DATALIST)
    },

    datalistId () {
      return (this.isDatalist) ? 'datalist' : false
    },

    uploadProcess () {
      if (_.has(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)) {
        return _.get(this.$store.state.uploadProcesses, `${this.projectId}>${this.$route.params.path}`)
      }
      else {
        return null
      }
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
@import '../sass/mixins/all'
</style>
