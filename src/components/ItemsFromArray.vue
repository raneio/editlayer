<script>
import _ from 'lodash'
import Item from '@/components/Item'


export default {
  name: 'ItemsFromArray',

  components: {
    Item,
  },

  data () {
    return {
      movingArrayItem: {
        idx: null,
        path: null,
      },
    }
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

    arrayItems () {
      let arrayItems = []
      let source = []
      let lastItem = null

      _.each(this.activeSchema, (value, key) => {
        if (_.startsWith(key, '-') && value.DELETED !== true) {
          source.push(value)
        }
      })

      source = _.sortBy(source, ['ORDER'])

      _.each(source, (arrayItemValue, arrayItemIdx) => {
        if (_.isPlainObject(arrayItemValue) && arrayItemIdx !== 'ARRAY') {
          _.each(arrayItemValue, (itemValue, itemKey) => {
            _.set(arrayItems, `${arrayItemIdx}.${itemKey}`, itemValue)
          })
        }
      })

      return arrayItems
    },

    arrayItemsAmount () {
      return this.arrayItems.length
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

      if (path !== this.activeSchema.PATH && _.includes(path, '.-')) {
        path = _.chain(path).split('.-').slice(0, -1).join('.-').value()
      }

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

      let firstItem = _.find(this.arrayItems[0], { TYPE: 'value' })

      if (firstItem && this.activeSchema.TYPE === 'array') {
        let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
        this.$router.replace({ name: 'edit', params: { id: this.$route.params.id, path: firstItemPath }})
      }
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

    moveArrayItem (arrayItem, arrayIdx) {
      arrayIdx = _.toNumber(arrayIdx)

      this.movingArrayItem = {
        idx: arrayIdx,
        path: arrayItem.PATH,
      }
    },

    moveHere (arrayItem, arrayIdx) {
      arrayIdx = _.toNumber(arrayIdx)
      let newOrder = null

      if (arrayItem === 'first') {
        newOrder = this.arrayItems[0].ORDER - 1
      } else if (arrayItem === 'last') {
        newOrder = this.arrayItems[this.arrayItems.length-1].ORDER + 1
      } else if (arrayIdx === 0) {
        newOrder = arrayItem.ORDER - 1
      } else {
        newOrder = (this.arrayItems[arrayIdx-1].ORDER + arrayItem.ORDER) / 2
      }

      this.$store.dispatch('updateContent', {
        fileId: this.$route.params.id,
        path: `${this.movingArrayItem.path}.ORDER`,
        content: newOrder,
      })

      this.movingArrayItem = {
        idx: null,
        path: null,
      }
    },

    moveCancel (arrayItem) {
      if (arrayItem.PATH !== this.movingArrayItem.path) return false

      this.movingArrayItem = {
        idx: null,
        path: null,
      }
    },

    deleteArrayItem (arrayItem) {
      this.$store.dispatch('updateContent', {
        fileId: this.$route.params.id,
        path: `${arrayItem.PATH}.DELETED`,
        content: true,
      })
    },

  },

  created () {
    this.findFirstItem()
  },

}
</script>


<template>
<section class="array-items" :class="{ '-moving': movingArrayItem.path !== null}">

  <div class="button-row">
    <button class="button -primary -outline" @click="newItem()">New Item</button>
  </div>

  <div class="array-item" v-for="(arrayItem, arrayIdx) in arrayItems">

    <button
      class="move-here button -primary"
      v-if="movingArrayItem.path !== null && movingArrayItem.path !== arrayItem.PATH && movingArrayItem.idx !== arrayIdx - 1"
      @click="moveHere(arrayItem, arrayIdx)"
    >
      Move Here
    </button>

    <div class="tools">
      <a @click="moveArrayItem(arrayItem, arrayIdx)" class="link">Move</a>
      <a @click="deleteArrayItem(arrayItem)" class="link -delete">Delete</a>
    </div>

    <div
      class="items"
      :class="{ '-moving': movingArrayItem.path === arrayItem.PATH}"
      @click="moveCancel(arrayItem)"
    >

      <Item
        v-for="item in arrayItem"
        v-if="typeof item === 'object'"
        :item="item"
        :selectItem="selectItem"
        :key="item.PATH"
      />

    </div>

  </div>

  <button
    class="move-last button -primary"
    v-if="movingArrayItem.path !== null && movingArrayItem.idx !== arrayItems.length-1"
    @click="moveHere('last')"
  >
    Move Here
  </button>

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.array-items
  +margin-to-childs(2rem)

  .button-row
    transition: opacity .2s

    .button
      min-width: 100%

  .tools
    transition: opacity .2s
    +grid('default', .5rem)
    justify-content: flex-end
    font-size: .7rem
    text-transform: uppercase
    margin-bottom: 0

    .link
      margin-top: -.5rem
      margin-bottom: -.5rem
      padding-top: .5rem
      padding-bottom: .5rem

      &.-delete:hover
        color: $color-danger

  .move-here
    position: absolute
    top: 0
    left: 0
    right: 0
    transform: translateY(-50%)
    z-index: 1
    width: 100%

  .move-last
    display: block
    width: 100%

  .array-item
    border-top: 1px solid $color-background--semi-light
    padding-top: .7rem
    position: relative

  .items
    transition: transform .2s

    .item
      margin-top: .5rem
      transition: opacity .2s, transform .2s

  &.-moving

    .button-row,
    .tools
      opacity: 0
      pointer-events: none

    .items
      transform: scale(.95)
      position: relative

      .item
        pointer-events: none
        opacity: .5

      &.-moving
        cursor: pointer

        &::after
          content: ''
          position: absolute
          top: -2rem
          left: -1rem
          right: -1rem
          bottom: -2rem
          border: 2px dashed $color-primary
          border-radius: $button-border-radius

        .item
          opacity: .9

</style>
