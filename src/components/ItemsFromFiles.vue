<script>
import _ from 'lodash'
import anime from 'animejs'
import Item from '@/components/Item'

export default {
  name: 'ItemsFromFiles',

  props: {
    selectItem: Function,
  },

  components: {
    Item,
  },

  computed: {

    files () {
      return this.$store.getters.files
    },

    items () {
      return _.map(this.files, (file) => {
        return {
          NAME: file.name,
          FILE_ID: file.fileId,
          TYPE: 'file',
          STATUS: (file.published && _.isEqual(file.draft, file.published.draft) && file.schema === file.published.schema) ? 'published' : 'draft',
        }
      })
    },

  },

  methods: {

    // selectItem (item) {
    //   this.$router.push({ name: this.$route.name, params: { id: item.FILE_ID }})
    // },

    newFile () {
      let name = prompt('Name', '');

      if (name != null && name != '') {
          this.$store.dispatch('newFile', {
            name: name,
          })
      }
    },

  },

}
</script>


<template>
<section class="items-from-files">

  <header class='header'>
    <a href="/">
      <h1 class="heading -logo">Editlayer</h1>
    </a>

    <button class="button -link -new" @click="newFile()">
      + New File
    </button>
  </header>

  <div class="no-items" v-if="files !== null && files.length === 0">
    <div>No files - create first file</div>
  </div>

  <div class="no-items" v-if="files === null">
    <div>Loading files...</div>
  </div>

  <div class="items">

    <Item
      v-for="item in items"
      :item="item"
      :selectItem="selectItem"
      :key="item.path"
    />

  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.items-from-files
  +margin-to-childs(2rem)

.tools
  +chain(.5rem)
  justify-content: flex-end
  transition: opacity .2s
  font-size: .8rem

.no-items
  margin-top: 1rem
  color: $color-disabled
  font-size: .9rem
  font-style: italic
  text-align: center

</style>
