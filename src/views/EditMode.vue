<script>
import _ from 'lodash'
import ItemsFromFiles from '@/components/ItemsFromFiles'
import ItemsFromObject from '@/components/ItemsFromObject'
import ItemsFromArray from '@/components/ItemsFromArray'
import SideItems from '@/components/SideItems'
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
    SideItems,
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

    // navSource () {
    //   let path = this.$route.params.path
    //   let parentPath = _.chain(path).split('>').dropRight().join('.').value()
    //   let navSource = this.activeSchema
    //
    //   if (!path) {
    //     navSource = this.schema
    //   } else if (_.has(this.activeSchema, 'EDITOR') && parentPath === '') {
    //     navSource = this.schema
    //   } else if (_.has(this.activeSchema, 'EDITOR') && parentPath !== '') {
    //     navSource = _.get(this.schema, parentPath)
    //   }
    //
    //   return navSource
    // },
    //
    // navArray () {
    //   if (this.navSource.ARRAY !== true) return false
    //
    //   let navArray = []
    //
    //   _.each(this.navSource, (value, key) => {
    //
    //   })
    //
    //   return navArray
    // },
    //
    // navItems () {
    //   if (this.navSource.ARRAY === true) return false
    //
    //   let navItems = []
    //
    //   if (this.$route.params.id) {
    //
    //     _.each(this.navSource, (value, key) => {
    //       if (_.isPlainObject(value)) {
    //
    //         let preview = {}
    //
    //         if (value.EDITOR === 'image') {
    //           preview = {
    //             type: 'image',
    //             content: value.CONTENT,
    //           }
    //         } else if (typeof value.CONTENT === 'string') {
    //           preview = {
    //             type: 'text',
    //             content: (!_.has(value, 'CONTENT') || value.CONTENT.length < 90 ) ? value.CONTENT : value.CONTENT.substring(0, 90).trim() + '...',
    //           }
    //
    //         }
    //
    //         navItems.push({
    //           name: value.NAME,
    //           preview: preview,
    //           path: value.PATH,
    //           type: (value.EDITOR) ? 'item' : 'object',
    //           fileId: this.$route.params.id,
    //         })
    //       }
    //
    //     })
    //
    //   } else {
    //
    //     _.each(this.files, (file) => {
    //       navItems.push({
    //         name: file.filename,
    //         fileId: file.fileId,
    //         type: 'object',
    //       })
    //     })
    //
    //   }
    //
    //   return navItems
    // },

    editorData () {
      return {
        fileId: this.$route.params.id,
        path: this.activeSchema.PATH,
        content: this.activeSchema.CONTENT,
      }
    },

    breadcrumb () {
      let breadcrumb = []
      let breadcrumbItems = []

      if (this.$route.params.path) {
        breadcrumbItems = _.split(this.$route.params.path, '>')
      }

      if (_.has(this.activeSchema, 'EDITOR')) {
        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      while (breadcrumbItems.length > 0) {
        let path = _.join(breadcrumbItems, '.')
        let name = _.get(this.schema, `${path}.NAME`)

        breadcrumb.unshift({
          name: name,
          path: path,
          fileId: this.$route.params.id,
        })

        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      if (this.$route.params.id && this.activeFile) {
        breadcrumb.unshift({
          name: this.activeFile.filename,
          path: '',
          fileId: this.$route.params.id,
        })
      }

      if (this.files.length > 1) {
        breadcrumb.unshift({
          name: 'Home',
          fileId: false,
        })
      }


      return breadcrumb
    },

    showBreadcrumb () {
      if (this.breadcrumb.length === 1 && !_.find(this.navItems, { type: 'object' })) {
        return false
      } else {
        return true
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

    goBack () {
      let backItem = this.breadcrumb[this.breadcrumb.length-2]
      if (backItem) {
        this.selectItem(backItem, 'back')
      }
    },

    selectItem (value, direction = false) {
      if (!direction && value.type === 'object') {
        direction = 'forward'
      }

      if (!direction) {
        this.changePath(value)
      } else {

        // TODO: Make better animation with animation.js
        this.sideItemsClass = `-to-${direction}`

        _.delay(() => {
          this.changePath(value)
          this.sideItemsClass = `-to-${direction}-end`
        }, 100)

        _.delay(() => {
          this.sideItemsClass = false
        }, 125)

      }
    },

    changePath (value) {
      let path = _.replace(value.path, /\./g, '>')
      let fileId = value.fileId

      if (!fileId) {
        this.$router.push({ name: 'edit'})
      } else if (path === '') {
        this.$router.push({ name: 'edit', params: { id: fileId }})
      } else {
        this.$router.push({ name: 'edit', params: { id: fileId, path: path }})
      }
    },

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

      let content = this.schema
      content = this.schemaToJson(content)
      content = _.merge(content, this.arraysToJson(content))

      this.$store.dispatch('publishJson', {
        fileId: this.$route.params.id,
        content: content,
        filename: this.activeFile.filename,
        downloadToken: this.activeFile.downloadToken,
      })
    },

    schemaToJson (schema, result = {}) {
      // console.log('schema', schema)
      _.each(schema, (value, key) => {
        if (_.has(value, 'CONTENT') && _.has(value, 'PATH')) {
          console.log('value', value, key)
          _.set(result, value.PATH, value.CONTENT)
        }

        if (_.has(value, 'ORDER') && _.has(value, 'PATH')) {
          _.set(result, `${value.PATH}.ORDER`, value.ORDER)
        }

        // if (_.has(value, 'ARRAY') && _.has(value, 'PATH')) {
        //   _.set(result, `${value.PATH}.ARRAY`, true)
        // }

        if (_.isPlainObject(value)) {
          this.schemaToJson(value, result)
        }
      })

      return result
    },

    arraysToJson (schema, result = {}, path = []) {
      if (_.isPlainObject(schema) && _.startsWith(_.findKey(schema), '-')) {
        let array = []
        schema = _.sortBy(schema, 'ORDER')

        _.each(schema, (value, key) => {
          value = _.omit(value, ['ORDER'])
          array.push(value)
        })

        _.set(result, _.join(path, '.'), array)
      }

      _.each(schema, (value, key) => {
        if (_.isPlainObject(value)) {
          let newPath = _.union(path, [key])
          this.arraysToJson(value, result, newPath)
        }
      })

      return result
    }

    // arraysToJson (schema, result = {}, path = []) {
    //   let content = schema
    //
    //   if (_.startsWith(_.findKey(schema), '-')) {
    //     content = _.toArray(schema)
    //   }
    //
    //   if ((path.length > 0)) {
    //     _.set(result, path.join('.'), content)
    //   } else {
    //     result = schema
    //   }
    //
    //   _.each(schema, (value, key) => {
    //     if (_.isPlainObject(value)) {
    //       let newPath = _.union(path, [key])
    //
    //       this.arraysToJson(value, result, newPath)
    //     }
    //   })
    //
    //   return result
    // },

  },

  created () {
    this.findFirstItem()
  },

}
</script>


<template>
<section class="layout edit-mode">

  <aside class="aside">

    <header class="header">

      <div class="title">
        Edit Mode
      </div>

      <button
        type="button"
        name="button"
        class="button -primary"
        @click="publish()"
        :disabled="!$route.params.id"
      >
        Publish
      </button>

    </header>

    <section class="content">

      <section class="breadcrumb" v-if="showBreadcrumb">

        <div class="back">
          <button
            @click.prevent="goBack()"
            v-if="breadcrumb.length > 1"
            class="button -invert -circle"
          >
            &lt;
          </button>
        </div>

        <div class="crumbs">

          <div v-for="(item, idx) in breadcrumb" class="crumb">

            <a
              v-if="idx < breadcrumb.length-1"
              v-text="item.name"
              @click.prevent="selectItem(item, 'back')"
            />

            <span
              v-else
              v-text="item.name"
            />

          </div>
        </div>
      </section>

      <ItemsFromFiles v-if="activeType === 'file'"/>
      <ItemsFromObject v-if="activeType === 'object'"/>
      <ItemsFromArray v-if="activeType === 'array'"/>

      <!-- <SideItems/> -->

      <!-- <section class="items" :class="sideItemsClass">

        <div
          class="button item"
          :class="{'-parent': item.type === 'object', '-active': isActive(item.path)}"
          v-for="item in navItems"
          @click="selectItem(item)"
        >

          <div v-text="item.name"/>

          <div class="preview" v-if="item.preview">

            <div
              v-if="item.preview.type === 'text'"
              v-text="item.preview.content"
            />

            <div class="image" v-if="item.preview.type === 'image'">
              <img :src="item.preview.content" alt="">
            </div>

          </div>

        </div>

      </section> -->

    </section>

    <footer class="footer">
      <UserInfo/>
      <div class="button -secondary -outline" @click="switchMode()">
        Switch to Admin Mode
      </div>
    </footer>

  </aside>

  <main class="main">

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
