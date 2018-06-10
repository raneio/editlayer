<script>
import _ from 'lodash'
import firebase from '@/firebase'
import Item from '@/components/panel/Item'
import BackButton from '@/components/navigate/BackButton'

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

    structure () {
      return this.$store.getters.structure
    },

    activeStructure () {
      let path = _.replace(this.$route.params.path, />/g, '.')
      let parentPath = _.chain(path).split('.').dropRight().dropRight().join('.').value()
      let activeItem = _.get(this.structure, path)
      if (_.get(activeItem, 'TYPE') === 'array') {
        return activeItem
      }
      else {
        return _.get(this.structure, parentPath)
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

      _.each(this.activeStructure, (value, key) => {
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

    activeStructure (value) {
      this.findFirstItem()
    },

  },

  methods: {

    newItem () {
      let itemPath = _.replace(this.$route.params.path, />/g, '.')

      if (itemPath !== this.activeStructure.PATH && _.includes(itemPath, '.-')) {
        itemPath = _.chain(itemPath).split('.-').slice(0, -1).join('.-').value()
      }

      let randomKey = `-${Math.random().toString(36).slice(-4)}`
      let path = `draft.${itemPath}`
      let newPath = `${path}.${randomKey}`
      let order = 0

      if (_.has(this.projects[this.projectId], newPath)) {
        this.newItem()
        return false
      }

      _.each(this.arrayItems, (item, key) => {
        if (order >= item.ORDER) {
          order = item.ORDER - 1
        }
      })

      let updateData = {}
      updateData[newPath] = {
        ORDER: order,
      }

      firebase.firestore
        .collection('projects')
        .doc(this.projectId)
        .update(updateData)
        .then(() => {
          console.log('New item added!')
          let pathUrl = _.replace(`${itemPath}.${randomKey}`, /\./g, '>')
          this.$router.push({name: 'Content', params: {projectId: this.projectId, path: pathUrl}})
        })
        .catch((error) => console.error('Error new item:', error))
    },

    findFirstItem () {
      let path = _.replace(this.$route.params.path, />/g, '.')

      if (path !== this.activeStructure.PATH) return false
      if (this.$route.name !== 'Content') return false
      if (this.$store.getters.isMobile) return false

      let firstItem = _.find(this.arrayItems[0], { TYPE: 'value' })

      if (firstItem && this.activeStructure.TYPE === 'array') {
        let firstItemPath = _.replace(firstItem.PATH, /\./g, '>')
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
        path: arrayItem.PATH,
      }
    },

    moveHere (arrayItem, arrayIdx) {
      arrayIdx = _.toNumber(arrayIdx)
      let newOrder = null

      if (arrayItem === 'first') {
        newOrder = this.arrayItems[0].ORDER - 1
      }
      else if (arrayItem === 'last') {
        newOrder = this.arrayItems[this.arrayItems.length - 1].ORDER + 1
      }
      else if (arrayIdx === 0) {
        newOrder = arrayItem.ORDER - 1
      }
      else {
        newOrder = (this.arrayItems[arrayIdx - 1].ORDER + arrayItem.ORDER) / 2
      }

      this.$store.dispatch('updateContent', {
        projectId: this.projectId,
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

    deleteArrayItem (arrayIdx) {
      this.confirmDeleteIdx = arrayIdx
    },

    confirmDeleteYes (arrayItem, arrayIdx) {
      let updateData = {}
      updateData[`draft.${arrayItem.PATH}`] = firebase.firestoreDelete

      let redirectIdx = (arrayIdx > 0) ? arrayIdx - 1 : 1
      let redirectPath = _.get(this.arrayItems, `${redirectIdx}.PATH`)
      let parentPath = _.chain(this.$route.params.path).split('>').slice(0, -1).join('.').value()

      if (redirectPath && arrayItem.PATH === parentPath) {
        this.$router.replace({name: this.$route.name, params: {projectId: this.projectId, path: redirectPath}})
      }

      firebase.firestore
        .collection('projects')
        .doc(this.projectId)
        .update(updateData)
        .then(() => {
          console.log('Item successfully deleted!')
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
<section class="items -array" :class="{ '-moving': movingArrayItem.path !== null}">

  <header class="header">
    <BackButton/>
    <button class="button -link -success" @click="newItem()">
      <icon name="plus"/>
      <span>New Item</span>
    </button>
  </header>

  <div class="no-items" v-if="arrayItems.length === 0">
    <div>No items - add first item</div>
  </div>

  <div
    class="array-item"
    v-for="(arrayItem, arrayIdx) in arrayItems"
    :key="arrayIdx"
  >

    <button
      class="move-here button -primary"
      v-if="movingArrayItem.path !== null && movingArrayItem.path !== arrayItem.PATH && movingArrayItem.idx !== arrayIdx - 1"
      @click="moveHere(arrayItem, arrayIdx)"
    >
      Move Here
    </button>

    <div class="tools">
      <button @click="moveArrayItem(arrayItem, arrayIdx)" v-if="confirmDeleteIdx !== arrayIdx" class="button -link">Move</button>
      <button @click="deleteArrayItem(arrayIdx)" v-if="confirmDeleteIdx !== arrayIdx" class="button -link -danger">Delete</button>

      <div class="confirm" v-if="confirmDeleteIdx === arrayIdx">
        <div>Are you sure?</div>
        <button @click="confirmDeleteYes(arrayItem, arrayIdx)" class="button -link -danger">Yes</button>
        <button @click="confirmDeleteNo()" class="button -link">No</button>
      </div>
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
@import '../../sass/variables'
@import '../../sass/mixins/all'

.items.-array

  > .header
    +chain()
    justify-content: space-between

  .tools
    +chain(.5rem)
    justify-content: flex-end
    transition: opacity .2s
    font-size: .8rem
    margin-bottom: .25rem

    .confirm
      +chain(1rem)
      align-items: center

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
    padding-top: .5rem
    position: relative

    & + .array-item
      border-top: 1px solid mix($color-white, $color-black, 90%)
      margin-top: 2rem

  .items
    +gap(.6rem)
    position: relative
    transition: transform .2s

    .item
      font-size: 1rem
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
          border: 3px dashed $color-brand
          border-radius: $button-border-radius

        .item
          opacity: 1

  .no-items
    margin-top: 1rem
    color: $color-gray
    font-size: .9rem
    font-style: italic
    text-align: center

.items.-array /deep/

  .item .preview.-image .image
    border-radius: 0

  .item:last-of-type .preview.-image .image
    border-bottom-left-radius: $button-border-radius
    border-bottom-right-radius: $button-border-radius

</style>
