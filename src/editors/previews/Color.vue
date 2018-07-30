<script>
import EditorBase from '@/editors/common/BasePreview'

export default {
  extends: EditorBase,
  // this.content - Content (read-only)
  // this.config - Config data from the schema (read-only)
  name: 'ColorPreview',
}
</script>

<template>
<div class="preview -color" :style="{backgroundColor: content}"></div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.preview.-color
  height: 2rem

</style>
