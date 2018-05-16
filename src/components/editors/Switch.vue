<script>
import _ from 'lodash'

export default {
  name: 'SwitchEditor',

  props: {
    editorData: Object,
    saveFunction: Function,
  },

  data () {
    return {
      content: this.editorData.content,
    }
  },

  watch: {

    'editorData.content' (value) {
      this.content = value
    },

    content: _.debounce(function () {
      this.saveFunction(this.editorData, this.content)
    }, 500),

  },

  methods: {

    switchOn () {
      this.content = true
    },

    switchOff () {
      this.content = false
    },

  },

}
</script>

<template>
<section class="editor -switch">

  <div class="input-group">
    <button
      class="button"
      :class="{'-red': !content, '-gray': content}"
      @click="switchOff()"
    >
      Off
    </button>
    <button
      class="button"
      :class="{'-green': content, '-gray': !content}"
      @click="switchOn()"
    >
      On
    </button>
  </div>


</section>
</template>

<style lang="sass" scoped>
@import '../../sass/features'

.button
  min-width: 6rem

</style>
