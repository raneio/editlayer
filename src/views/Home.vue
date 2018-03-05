<script>
import anime from 'animejs'

export default {
  name: 'home',
}
</script>


<template>
<section class="home">

  <div class="content animated fadeIn">

    <div>
      <h1 class="heading -logo">Editlayer</h1>
      <div class="subheading">Edit Content in JSON File</div>
    </div>

    <!-- <div class="call-to-action"><router-link class="button" :to="{ name: 'edit', params: {} }">Try alpha v1</router-link></div> -->

    <form class="subscribe" action="https://www.getrevue.co/profile/editlayer/add_subscriber" method="post" target="_blank">
        <input class="email" placeholder="Your email address..." type="email" name="member[email]">
        <input class="button" type="submit" value="Ask invite" name="member[subscribe]" id="member_submit">
    </form>

    <div class="version">
      Current Version: <strong>Alpha 2</strong>
    </div>

  </div>

</section>
</template>


<style lang="sass" scoped>
// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.home
  display: flex
  justify-content: center
  align-items: center
  height: 100vh
  text-align: center

.content
  +margin-to-childs()
  padding-bottom: 5rem

.heading.-logo
  line-height: 1em
  font-size: 3rem

.subheading
  font-style: italic

.call-to-action

.subscribe
  +chain()

  .email
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    width: 20rem

  .button
    border-top-left-radius: 0
    border-bottom-left-radius: 0

.version
  color: $color-disabled
  font-size: .8rem


</style>
