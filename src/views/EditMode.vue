<script>
import _ from 'lodash'
import buildJson from '@/utils/buildJson'
import ItemsFromFiles from '@/components/ItemsFromFiles'
import ItemsFromObject from '@/components/ItemsFromObject'
import ItemsFromArray from '@/components/ItemsFromArray'
import Breadcrumb from '@/components/Breadcrumb'
import UserInfo from '@/components/UserInfo'
import EditorText from '@/components/EditorText'
import EditorTextarea from '@/components/EditorTextarea'
import EditorImage from '@/components/EditorImage'


export default {
  name: 'EditMode',

  components: {
    ItemsFromFiles,
    ItemsFromObject,
    ItemsFromArray,
    Breadcrumb,
    UserInfo,
    EditorText,
    EditorTextarea,
    EditorImage,
  },

  data () {
    return {
      sideItemsClass: false,
    }
  },

  computed: {

    schema () {
      return this.$store.getters.schema
    },

    activeSchema () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (_.has(this.schema, path)) {
        return _.get(this.schema, path)
      } else {
        return {}
      }
    },

    files () {
      return this.$store.getters.files
    },

    activeFile () {
      return _.find(this.files, { fileId: this.$route.params.id })
    },

    activeType () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let activeItem = _.get(this.schema, path)
      let grandparent = _.get(this.schema, _.chain(path).split('.').dropRight(2).join('.').value())

      if (!this.$route.params.id) {
        return 'file'
      } else if (this.activeSchema && this.activeSchema.TYPE === 'array') {
        return 'array'
      } else if (grandparent && this.activeSchema && grandparent.TYPE === 'array' && this.activeSchema.TYPE === 'value') {
        return 'array'
      } else {
        return 'object'
      }
    },

    editorData () {
      return {
        fileId: this.$route.params.id,
        path: this.activeSchema.PATH,
        content: this.activeSchema.CONTENT,
      }
    },

  },

  watch: {

    navItems (value) {
      this.findFirstItem()
    },

  },

  methods: {

    findFirstItem () {
      if (!this.$route.params.id && this.files.length === 1) {
        this.$router.replace({ name: 'edit', params: { id: this.files[0].fileId }})
      } else if (!_.has(this.activeSchema, 'EDITOR')) {
        let firstItem = _.find(this.navItems, { type: 'item' })
        if (_.has(firstItem, 'path')) {
          let firstPath = _.replace(firstItem.path, /\./g, '>')
          this.$router.replace({ name: 'edit', params: { id: this.$route.params.id, path: firstPath }})
        }
      }
    },

    // changePath (value) {
    //   let path = _.replace(value.path, /\./g, '>')
    //   let fileId = value.fileId
    //
    //   if (!fileId) {
    //     this.$router.push({ name: 'edit'})
    //   } else if (path === '') {
    //     this.$router.push({ name: 'edit', params: { id: fileId }})
    //   } else {
    //     this.$router.push({ name: 'edit', params: { id: fileId, path: path }})
    //   }
    // },

    switchMode () {
      if (this.$route.params.id) {
        this.$router.push({ name: 'admin', params: { id: this.$route.params.id, tab: 'schema' }})
      } else {
        this.$router.push({ name: 'admin' })
      }

    },

    isActive (path) {
      return !!(path === _.replace(this.$route.params.path, />/g, '.'))
    },

    saveContent (editorData, content) {
      this.$store.dispatch('updateContent', {
        fileId: editorData.fileId,
        path: editorData.path,
        content: content,
      })
    },

    publish () {
      let content = buildJson(this.schema)
      // content = this.publishSchemaToJson(content)
      // content = _.merge(content, this.publishArraysToJson(content))

      this.$store.dispatch('publishJson', {
        fileId: this.$route.params.id,
        content: content,
        filename: this.activeFile.filename,
        downloadToken: this.activeFile.downloadToken,
      })
    },

    // publishSchemaToJson (schema, result = {}) {
    //   // console.log('schema', schema)
    //   _.each(schema, (value, key) => {
    //     if (_.has(value, 'CONTENT') && _.has(value, 'PATH')) {
    //       _.set(result, value.PATH, value.CONTENT)
    //     }
    //
    //     if (_.has(value, 'ORDER') && _.has(value, 'PATH')) {
    //       _.set(result, `${value.PATH}.ORDER`, value.ORDER)
    //     }
    //
    //     if (_.isPlainObject(value)) {
    //       this.publishSchemaToJson(value, result)
    //     }
    //   })
    //
    //   return result
    // },
    //
    // publishArraysToJson (schema, result = {}, path = []) {
    //   if (_.isPlainObject(schema) && _.startsWith(_.findKey(schema), '-')) {
    //     let array = []
    //     schema = _.sortBy(schema, 'ORDER')
    //
    //     _.each(schema, (value, key) => {
    //       value = _.omit(value, ['ORDER'])
    //       array.push(value)
    //     })
    //
    //     _.set(result, _.join(path, '.'), array)
    //   }
    //
    //   _.each(schema, (value, key) => {
    //     if (_.isPlainObject(value)) {
    //       let newPath = _.union(path, [key])
    //       this.publishArraysToJson(value, result, newPath)
    //     }
    //   })
    //
    //   return result
    // },

    logout () {
      this.$store.dispatch('authLogout')
    },

  },

  created () {
    this.findFirstItem()
  },

}
</script>


<template>
<section class="layout edit-mode">

  <nav class="top-nav">
    <header class="header">
      <div class="item" @click="publish()">
        <div class="content">
          <img src="../../public/icon-publish.svg" alt="">
          Publish
        </div>
      </div>
    </header>

    <footer class="footer">
      <div class="item" @click.prevent="logout()">
        <div class="content">
          <img src="../../public/icon-account.svg" alt="">
        </div>
      </div>
      <div class="item -secondary" @click="switchMode()">
        <div class="content">
          Switch Mode
        </div>
      </div>
    </footer>
  </nav>

  <aside class="side-panel">

    <header class="header">
      <Breadcrumb/>
    </header>

    <section class="content">

      <ItemsFromFiles v-if="activeType === 'file'"/>
      <ItemsFromObject v-if="activeType === 'object'"/>
      <ItemsFromArray v-if="activeType === 'array'"/>

    </section>

  </aside>

  <main class="main-content">

    <header class="header">

      <div>
        <h1 class="heading">
          {{ activeSchema.NAME }}
        </h1>
        <div class="description">
          {{ activeSchema.HELP }}
        </div>
      </div>

      <!-- <nav class="nav">

        <div class="item">
          <a href="#" class="link">Select Editor</a>
        </div>

        <div class="item">
          <a href="#" class="link">History</a>
        </div>

      </nav> -->

    </header>

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

  </main>

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.aside

  .preview
    font-size: .9rem
    color: $color-content--light
    font-weight: 400

    .image
      margin: .5rem -1.5rem -1rem

      img
        border-bottom-left-radius: $button-border-radius
        border-bottom-right-radius: $button-border-radius

</style>
