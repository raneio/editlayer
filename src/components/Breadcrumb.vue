<script>
import _ from 'lodash'
import titleCase from 'title-case'


export default {
  name: 'Breadcrumb',

  props: {
    // item: Object,
    // selectItem: Function,
  },

  computed: {

    files () {
      return this.$store.getters.files
    },

    activeFile () {
      return this.$store.getters.activeFile
    },

    schema () {
      return this.$store.getters.schema
    },

    activeSchema (state, getters) {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (_.has(this.schema, path)) {
        return _.get(this.schema, path)
      } else {
        return {}
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
        let item = _.get(this.schema, path)

        if (item && !_.has(item, 'ORDER')) {
          breadcrumb.unshift({
            name: this.stringToTitle(item.NAME),
            path: path,
            fileId: this.$route.params.id,
          })
        }

        breadcrumbItems = _.dropRight(breadcrumbItems)
      }

      if (this.$route.params.id && this.activeFile) {
        breadcrumb.unshift({
          name: this.stringToTitle(this.activeFile.filename),
          fileId: this.$route.params.id,
        })
      }

      if (this.files.length > 1) {
        breadcrumb.unshift({
          name: 'Home',
        })
      }


      return breadcrumb
    },

    showBreadcrumb () {
      return true
      if (this.breadcrumb.length === 1 && !_.find(this.navItems, { type: 'object' })) {
        return false
      } else {
        return true
      }
    },

  },

  methods: {

    stringToTitle (text) {
      if (_.endsWith(text, '.json')) {
        text = text.slice(0, -5)
      }

      return titleCase(text)
    },

    goBack () {
      let backItem = this.breadcrumb[this.breadcrumb.length-2]
      if (backItem) {
        this.selectItem(backItem)
      }
    },

    selectItem (item) {
      let path = _.replace(item.path, /\./g, '>')
      if (item.fileId && path) {
        this.$router.push({ name: 'edit', params: { id: item.fileId, path: path }})
      } else if (item.fileId) {
        this.$router.push({ name: 'edit', params: { id: item.fileId }})
      } else {
        this.$router.push({ name: 'edit' })
      }
    },

  },

}
</script>


<template>
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
        @click.prevent="selectItem(item)"
      />

      <span
        v-else
        v-text="item.name"
      />

    </div>
  </div>
</section>
</template>
