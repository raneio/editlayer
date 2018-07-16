<script>
import _ from 'lodash'
import firebase from '@/utils/firebase'

export default {
  name: 'Auth',

  data () {
    return {
      state: this.$route.name === 'Register' ? 'register' : 'login',
      email: '',
      password: '',
      error: null,
      progress: false,
    }
  },

  watch: {

    email () {
      this.error = null
    },

    password () {
      this.error = null
    },

  },

  methods: {

    submit () {
      this.error = null
      this.progress = true

      if (this.state === 'login') {
        this.login()
      }
      else if (this.state === 'register') {
        this.register()
      }
      else if (this.state === 'forget') {
        this.resetPassword()
      }
    },

    login () {
      firebase.auth.signInWithEmailAndPassword(this.email, this.password)
        // .then(user => console.log('Logged in', user.email))
        .catch((error) => {
          console.error('Logged in faild', error)
          this.progress = false

          this.$store.commit('setNotification', {
            mode: 'danger',
            message: error.message,
          })

          if (_.includes(['auth/invalid-email', 'auth/user-not-found'], error.code)) {
            this.error = 'email'
          }
          else if (_.includes(['auth/wrong-password'], error.code)) {
            this.error = 'password'
          }
        })
    },

    register () {
      firebase.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          firebase.firestore.collection('users').doc(user.uid).set({
            email: user.email,
          })
            .then(() => {
              // console.log('Added user', user.email)

              this.$store.dispatch('newProject', {
                name: 'Simple Example',
                schema: {
                  title: 'text',
                  slogan: 'textarea',
                  description: 'richtext',
                  image: 'image',
                },
              })

              this.$store.dispatch('newProject', {
                name: 'Advanced Example',
                schema: {
                  simpleField: 'text',
                  anotherField: {
                    EDITOR: 'text',
                    TITLE: 'Advanced Field',
                    DEFAULT: 'Hello World!',
                    INFO: 'You can use TITLE, DEFAULT and INFO properties with an object notation.',
                  },
                  nestedExample: {
                    TITLE: 'Nested Fields Example',
                    title: 'text',
                    description: 'textarea',
                  },
                  arrayExample: [{
                    TITLE: 'Image Gallery Example',
                    image: 'image',
                    caption: 'text',
                  }],
                },
              })
            })
            .catch(error => {
              console.error('Adding user error', error)
              this.progress = false
            })
        })
        .catch(error => {
          console.error('register error', error)
          this.progress = false

          if (_.includes(['auth/invalid-email', 'auth/email-already-in-use'], error.code)) {
            this.error = 'email'
          }
          else if (_.includes(['auth/weak-password'], error.code)) {
            this.error = 'password'
          }
          else if (_.includes(['auth/operation-not-allowed'], error.code)) {
            alert(error.message)
          }
          else {
            alert('Unknown error! Try again later or contact us editlayer@gmail.com')
          }
        })
    },

    resetPassword () {
      firebase.auth.sendPasswordResetEmail(this.email).then(() => {
        this.changeState('login')
        this.progress = false
      }).catch((error) => {
        this.error = 'email'
        console.error('Reseting faild', error)
        this.progress = false
      })
    },

    changeState (state) {
      this.state = state
    },

  },

  created () {
    this.$store.dispatch('authState')
  },

}
</script>

<template>
<section class="auth" :class="{ '-progress': progress}">

  <div class="content">

    <form class="form" @submit.prevent="submit()">

      <h1 class="heading -logo">
        <span v-if="state === 'login'">
          Login to your account
        </span>

        <span v-if="state === 'register'">
          Register new account
        </span>

        <span v-if="state === 'forget'">
          Reset your password
        </span>
      </h1>

      <label class="field" :class="{'-error': error === 'email'}">
        <div>Email</div>
        <input class="input" type="email" v-model="email">
      </label>

      <label class="field" :class="{'-error': error === 'password'}" v-if="state !== 'forget'">
        <div>Password</div>
        <input class="input" type="password" v-model="password">
        <div v-if="state === 'login'" class="forget">
          Forget password? <a @click="changeState('forget')">Reset Password</a>
        </div>
      </label>

      <button-core mode="primary" :disabled="progress" type="submit">
        <span v-if="state === 'login'">Login</span>
        <span v-if="state === 'register'">Register</span>
        <span v-if="state === 'forget'">Send reset link</span>
      </button-core>

      <div v-if="state === 'forget'" class="forget">
        <a @click="changeState('login')">Back</a>
      </div>

    </form>

    <footer class="footer">

      <div v-if="state === 'login'">
        Don’t have an account? <a @click="changeState('register')">Register</a>
      </div>

      <div v-if="state === 'register'">
        You have already account? <a @click="changeState('login')">Login</a>
      </div>

    </footer>

  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../core/sass/mixins'

.auth
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  height: 100vh
  background-color: mix($color-white, $color-black, 90%)
  display: flex
  justify-content: center
  align-items: center
  width: 100%

  &.-progress
    cursor: progress

  .content
    +gap()
    text-align: center
    width: 30rem

  .form
    box-shadow: 0 5px 12px 0 mix(transparent, $color-black, 90%), 0 2px 5px 0 mix(transparent, black, 93%)
    background-color: $color-white
    padding: 3rem 4rem
    +gap()

  .field
    text-align: left
    font-weight: 600
    +gap(.25rem)

    &.-error
      color: $color-danger

      .input
        border-color: $color-danger

  .button
    min-width: 50%
    margin-top: 2rem

    &[disabled]
      cursor: progress

  .forget
    font-size: .8rem
    color: $color-gray
    font-weight: 400

  .footer
    font-weight: 600

</style>
