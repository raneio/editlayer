<script>
import _ from 'lodash'
import EditorText from '@/components/EditorText'
import EditorTextarea from '@/components/EditorTextarea'
import EditorImage from '@/components/EditorImage'

export default {
  name: 'Editors',

  components: {
    EditorText,
    EditorTextarea,
    EditorImage,
  },

  computed: {

    schema () {
      return this.$store.getters.schema
    },

    activeSchema () {
      return this.$store.getters.activeSchema
    },

    editorData () {
      return {
        projectId: this.$route.params.projectId,
        path: this.activeSchema.PATH,
        content: this.activeSchema.CONTENT,
        config: (this.activeSchema.CONFIG) ? this.activeSchema.CONFIG : null,
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
    {{ activeSchema.NAME }}
  </h1>

  <div class="info" v-if="activeSchema.INFO">
    <img src="../assets/icon-info.svg" alt="" class="icon">
    <div v-text="activeSchema.INFO"></div>
  </div>

  <EditorText
    v-if="activeSchema.EDITOR === 'text'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <EditorTextarea
    v-if="activeSchema.EDITOR === 'textarea'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <EditorImage
    v-if="activeSchema.EDITOR === 'image'"
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
    // margin-left: -.5rem
    // margin-right: -.5rem
    border-radius: $button-border-radius

    .icon
      width: 1rem
      align-self: flex-start

  // .header
  //   background-color: $color-background--light
  //   border-radius: $button-border-radius
  //   padding: 1rem 1.5rem
  //   display: flex
  //   justify-content: space-between
  //
  //   .heading
  //
  //
  //   .description
  //     font-size: .9rem
  //     color: $color-content--light
  //
  //
  //   .nav
  //     +grid('compact', 2rem)
  //     align-items: stretch
  //     text-transform: uppercase
  //
  //     .item
  //       position: relative
  //       display: flex
  //       align-items: center
  //
  //       &.-active::after
  //         content: ''
  //         display: block
  //         position: absolute
  //         left: 1.5rem
  //         right: -.5rem
  //         bottom: -1rem
  //         height: 10px
  //         background-color: $color-primary
  //         transition: width .2s
  //
  //
  //       a
  //         color: $color-content
  //         padding-top: 1rem
  //         padding-bottom: 1rem
  //         margin-top: -1rem
  //         margin-bottom: -1rem

  .CodeMirror
    border-radius: $button-border-radius
    height: auto


// Under /deep/ you can also change style of child components
.main-content /deep/


</style>
