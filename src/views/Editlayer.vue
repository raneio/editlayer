<script>
import _ from 'lodash'
import Auth from '@/views/Auth'
import Navigation from '@/components/Navigation'
import SidePanel from '@/components/SidePanel'
import MainContent from '@/components/MainContent'
import Settings from '@/components/Settings'
import UploadNotifications from '@/components/UploadNotifications'


export default {
  name: 'Editlayer',

  components: {
    Auth,
    Navigation,
    SidePanel,
    MainContent,
    Settings,
    UploadNotifications,
  },

}
</script>


<template>
<section>

  <Auth v-if="$store.state.user.isLoggedIn === false"/>

  <section v-if="$store.state.user.isLoggedIn === true" class="layout">
    <Navigation/>
    <SidePanel v-if="$route.name === 'edit' || $route.name === 'schema'"/>
    <MainContent v-if="$route.name === 'edit' || $route.name === 'schema'"/>
    <Settings v-if="$route.name === 'settings'"/>
    <UploadNotifications/>
  </section>

</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

</style>
