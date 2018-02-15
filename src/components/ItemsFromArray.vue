<script>
import Item from '@/components/Item'
import _ from 'lodash'


export default {
  name: 'ItemsFromArray',

  components: {
    Item,
  },

  computed: {

    schema () {
      return this.$store.getters.schema
    },

    activeSchema () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let parentPath = _.chain(path).split('.').dropRight().dropRight().join('.').value()
      let activeItem = _.get(this.schema, path)

      if (_.get(activeItem, 'TYPE') === 'array') {
        return activeItem
      } else {
        return _.get(this.schema, parentPath)
      }
    },

    files () {
      return this.$store.getters.files
    },

    groups () {
      let groups = {}
      let source = []

      _.each(this.activeSchema, (value, key) => {
        if (_.startsWith(key, '-')) {
          source.push(value)
        }
      })

      source = _.sortBy(source, ['ORDER'])

      _.each(source, (groupValue, groupKey) => {
        if (_.isPlainObject(groupValue) && groupKey !== 'ARRAY') {
          _.each(groupValue, (itemValue, itemKey) => {
            if (_.isPlainObject(itemValue)) {
              _.set(groups, `${groupKey}.${itemKey}`, itemValue)
            }
          })
        }
      })

      return groups
    },

  },

  watch: {

    activeSchema (value) {
      this.findFirstItem()
    },

  },

  methods: {

    newItem () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      console.log('before', path)

      if (path !== this.activeSchema.PATH && _.includes(path, '.-')) {
        path = _.chain(path).split('.-').slice(0, -1).join('.-').value()
      }

      console.log('after', path)

      this.$store.dispatch('newArrayItem', {
        fileId: this.$route.params.id,
        path: path,
      })
    },

    findFirstItem () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (path !== this.activeSchema.PATH) {
        return false
      }

      _.each(this.activeSchema, (value) => {
        let firstItem = _.find(value, { TYPE: 'value' })

        if (firstItem) {
          let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
          this.$router.replace({ name: 'edit', params: { id: this.$route.params.id, path: firstItemPath }})
          return false
        }
      })
    },

    goBack () {
      let backItem = this.breadcrumb[this.breadcrumb.length-2]
      if (backItem) {
        this.selectItem(backItem, 'back')
      }
    },

    selectItem (value, direction = false) {
      let path = _.replace(value.PATH, /\./g, '>')
      this.$router.push({ name: 'edit', params: { id: this.$route.params.id, path: path }})
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
<section class="groups">

  <div class="button-row">
    <button class="button -primary -outline" @click="newItem()">New Item</button>
  </div>

  <div
    class="items"
    v-for="items in groups">

    <div class="tools">
      <a href="#" class="link">Edit item</a>
    </div>

    <Item
      v-for="item in items"
      :item="item"
      :selectItem="selectItem"
      :key="item.path"
    />

    <!-- <div
      class="button item"
      :class="{'-parent': item.TYPE === 'object' || item.TYPE === 'array', '-active': isActive(item.PATH)}"
      v-for="item in items"
      @click="selectItem(item)"
    >

      <div v-text="item.NAME"/>

      <div class="preview" v-if="item.preview">

        <div
          v-if="item.preview.type === 'text'"
          v-text="item.preview.content"
        />

        <div class="image" v-if="item.preview.type === 'image'">
          <img :src="item.preview.content" alt="">
        </div>

      </div>

    </div> -->

  </div>

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.groups
  +margin-to-childs(2rem)

  .button-row
    margin-top: 2rem
    text-align: center

    .button
      min-width: 60%

  .tools
    font-size: .8rem
    text-align: right
    margin-bottom: -.5rem

    .link
      margin-top: -.5rem
      margin-bottom: -.5rem
      padding-top: .5rem
      padding-bottom: .5rem

  .items
    border-top: 1px solid $color-background--semi-light
    padding-top: .7rem

</style>
