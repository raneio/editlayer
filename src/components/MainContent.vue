<script>
import _ from 'lodash'
import Editors from '@/components/Editors'
import Breadcrumb from '@/components/Breadcrumb'
import Schema from '@/components/Schema'


export default {
  name: 'MainContent',

  components: {
    Editors,
    Breadcrumb,
    Schema,
  },

}
</script>


<template>
<main class="main-content">
  <Breadcrumb/>
  <Editors v-if="$route.name === 'edit' || $route.name === 'users'"/>
  <Schema v-if="$route.name === 'schema' && $route.params.projectId"/>
</main>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.main-content
  overflow-y: auto
  padding: .25rem 2.5rem 2.5rem

</style>
