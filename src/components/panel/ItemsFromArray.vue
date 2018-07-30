<script>
import _ from 'lodash'
import generate from 'nanoid/generate'
import firebase from '@/utils/firebase'
import Item from '@/components/panel/Item'
import BackButton from '@/components/navigation/BackButton'

export default {
  name: 'ItemsFromArray',

  // props: {
  //   selectItem: Function,
  // },

  components: {
    Item,
    BackButton,
  },

  data () {
    return {
      manageItems: false,
      movingArrayItem: {
        idx: null,
        path: null,
      },
      confirmDeleteIdx: null,
    }
  },

  computed: {

    structure () {
      return this.$store.getters.structure
    },

    activeItem () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let parentPath = _.chain(path).split('.').dropRight().dropRight().join('.').value()
      let activeItem = _.get(this.structure, path)
      if (_.get(activeItem, '_type') === 'array') {
        return activeItem
      }
      else {
        return _.get(this.structure, parentPath)
      }
    },

    projectId () {
      return this.$route.params.projectId
    },

    activeProject () {
      return this.$store.getters.activeProject
    },

    arrayItems () {
      let arrayItems = []
      let source = []
      // let lastItem = null

      _.each(this.activeItem, (value, key) => {
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

    activeItem (value) {
      this.selectFirstItem()
    },

  },

  methods: {

    newItem () {
      let itemPath = _.replace(this.$route.params.path, />/g, '.')

      if (itemPath !== this.activeItem._path && _.includes(itemPath, '.-')) {
        itemPath = _.chain(itemPath).split('.-').slice(0, -1).join('.-').value()
      }

      let randomKey = generate('abcdefghijklmnopqrstuvwxyz', 4)
      let path = `draft.${itemPath}`
      let newPath = `${path}.-${randomKey}`
      let order = 0

      if (_.has(this.activeProject, newPath)) {
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
        .catch((error) => console.error('Error new item:', error))
    },

    selectFirstItem () {
      if (this.$store.state.utils.windowWidth <= 900) return null
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (path !== this.activeItem._path) return false
      if (this.$route.name !== 'Content') return false
      // if (this.$store.getters.isMobile) return false

      let firstItem = _.find(this.arrayItems[0], { _type: 'item' })

      if (firstItem && this.activeItem._type === 'array') {
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
    this.selectFirstItem()
  },

}
</script>

<template>
<section class="items-from -array" :class="{ '-moving': movingArrayItem.path !== null}">

  <header class="header">
    <BackButton/>

    <button-core size="small" light @click.native="manageItems = true" v-if="!manageItems">
      <span>Manage items</span>
    </button-core>

    <button-core size="small" light @click.native="manageItems = false" v-if="manageItems">
      <span>Done</span>
    </button-core>
  </header>

  <main class="main">

    <header class="header">
      <button-core mode="success" @click.native="newItem()">
        <icon name="plus"/>
        <span>New Item</span>
      </button-core>
    </header>

    <div class="no-items" v-if="arrayItems.length === 0">
      <div>No items - add first item</div>
    </div>

    <section
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

      <div class="tools" v-if="manageItems">
        <button-core size="small" light @click.native="moveArrayItem(arrayItem, arrayIdx)" v-if="confirmDeleteIdx !== arrayIdx">Move</button-core>
        <button-core size="small" light @click.native="deleteArrayItem(arrayIdx)" v-if="confirmDeleteIdx !== arrayIdx">Delete</button-core>

        <div class="confirm" v-if="confirmDeleteIdx === arrayIdx">
          <div>Are you sure?</div>
          <button-core size="small" light @click.native="confirmDeleteNo()">No</button-core>
          <button-core size="small" mode="danger" light @click.native="confirmDeleteYes(arrayItem, arrayIdx)">Yes</button-core>
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
          :parentItems="arrayItem"
          :key="item._path"
        />

      </div>

    </section>

    <button-core
      mode="primary"
      class="move-last"
      v-if="movingArrayItem.path !== null && movingArrayItem.idx !== arrayItems.length-1"
      @click.native="moveHere('last')"
    >
      Move Here
    </button-core>

  </main>

</section>
</template>

<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../../sass/variables'
@import '../../sass/core/mixins'

.items-from.-array

  > .header
    +chain()
    justify-content: space-between

  .main > .header
    margin-top: -1rem
    +center()

  .tools
    +chain(.5rem)
    transition: opacity .2s
    justify-content: flex-end

    .confirm
      +chain(1rem)
      align-items: center

  .move-here
    +center()
    margin-bottom: 2rem
    width: 100%

  .move-last
    display: block
    width: 100%
    margin-top: 2rem
    flex-shrink: 0

  .array-item
    position: relative
    // background-color: $color-gray--gradient
    // border-radius: $radius

  .items
    +gap(.5rem)
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
        border-top-left-radius: $radius
        border-top-right-radius: $radius

        &::after
          border-top-left-radius: $radius

      &:last-of-type
        border-bottom-left-radius: $radius
        border-bottom-right-radius: $radius

        &::after
          border-bottom-left-radius: $radius

        & > :last-child
          border-bottom-left-radius: $radius
          border-bottom-right-radius: $radius

  &.-moving

    .header
      opacity: 0
      pointer-events: none

    .tools
      display: none

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
          top: -1rem
          bottom: -1rem
          left: -.75rem
          right: -.75rem
          border: 3px dashed $color-primary
          border-radius: $radius

        .item
          opacity: 1

  .no-items
    margin-top: 1rem
    color: $color-gray
    font-size: .9rem
    font-style: italic
    text-align: center

</style>
