<script>
import EditorBase from '@/editors/common/BaseEditor'

export default {
  extends: EditorBase,
  // this.content - Content saves automatically when changing  it
  // this.config - Config data from the structure (read-only)
  name: 'ColorEditor',

  mounted () {
    if (this.content === null) {
      this.content = '#dddddd'
    }
  },
}
</script>

<template>
<section class="editor -color">
  <input type="color" v-model="content">
</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/mixins/all'

.editor.-color

  input
    padding: .2rem
    height: 4rem

</style>
