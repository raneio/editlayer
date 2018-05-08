<script>
import firebase from '@/firebase'
import Breadcrumb from '@/components/Breadcrumb'
import PublishButton from '@/components/PublishButton'

export default {
  name: 'Navigation',

  components: {
    Breadcrumb,
    PublishButton
  },

  computed: {

    activeProject () {
      return this.$store.getters.activeProject
    },

    activeRole () {
      return this.$store.getters.activeRole
    },

    jsonUrl () {
      return this.$store.getters.jsonUrl
    },

    jsonTarget () {
      if (!this.activeProject) return false
      return this.activeProject.projectId
    },

    neverPublished () {
      if (!this.activeProject) return false
      return this.activeProject.published === null
    }

  },

  methods: {

    // logout () {
    //   firebase.auth.signOut().then(() => {
    //     window.location.href = 'https://editlayer.com'
    //   }).catch((error) => {
    //     console.error('Logout failed', error)
    //   })
    // }

  }

}
</script>

<template>
<nav class="navigation">

  <template v-if="$route.params.projectId">

    <PublishButton  class="publish-button"/>

    <router-link
      v-if="$route.params.projectId"
      class="item"
      :class="{ '-active': $route.name === 'Content' }"
      :to="{ name: 'Content', params: { projectId: $route.params.projectId, path: $route.params.path }}"
    >
      <svg class="icon" width="30" height="27" viewBox="0 0 30 27" xmlns="http://www.w3.org/2000/svg"><path d="M21.227 16.246l1.015-1.016a.328.328 0 0 1 .33-.025c.119.05.178.144.178.28v8.327a2.35 2.35 0 0 1-.711 1.727 2.35 2.35 0 0 1-1.727.711H2.437a2.35 2.35 0 0 1-1.726-.71A2.35 2.35 0 0 1 0 23.811V5.938C0 5.26.237 4.685.71 4.21A2.35 2.35 0 0 1 2.438 3.5h14.829c.135 0 .228.06.279.178.05.118.025.228-.076.33l-.965 1.015a.344.344 0 0 1-.254.102H2.437a.79.79 0 0 0-.583.229.79.79 0 0 0-.229.584v17.874a.79.79 0 0 0 .229.584.79.79 0 0 0 .583.229h17.875a.79.79 0 0 0 .584-.229.79.79 0 0 0 .229-.584V16.5c0-.102.034-.186.102-.254zm7.414-9.7L12.746 22.442 7.668 23a1.02 1.02 0 0 1-.863-.305 1.02 1.02 0 0 1-.305-.863l.559-5.078L22.953.859C23.36.453 23.86.25 24.451.25c.593 0 1.092.203 1.498.61l2.692 2.69c.406.407.609.906.609 1.499 0 .592-.203 1.092-.61 1.498zm-4.774 2.49l-3.402-3.403L8.633 17.465l-.406 3.86 3.808-.458L23.867 9.035zm3.606-4.368l-2.641-2.64a.517.517 0 0 0-.38-.153c-.153 0-.28.05-.382.152l-2.437 2.438 3.402 3.402 2.438-2.437a.517.517 0 0 0 .152-.381c0-.152-.05-.28-.152-.381z" fill="#FFF" fill-rule="evenodd"/></svg>
      <div class="text">
        Content
      </div>
    </router-link>

    <router-link
      v-if="$route.params.projectId && activeRole === 'admin'"
      class="item"
      :class="{ '-active': $route.name === 'Structure' }"
      :to="{ name: 'Structure', params: { projectId: $route.params.projectId, path: $route.params.path }}"
    >
      <svg class="icon" height="24" viewBox="0 0 26 24" width="26" xmlns="http://www.w3.org/2000/svg"><path d="m3.948 15.356c0-1.574-1.125-2.36-3.377-2.36v-2.426c1.143 0 1.991-.192 2.546-.577.554-.385.831-.972.831-1.759v-3.948c0-1.32.46-2.291 1.378-2.913.918-.623 2.294-.934 4.132-.934v2.311c-.965.042-1.665.24-2.101.59-.436.352-.654.874-.654 1.568v3.77c0 1.685-.969 2.692-2.907 3.022v.153c1.938.304 2.907 1.307 2.907 3.008v3.796c0 .694.216 1.219.648 1.574.431.356 1.134.542 2.107.559v2.323c-1.955-.017-3.362-.349-4.221-.996-.86-.648-1.289-1.695-1.289-3.142zm18.726 3.898c0 1.32-.421 2.29-1.263 2.907-.842.618-2.19.935-4.044.952v-2.323c.804-.008 1.43-.171 1.88-.489.448-.317.672-.865.672-1.644v-3.326c0-1.024.224-1.815.673-2.374.448-.559 1.193-.927 2.234-1.104v-.153c-1.938-.33-2.907-1.337-2.907-3.021v-3.77c0-.695-.193-1.217-.578-1.569-.385-.35-1.043-.548-1.974-.59v-2.31c1.888 0 3.244.323 4.069.97.825.648 1.238 1.708 1.238 3.18v3.644c0 .847.269 1.448.806 1.803.537.356 1.335.533 2.393.533v2.425c-1.041 0-1.834.18-2.38.54s-.82.967-.82 1.821v3.898z" fill="#fff" fill-rule="evenodd"/></svg>
      <div class="text">
        Structure
      </div>
    </router-link>

    <router-link
      v-if="$route.params.projectId && activeRole === 'admin'"
      class="item"
      :class="{ '-active': $route.name === 'Settings' }"
      :to="{ name: 'Settings', params: { projectId: this.$route.params.projectId, path: this.$route.params.path }}"
    >
      <svg class="icon" width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M24.527 15.434c.237.135.407.338.508.609.102.27.119.542.05.812a12.426 12.426 0 0 1-2.944 5.028c-.204.203-.44.33-.711.38-.271.051-.525.01-.762-.126l-1.676-.965a8.304 8.304 0 0 1-2.133 1.219v1.93a1.186 1.186 0 0 1-.965 1.168c-1.93.473-3.859.473-5.789 0a1.186 1.186 0 0 1-.964-1.169v-1.93a8.304 8.304 0 0 1-2.133-1.218l-1.676.965c-.237.135-.49.177-.762.127a1.335 1.335 0 0 1-.71-.381 12.426 12.426 0 0 1-2.946-5.028 1.34 1.34 0 0 1 .05-.812c.102-.27.272-.474.509-.61l1.675-.964a9.788 9.788 0 0 1 0-2.438l-1.675-.965a1.135 1.135 0 0 1-.508-.609 1.34 1.34 0 0 1-.05-.812 12.426 12.426 0 0 1 2.944-5.028c.203-.203.44-.33.711-.38.271-.051.525-.01.762.126l1.676.965A8.304 8.304 0 0 1 9.14 4.11V2.18a1.186 1.186 0 0 1 .965-1.168c1.93-.473 3.859-.473 5.788 0a1.186 1.186 0 0 1 .965 1.169v1.93c.779.304 1.49.71 2.133 1.218l1.676-.965c.237-.135.49-.177.762-.127.27.051.507.178.71.381a12.426 12.426 0 0 1 2.946 5.028c.068.27.05.541-.05.812-.102.27-.272.474-.509.61l-1.675.964a9.788 9.788 0 0 1 0 2.438l1.675.965zm-3.351 5.129a11.08 11.08 0 0 0 2.234-3.86l-2.336-1.37c.17-.915.254-1.609.254-2.083 0-.474-.085-1.168-.254-2.082l2.336-1.371a11.08 11.08 0 0 0-2.234-3.86L18.84 7.31c-.711-.61-1.278-1.033-1.701-1.27-.424-.237-1.058-.508-1.905-.812V2.484a11.038 11.038 0 0 0-4.468 0v2.743c-.847.304-1.482.575-1.905.812-.423.237-.99.66-1.7 1.27L4.823 5.938A11.08 11.08 0 0 0 2.59 9.797l2.336 1.371c-.17.914-.254 1.608-.254 2.082 0 .474.084 1.168.254 2.082L2.59 16.703a11.08 11.08 0 0 0 2.234 3.86L7.16 19.19c.711.61 1.278 1.033 1.701 1.27.423.237 1.058.508 1.905.812v2.743c1.49.304 2.979.304 4.468 0v-2.743c.847-.304 1.481-.584 1.905-.837.423-.254.99-.67 1.7-1.245l2.337 1.372zM13 8.375c1.354 0 2.505.474 3.453 1.422s1.422 2.099 1.422 3.453c0 1.354-.474 2.505-1.422 3.453S14.354 18.125 13 18.125c-1.354 0-2.505-.474-3.453-1.422s-1.422-2.099-1.422-3.453c0-1.354.474-2.505 1.422-3.453S11.646 8.375 13 8.375zm0 8.125c.88 0 1.642-.322 2.285-.965.643-.643.965-1.405.965-2.285 0-.88-.322-1.642-.965-2.285C14.642 10.322 13.88 10 13 10c-.88 0-1.642.322-2.285.965-.643.643-.965 1.405-.965 2.285 0 .88.322 1.642.965 2.285.643.643 1.405.965 2.285.965z" fill="#FFF" fill-rule="evenodd"/></svg>
      <div class="text">
        Settings
      </div>
    </router-link>

    <div class="spacer"></div>

    <router-link
      class="item"
      :to="{ name: 'Dashboard' }"
    >
      <svg class="icon" height="24" viewBox="0 0 30 24" width="30" xmlns="http://www.w3.org/2000/svg"><path d="m4.469 22.406c0 .339.118.627.355.864s.525.355.863.355h5.891c.17 0 .313-.06.432-.178a.588.588 0 0 0 .177-.431v-5.688c0-.17.06-.313.178-.431a.588.588 0 0 1 .432-.178h3.656c.17 0 .313.059.432.178a.588.588 0 0 1 .177.431v5.688c0 .169.06.313.178.431a.588.588 0 0 0 .432.178h5.89c.339 0 .627-.118.864-.355s.355-.525.355-.864v-7.261a.689.689 0 0 0 -.203-.508l-9.547-7.82a.675.675 0 0 0 -.406-.153c-.135 0-.27.05-.406.152l-9.547 7.82a.689.689 0 0 0 -.203.509zm-4.266-10.36a.644.644 0 0 0 -.178.407.632.632 0 0 0 .127.457l1.27 1.574a.483.483 0 0 0 .406.204c.17 0 .322-.051.457-.153l11.934-9.8a.675.675 0 0 1 .406-.153c.135 0 .27.05.406.152l11.934 9.801a.743.743 0 0 0 .457.153c.17 0 .304-.068.406-.204l1.27-1.574a.632.632 0 0 0 .127-.457.644.644 0 0 0 -.178-.406l-12.899-10.613a2.29 2.29 0 0 0 -1.523-.559c-.576 0-1.1.186-1.574.559l-4.521 3.756v-3.706c0-.169-.059-.313-.178-.431a.588.588 0 0 0 -.431-.178h-2.843c-.17 0-.313.06-.432.178a.588.588 0 0 0 -.177.431v7.059l-4.266 3.504z" fill="#fff" fill-rule="evenodd"/></svg>
      <div class="text">
        Dashboard
      </div>
    </router-link>

  </template>

</nav>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.navigation
  +invert-colors()
  display: flex
  flex-direction: column
  background-color: $color-violet
  background-image: linear-gradient($color-violet, mix($color-violet, black, 80%))
  padding-bottom: .5rem
  overflow-y: auto

  &:hover

    .item .text
      transition: opacity 0s
      opacity: 1

.publish-button
  margin-bottom: 1rem

.spacer
  flex-grow: 1

.item
  +margin-to-childs(.2rem)
  display: flex
  flex-direction: column
  align-items: center
  transition: opacity .2s
  font-size: .65rem
  font-weight: 700
  opacity: .6
  padding-top: 1rem
  padding-bottom: 1rem

  &:hover
    opacity: 1

  &.-active
    filter: drop-shadow(0 0 10px mix($color-white, transparent, 60%))
    opacity: 1

    .text
      // opacity: 1

  .text
    transition: opacity 1s
    transition-delay: 1s
    opacity: 0



</style>
