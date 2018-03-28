<script>
import _ from 'lodash'
import anime from 'animejs'
import SideItem from '@/components/SideItem'

export default {
  name: 'SideItemsFromProjects',

  props: {
    selectItem: Function,
  },

  components: {
    SideItem,
  },

  computed: {

    projects () {
      return this.$store.getters.projects
    },

    items () {
      return _.map(this.projects, (file) => {
        return {
          NAME: file.name,
          FILE_ID: file.projectId,
          TYPE: 'file',
          STATUS: (file.published && _.isEqual(file.draft, file.published.draft) && file.structure === file.published.structure) ? 'published' : 'draft',
        }
      })
    },

  },

  methods: {

    newProject () {
      let name = prompt('Name', 'Project');

      if (name != null && name != '') {
        this.$store.dispatch('newProject', {
          name: name,
        })
      }
    },

  },

}
</script>


<template>
<section class="projects items">

  <header class='header'>
    <!-- <router-link :to="{ name: 'Editlayer.com'}">
      <h1 class="heading -logo">Editlayer</h1>
    </router-link> -->

    <div></div>

    <button class="button -link -new" @click="newProject()">
      + New Project
    </button>
  </header>

  <div class="no-items" v-if="projects !== null && projects.length === 0">
    <div>No projects - create first project</div>
  </div>

  <div class="no-items" v-if="projects === null">
    <div>Loading projects...</div>
  </div>

  <div class="items">

    <SideItem
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

.items-from-projects
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
