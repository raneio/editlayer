<script>
import _ from 'lodash'
import Chance from 'chance'
import firebase from '@/utils/firebase'
import Item from '@/components/panel/Item'
import BackButton from '@/components/navigation/BackButton'

const chance = new Chance()

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
      confirmDeleteIdx: null,
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
      if (_.get(activeItem, '_type') === 'array') {
        return activeItem
      }
      else {
        return _.get(this.schema, parentPath)
      }
    },

    projectId () {
      return this.$route.params.projectId
    },

    projects () {
      return this.$store.getters.projects
    },

    arrayItems () {
      let arrayItems = []
      let source = []
      // let lastItem = null

      _.each(this.activeSchema, (value, key) => {
        if (_.startsWith(key, '-')) {
          source.push(value)
        }
      })

      source = _.sortBy(source, ['_order'])

      _.each(source, (arrayItemValue, arrayItemIdx) => {
        if (_.isPlainObject(arrayItemValue) && arrayItemIdx !== '_array') {
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
      let itemPath = _.replace(this.$route.params.path, />/g, '.')

      if (itemPath !== this.activeSchema._path && _.includes(itemPath, '.-')) {
        itemPath = _.chain(itemPath).split('.-').slice(0, -1).join('.-').value()
      }

      // TODO: Change hass to random string
      let randomKey = `-${chance.hash({length: 4})}`
      let path = `draft.${itemPath}`
      let newPath = `${path}.${randomKey}`
      let order = 0

      if (_.has(this.projects[this.projectId], newPath)) {
        this.newItem()
        return false
      }

      _.each(this.arrayItems, (item, key) => {
        if (order >= item._order) {
          order = item._order - 1
        }
      })

      let updateData = {}
      updateData[newPath] = {
        _order: order,
      }

      firebase.firestore
        .collection('projects')
        .doc(this.projectId)
        .update(updateData)
        .then(() => {
          // console.log('New item added!')
          let pathUrl = _.replace(`${itemPath}.${randomKey}`, /\./g, '>')
          this.$router.push({name: 'Content', params: {projectId: this.projectId, path: pathUrl}})
        })
        .catch((error) => console.error('Error new item:', error))
    },

    findFirstItem () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (path !== this.activeSchema._path) return false
      if (this.$route.name !== 'Content') return false
      // if (this.$store.getters.isMobile) return false

      let firstItem = _.find(this.arrayItems[0], { _type: 'value' })

      if (firstItem && this.activeSchema._type === 'array') {
        let firstItemPath = _.replace(firstItem._path, /\./g, '>')
        this.$router.replace({name: 'Content', params: {projectId: this.projectId, path: firstItemPath}})
      }
    },

    isActive (path) {
      return !!(path === _.replace(this.$route.params.path, />/g, '.'))
    },

    moveArrayItem (arrayItem, arrayIdx) {
      arrayIdx = _.toNumber(arrayIdx)

      this.movingArrayItem = {
        idx: arrayIdx,
        path: arrayItem._path,
      }
    },

    moveHere (arrayItem, arrayIdx) {
      arrayIdx = _.toNumber(arrayIdx)
      let newOrder = null

      if (arrayItem === 'first') {
        newOrder = this.arrayItems[0]._order - 1
      }
      else if (arrayItem === 'last') {
        newOrder = this.arrayItems[this.arrayItems.length - 1]._order + 1
      }
      else if (arrayIdx === 0) {
        newOrder = arrayItem._order - 1
      }
      else {
        newOrder = (this.arrayItems[arrayIdx - 1]._order + arrayItem._order) / 2
      }

      this.$store.dispatch('updateContent', {
        projectId: this.projectId,
        path: `${this.movingArrayItem.path}._order`,
        content: newOrder,
      })

      this.movingArrayItem = {
        idx: null,
        path: null,
      }
    },

    moveCancel (arrayItem) {
      if (arrayItem._path !== this.movingArrayItem.path) return false

      this.movingArrayItem = {
        idx: null,
        path: null,
      }
    },

    deleteArrayItem (arrayIdx) {
      this.confirmDeleteIdx = arrayIdx
    },

    confirmDeleteYes (arrayItem, arrayIdx) {
      let updateData = {}
      updateData[`draft.${arrayItem._path}`] = firebase.firestoreDelete

      let redirectIdx = (arrayIdx > 0) ? arrayIdx - 1 : 1
      let redirectPath = _.get(this.arrayItems, `${redirectIdx}._path`)
      let parentPath = _.chain(this.$route.params.path).split('>').slice(0, -1).join('.').value()

      if (redirectPath && arrayItem._path === parentPath) {
        this.$router.replace({name: this.$route.name, params: {projectId: this.projectId, path: redirectPath}})
      }

      firebase.firestore
        .collection('projects')
        .doc(this.projectId)
        .update(updateData)
        .then(() => {
          // console.log('Item successfully deleted!')
        })
        .catch((error) => console.error('Error deleting item', error))

      this.confirmDeleteIdx = null
    },

    confirmDeleteNo (arrayIdx) {
      this.confirmDeleteIdx = null
    },

  },

  created () {
    this.findFirstItem()
  },

}
</script>

<template>
<section class="items-from -array" :class="{ '-moving': movingArrayItem.path !== null}">

  <header class="header">
    <BackButton/>
    <button-core mode="success" size="small" @click.native="newItem()">
      <icon name="plus"/>
      <span>New Item</span>
    </button-core>
  </header>

  <section class="content">

    <div class="no-items" v-if="arrayItems.length === 0">
      <div>No items - add first item</div>
    </div>

    <div
      class="array-item"
      v-for="(arrayItem, arrayIdx) in arrayItems"
      :key="arrayIdx"
    >

      <button-core
        mode="primary"
        class="move-here"
        v-if="movingArrayItem.path !== null && movingArrayItem.path !== arrayItem._path && movingArrayItem.idx !== arrayIdx - 1"
        @click.native="moveHere(arrayItem, arrayIdx)"
      >
        Move Here
      </button-core>

      <div class="tools">
        <button-core light @click.native="moveArrayItem(arrayItem, arrayIdx)" v-if="confirmDeleteIdx !== arrayIdx">Move</button-core>
        <button-core light @click.native="deleteArrayItem(arrayIdx)" v-if="confirmDeleteIdx !== arrayIdx">Delete</button-core>

        <div class="confirm" v-if="confirmDeleteIdx === arrayIdx">
          <div>Are you sure?</div>
          <button-core light @click.native="confirmDeleteNo()">No</button-core>
          <button-core mode="danger" light @click.native="confirmDeleteYes(arrayItem, arrayIdx)">Yes</button-core>
        </div>
      </div>

      <div
        class="items"
        :class="{ '-moving': movingArrayItem.path === arrayItem._path}"
        @click="moveCancel(arrayItem)"
      >

        <Item
          v-for="item in arrayItem"
          v-if="typeof item === 'object'"
          :item="item"
          :selectItem="selectItem"
          :key="item._path"
        />

      </div>

    </div>

    <button-core
      mode="primary"
      class="move-last"
      v-if="movingArrayItem.path !== null && movingArrayItem.idx !== arrayItems.length-1"
      @click.native="moveHere('last')"
    >
      Move Here
    </button-core>

  </section>

</section>
</template>

<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../../sass/variables'
@import '../../core/sass/mixins'

.items-from.-array

  > .header
    +chain()
    justify-content: space-between

  .tools
    +chain(.5rem)
    // justify-content: flex-end
    transition: opacity .2s
    // font-size: .9rem
    margin-bottom: .75rem

    .confirm
      +chain(1rem)
      align-items: center

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
    margin-top: 1rem
    flex-shrink: 0

  .array-item
    position: relative

    & + .array-item
      margin-top: 5rem

  .items
    +gap(1rem)
    position: relative
    transition: transform .2s

    .item
      border-radius: 0

      &::after
        border-top-left-radius: 0
        border-bottom-left-radius: 0

      & > :last-child
        border-bottom-left-radius: 0
        border-bottom-right-radius: 0

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

        & > :last-child
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
          border: 3px dashed $color-primary
          border-radius: $button-border-radius

        .item
          opacity: 1

  .no-items
    margin-top: 1rem
    color: $color-gray
    font-size: .9rem
    font-style: italic
    text-align: center

</style>
