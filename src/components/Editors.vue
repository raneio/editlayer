<script>
import _ from 'lodash'
import EditorText from '@/components/editors/EditorText'
import EditorTextarea from '@/components/editors/EditorTextarea'
import EditorImage from '@/components/editors/EditorImage'

export default {
  name: 'Editors',

  components: {
    EditorText,
    EditorTextarea,
    EditorImage,
  },

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeStructure () {
      return this.$store.getters.activeStructure
    },

    editorData () {
      return {
        projectId: this.$route.params.projectId,
        path: this.activeStructure.PATH,
        content: this.activeStructure.CONTENT,
        config: (this.activeStructure.CONFIG) ? this.activeStructure.CONFIG : null,
      }
    },

  },

  methods: {

    saveContent (editorData, content) {
      this.$store.dispatch('updateContent', {
        projectId: editorData.projectId,
        path: editorData.path,
        content: content,
      })
    },

  },

}
</script>


<template>
<section class="editors">

  <h1 class="heading">
    {{ activeStructure.NAME }}
  </h1>

  <div class="info" v-if="activeStructure.INFO">
    <img src="@/assets/icon-info.svg" alt="" class="icon">
    <div v-text="activeStructure.INFO"></div>
  </div>

  <EditorText
    v-if="activeStructure.EDITOR === 'text'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <EditorTextarea
    v-if="activeStructure.EDITOR === 'textarea'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <EditorImage
    v-if="activeStructure.EDITOR === 'image'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.editors
  padding: 2rem 0
  +margin-to-childs()

  .info
    +chain(.5rem)
    font-size: .8rem
    background-color: $color-light
    border: 1px solid $color-hr
    padding: .5rem .75rem
    border-radius: $button-border-radius

    .icon
      width: 1rem
      align-self: flex-start

  .CodeMirror
    border-radius: $button-border-radius
    height: auto


</style>
