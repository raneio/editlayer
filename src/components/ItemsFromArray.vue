<script>
import _ from 'lodash'
import Item from '@/components/Item'
import BackButton from '@/components/BackButton'


export default {
  name: 'ItemsFromArray',

  props: {
    selectItem: Function,
  },

  components: {
    Item,
    BackButton,
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
        if (_.startsWith(key, '-')) {
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

      if (this.$route.name !== 'edit') {
        return false
      }

      let firstItem = _.find(this.arrayItems[0], { TYPE: 'value' })

      if (firstItem && this.activeSchema.TYPE === 'array') {
        let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
        this.$router.replace({ name: 'edit', params: { id: this.$route.params.id, path: firstItemPath }})
      }
    },

    // selectItem (value) {
    //   let routeName = this.$route.name
    //
    //   if (value.TYPE === 'value') {
    //     routeName = 'edit'
    //   }
    //
    //   let path = _.replace(value.PATH, /\./g, '>')
    //   this.$router.push({ name: routeName, params: { id: this.$route.params.id, path: path }})
    // },

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
      this.$store.dispatch('delteArrayItem', {
        fileId: this.$route.params.id,
        path: arrayItem.PATH,
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

  <header class='header'>
    <BackButton/>
    <button class="button -link -new" @click="newItem()">
      + New Item
    </button>
  </header>

  <div class="no-items" v-if="arrayItems.length === 0">
    <div>No items - add first item</div>
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
      <button @click="moveArrayItem(arrayItem, arrayIdx)" class="button -link -primary">Move</button>
      <button @click="deleteArrayItem(arrayItem)" class="button -link -primary -delete">Delete</button>
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

  .tools
    +chain(.5rem)
    justify-content: flex-end
    transition: opacity .2s
    font-size: .8rem

    .-delete:hover
      color: $color-danger

  .move-here
    position: absolute
    top: .25rem
    left: 0
    right: 0
    transform: translateY(-50%)
    z-index: 1
    width: 100%

  .move-last
    display: block
    width: 100%
    margin-top: 1rem

  .array-item
    border-top: 1px solid $color-hr
    padding-top: .5rem
    position: relative

    & + .array-item
      margin-top: 2rem

  .items
    +margin-to-childs(.3rem)
    position: relative
    transition: transform .2s

    .item
      font-size: 1rem
      transition: opacity .2s, transform .2s
      border-radius: 0

      &::after
        border-top-left-radius: 0
        border-bottom-left-radius: 0

      .image
        border-radius: 0

      &:first-of-type
        border-top-left-radius: $button-border-radius
        border-top-right-radius: $button-border-radius

        &::after
          border-top-left-radius: $button-border-radius

      &:last-of-type
        border-bottom-left-radius: $button-border-radius
        border-bottom-right-radius: $button-border-radius

        &::after
          border-bottom-left-radius: $button-border-radius

        .image
          border-bottom-left-radius: $button-border-radius
          border-bottom-right-radius: $button-border-radius

  &.-moving

    .header,
    .tools
      opacity: 0
      pointer-events: none

    .array-item
      border-top-color: transparent

    .items

      .item
        pointer-events: none
        opacity: .5

      &.-moving
        cursor: pointer
        transform: scale(.95)

        &::after
          content: ''
          position: absolute
          top: -2rem
          bottom: -2rem
          left: -.75rem
          right: -.75rem
          border: 3px dashed $color-active
          border-radius: $button-border-radius

        .item
          opacity: 1

  .no-items
    margin-top: 1rem
    color: $color-disabled
    font-size: .9rem
    font-style: italic
    text-align: center

.array-items /deep/

  .item .preview.-image .image
    border-radius: 0

  .item:last-of-type .preview.-image .image
    border-bottom-left-radius: $button-border-radius
    border-bottom-right-radius: $button-border-radius



</style>
