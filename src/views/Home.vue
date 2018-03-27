<script>
// import anime from 'animejs'

export default {
  name: 'home',
}
</script>


<template>
<section class="home">

  <header class="header">
    <div class="header-bottom">
      <img src="../assets/home/header-bottom.svg" alt="">
    </div>

    <!-- <div class="wave -blue"></div> -->
    <!-- <div class="waves -blue">
      <img class="wave" src="../assets/home/wave-blue.png" alt="">
      <img class="wave" src="../assets/home/wave-blue.png" alt="">
    </div>

    <div class="waves -white">
      <img class="wave" src="../assets/home/wave-white.png" alt="">
      <img class="wave" src="../assets/home/wave-white.png" alt="">
    </div> -->

    <nav class="top-nav">

      <div class="logo">
        <img class="image" src="../assets/home/logo.svg" alt="">
        <div>Editlayer</div>
      </div>

      <div class="spacer"></div>

      <!-- <a href="#" class="link">Use Cases</a>
      <a href="#" class="link">Features</a>
      <a href="#" class="link">How To</a>
      <a href="#" class="link">Pricing</a>
      <a href="#" class="link">
        <button class="button">Login</button>
      </a> -->
      <a href="mailto:editlayer@gmail.com" class="link">editlayer@gmail.com</a>

    </nav>

    <div class="content">

      <div class="text-area">
        <h1 class="heading">Edit content<br> with a simple UI</h1>
        <div class="subheading">
          Use any kind of JSON data structure
        </div>
        <!-- <button class="button">Start for Free</button> -->
      </div>

      <div class="video-area">
        <a class="video" href="https://www.youtube.com/watch?v=qeML3xBUDPc" target="editlayerVideo">
          <div class="play">
            <img src="../assets/home/icon-play.svg" alt="" class="icon">
          </div>
          <img src="../assets/home/video-placeholder.jpg" alt="">
        </a>
      </div>

    </div>
  </header>

  <div class="content">

    <div class="text">
      <h1 class="heading -logo">We are now in version Alpha 9</h1>

      <p>Editlayer is not yet ready for the public. If you want to test it, request an invitation to your email. All functions are not complete yet, but most work just fine.</p>
      <p>It is not a good idea to start the production work with Alpha phase because things may still be altered. I may still need to remove the projects that you have started.</p>
      <p>I would be really grateful for all bug reports and suggestions for improvement.</p>
      <p class="sign">- <a href="https://twitter.com/raneio">Rane Ahonen</a>, Founder</p>
    </div>

    <div class="image">
      <img src="../assets/home/rocket.png" alt="">
    </div>

  </div>

  <div class="subscribe">
    <form class="subscribe-form" action="https://tinyletter.com/editlayer" method="post" target="_blank">
      <input class="email" type="text" name="email" placeholder="Your email address">
      <input type="hidden" value="1" name="embed">
      <input class="button" type="submit" value="Ask Invite">
    </form>
  </div>

</section>
</template>


<style lang="sass" scoped>
@import '../sass/features'

.home

  > .header
    +invert-colors()
    background-color: mix($color-link, $color-active, 50%)
    // background-image: url('../assets/home/header-background.jpg')
    background-size: cover
    background-image: linear-gradient(90deg, #4F43AD 0%, #796DE3 100%)
    position: relative
    display: flex
    flex-direction: column
    text-shadow: 0 0 10em mix(transparent, $color-content, 95%), 0 .1em .1em mix(transparent, $color-content, 90%)

    .top-nav
      +container('default', 0)
      align-items: center
      padding-top: 1rem
      padding-bottom: 1rem
      text-align: center

      +for-tablet-landscape
        +chain(1.5rem)
        padding-bottom: 3rem

      .logo
        text-transform: uppercase
        font-size: 1.5rem
        font-weight: 900
        letter-spacing: -.05em
        +chain(1rem)
        display: inline-flex
        align-items: center

        .image
          width: 2.5rem

      .spacer
        flex-grow: 1
        height: .5rem

      .link
        text-transform: uppercase
        font-weight: 600
        display: none

        +for-tablet-landscape
          display: block

    .content
      flex-grow: 1
      +container('default', 0)
      position: relative

      +for-tablet-landscape
        +chain()

      .text-area
        text-align: center
        align-self: center
        padding-top: 2rem
        +margin-to-childs()

        +for-tablet-landscape
          text-align: left
          padding-top: 5rem
          padding-bottom: 9rem
          width: 50%

        .heading
          font-size: 4rem
          // font-style: italic
          font-weight: 900
          letter-spacing: -.075em
          line-height: 1
          // text-transform: uppercase
          // background: linear-gradient(to right, $color-active 0%, $color-link 100%)
          // -webkit-background-clip: text
          // -webkit-text-fill-color: transparent

        .subheading
          font-size: 1.5rem
          margin-bottom: 1rem
          line-height: 1
          font-style: italic
          color: #BEBDEF

      .video-area
        margin-top: 2rem
        text-align: center

        .video
          display: inline-block
          transform: rotateY(-5deg)
          border-top: 1rem solid $color-background--invert
          border-bottom: 1rem solid $color-background--invert
          border-radius: $button-border-radius
          box-shadow: 0 .2rem 2rem mix(transparent, $color-background--invert, 50%)
          transition: transform .2s
          background-color: $color-background
          max-width: 20rem

        .play
          height: 8rem
          width: 8rem
          border-radius: 50%
          background-color: mix(transparent, $color-link, 50%)
          position: absolute
          top: 50%
          left: 52.5%
          transform: translate(-50%, -50%)
          box-shadow: 0 5px 12px 0 mix(transparent, $color-content, 90%), 0 2px 5px 0 mix(transparent, black, 93%)
          transition: transform .2s, background-color .2s

          .icon
            position: absolute
            top: 50%
            left: 52.5%
            transform: translate(-50%, -50%)

        +for-tablet-landscape
          align-self: flex-end
          perspective: 40rem
          position: relative
          cursor: not-allowed
          margin-bottom: -1rem
          width: 50%

          .video
            transform: rotateY(-20deg)
            max-width: none

          &:hover

            .video
              transform: rotateY(-5deg)

            .play
              transform: translate(-50%, -50%) scale(1.05)
              background-color: mix(transparent, $color-link, 10%)

    .waves
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      overflow: hidden
      +chain()
      align-items: flex-end

      .wave
        width: 100%

      &.-white .wave
          height: 2.5rem
          animation: wave 27s linear infinite

      &.-blue .wave
          height: 3.5rem
          animation: wave 13s linear infinite

    @keyframes wave
      0%
        transform: translateX(0)
      100%
        transform: translateX(-100%)

    .header-bottom
      position: absolute
      bottom: -2px
      left: 0
      right: 0
      overflow: hidden
      display: flex
      align-items: flex-end

      img
        margin-left: -1rem
        width: calc(100% + 2rem)
        max-width: none

  > .content
    +container()
    align-items: center

    +for-tablet-portrait
      +chain(2rem)

    .text
      flex-grow: 1
      +margin-to-childs(1rem)

      .sign
        font-style: italic
        color: $color-disabled

    .image
      min-width: 40%
      text-align: center



  .subscribe
    +container('default', 0, 6rem)

    .subscribe-form
      +chain()
      justify-content: center
      background-color: $color-light
      border-radius: $button-border-radius
      padding: 2rem
      border: 1px solid $color-hr

      .email
        border-top-right-radius: 0
        border-bottom-right-radius: 0
        width: 20rem
        font-size: .9rem

      .button
        border-top-left-radius: 0
        border-bottom-left-radius: 0



</style>
