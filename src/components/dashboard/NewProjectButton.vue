<script>
export default {
  name: 'NewProjectButton',

  methods: {

    newProject () {
      let name = prompt('Name', 'Project')

      if (name !== null && name !== '') {
        this.$store.dispatch('newProject', {
          name: name,
        })
      }
    },

  },

}
</script>

<template>
  <button class="button -success -large" @click="newProject()">
    <icon name="plus"/>
    <span>New Project</span>
  </button>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'
</style>
