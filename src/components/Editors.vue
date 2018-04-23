<script>
import _ from 'lodash'
import Input from '@/components/editors/Input'
import Textarea from '@/components/editors/Textarea'
import ImageEditor from '@/components/editors/Image'
import CKEditor5 from '@/components/editors/CKEditor5'

export default {
  name: 'Editors',

  components: {
    Input,
    Textarea,
    ImageEditor,
    CKEditor5
  },

  data () {
    return {
      activeEditor: null
    }
  },

  computed: {

    editors () {
      return this.$store.state.editors
    },

    structure () {
      return this.$store.getters.structure
    },

    activeStructure () {
      return this.$store.getters.activeStructure
    },

    editorData () {
      return {
        editor: this.activeStructure.EDITOR,
        projectId: this.$route.params.projectId,
        path: this.activeStructure.PATH,
        content: this.activeStructure.CONTENT,
        config: (this.activeStructure.CONFIG) ? this.activeStructure.CONFIG : null
      }
    }

    // editorIsExists () {
    //   return _.includes(this.editors, this.activeStructure.EDITOR)
    // },

    // isInput () {
    //   return
    // }

  },

  watch: {

    'editorData.path' (value) {
      this.selectEditor()
    }

  },

  methods: {

    saveContent (editorData, content) {
      this.$store.dispatch('updateContent', {
        projectId: editorData.projectId,
        path: editorData.path,
        content: content,
      })
    },

    selectEditor () {
      this.activeEditor = false
      if (_.isEmpty(this.activeStructure)) return false

      let inputEditors = [
        'text',
        'email',
        'color',
        'date',
        'week',
        'month',
        'time',
        'datetime',
        'number',
        'password',
        'range',
        'tel',
        'url'
      ]

      this.$nextTick(function () {
        if (_.includes(inputEditors, this.activeStructure.EDITOR)) {
          this.activeEditor = 'input'
        } else if (this.activeStructure.EDITOR === 'textarea') {
          this.activeEditor = 'textarea'
        } else if (this.activeStructure.EDITOR === 'image') {
          this.activeEditor = 'image'
        } else if (this.activeStructure.EDITOR === 'richtext') {
          this.activeEditor = 'richtext'
        } else {
          this.activeEditor = null
        }
      })
    }

  },

  mounted () {
    this.selectEditor()
  }

}
</script>

<template>
<section class="editors">

  <h1 class="heading">
    {{ activeStructure.NAME }}
  </h1>

  <div class="alert -info" v-if="activeStructure.INFO" v-text="activeStructure.INFO"></div>

  <Input
    v-if="activeEditor === 'input'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <Textarea
    v-if="activeEditor === 'textarea'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <ImageEditor
    v-if="activeEditor === 'image'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <CKEditor5
    v-if="activeEditor === 'richtext'"
    :editorData="editorData"
    :saveFunction="saveContent"
  />

  <div class="alert -warning" v-if="activeEditor === null">
    Editor "<strong>{{activeStructure.EDITOR}}</strong>" is not supported, please change editor in the structure. Following editors are supported: <i>{{editors.join(', ')}}</i>
  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.editors
  padding: 2rem 0
  +margin-to-childs()

</style>
