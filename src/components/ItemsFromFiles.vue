<script>
import _ from 'lodash'
import Item from '@/components/Item'

export default {
  name: 'ItemsFromFiles',

  components: {
    Item,
  },

  computed: {

    files () {
      return this.$store.getters.files
    },

    items () {
      return _.map(this.files, (value) => {
        return {
          NAME: value.filename,
          FILE_ID: value.fileId,
          TYPE: 'file',
          OBJECT: true,
        }
      })
    },

  },

  methods: {

    selectItem (value) {
      this.$router.push({ name: 'edit', params: { id: value.FILE_ID }})
    },

  },

}
</script>


<template>
<section class="items">

  <Item
    v-for="item in items"
    :item="item"
    :selectItem="selectItem"
    :key="item.path"
  />

</section>
</template>
