<script>
import _ from 'lodash'


export default {
  name: 'SideNav',

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
      if (!this.$route.params.id) return {}

      let path = _.replace(this.$route.params.path, />/g, '.')
      let parentPath = _.chain(path).split('.').dropRight().join('.').value()
      let activeItem = _.get(this.schema, path)

      // console.log('path', path)
      // console.log('parentPath', parentPath)
      // console.log('activeItem', activeItem)
      if (activeItem && (_.get(activeItem, 'ARRAY') === true || !_.has(activeItem, 'EDITOR'))) {
        // console.log('activeSchema = active')
        return activeItem
      } else if (!path || !parentPath) {
        // console.log('activeSchema = root')
        return this.schema
      } else {
        // console.log('activeSchema = parent')
        return _.get(this.schema, parentPath)
      }
    },

    // schemaFromFiles () {
    //   let schema = []
    //
    //   _.each(this.files, (value, key) => {
    //     schema.push({
    //       NAME: value.filename,
    //       FILE_ID: value.fileId,
    //     })
    //   })
    //
    //   return schema
    // },

    files () {
      return this.$store.getters.files
    },

    activeFile () {
      return _.find(this.files, { fileId: this.$route.params.id })
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

    groups () {

      if (!this.$route.params.id) {
        let items = _.map(this.files, (value) => {
          return {
            NAME: value.filename,
            FILE_ID: value.fileId,
            OBJECT: true,
          }
        })

        return {
          items: items
        }
      } else if (true) {
        // let groups = {}
        //
        // _.each(this.activeSchema, (value, key) => {
        //   if (_.isPlainObject(value)) {
        //     _.set(groups, key, {
        //       NAME: value.filename,
        //       FILE_ID: value.fileId,
        //       OBJECT: true,
        //     })
        //   }
        // })

        let groups = _.map(this.activeSchema, (value, key) => {
          if (_.isPlainObject(value)) {
            return {
              key :{
                NAME: value.filename,
              }
            }
          }
        })

        return groups

      }

      // let navItems = []

      // if (this.$route.params.id) {

        // _.each(this.activeSchema, (value, key) => {
        //   if (_.isPlainObject(value)) {
        //     navItems.push({
        //       name: value.NAME,
        //       // preview: preview,
        //       path: value.PATH,
        //       type: (value.EDITOR) ? 'item' : 'object',
        //       fileId: (value.FILE_ID) ? value.FILE_ID : this.$route.params.id,
        //     })
        //   }
        // })

      // } else {
      //
      //   _.each(this.files, (file) => {
      //     navItems.push({
      //       name: file.filename,
      //       fileId: file.fileId,
      //       type: 'object',
      //     })
      //   })
      //
      // }

      // return {
      //   onlyOne1: navItems,
      //   onlyOne2: this.activeSchema,
      // }

    },

  },

  watch: {

    groups (value) {
      this.findFirstItem()
    },

  },

  methods: {

    findFirstItem () {
      if (!this.$route.params.id && this.files.length === 1) {
        this.$router.replace({ name: 'edit', params: { id: this.files[0].fileId }})
      } else if (!_.has(this.activeSchema, 'EDITOR')) {
        let firstItem = _.find(this.group, { type: 'item' })
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
      if (!direction && value.OBJECT === true || value.ARRAY === true) {
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
      let path = _.replace(value.PATH, /\./g, '>')
      let fileId = (_.has(value, 'FILE_ID')) ? value.FILE_ID : this.$route.params.id

      if (path && fileId) {
        this.$router.push({ name: 'edit', params: { id: fileId, path: path }})
      } else if (fileId !== false) {
        this.$router.push({ name: 'edit', params: { id: fileId }})
      } else {
        this.$router.push({ name: 'edit'})
      }

    },

    isActive (path) {
      return !!(path === _.replace(this.$route.params.path, />/g, '.'))
    },

  },

  created () {
    this.findFirstItem()
  },

}
</script>


<template>
<section class="items" :class="sideItemsClass">

  <section
    class="group"
    v-for="group in groups">

    <div
      class="button item"
      :class="{'-parent': item.OBJECT === true || item.ARRAY === true, '-active': isActive(item.PATH)}"
      v-for="item in group"
      @click="selectItem(item)"
    >

      <div v-text="item.NAME"/>

      <!-- <div class="preview" v-if="item.preview">

        <div
          v-if="item.preview.type === 'text'"
          v-text="item.preview.content"
        />

        <div class="image" v-if="item.preview.type === 'image'">
          <img :src="item.preview.content" alt="">
        </div>

      </div> -->

    </div>

  </section>

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

</style>
