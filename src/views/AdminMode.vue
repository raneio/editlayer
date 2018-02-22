<script>
import _ from 'lodash'
import CodeMirror from 'codemirror'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import UserInfo from '@/components/UserInfo'

export default {
  name: 'AdminMode',

  components: {
    codemirror,
    UserInfo,
  },

  data () {
    return {
      schema: '',
    }
  },

  computed: {

    files () {
      return _.chain(this.$store.state.files).map((value, key) => {
        value.fileId = key
        return value
      }).orderBy(['filename']).value()
    },

    activeFileId () {
      return this.$route.params.id
    },

    activeFile () {
      return _.find(this.files, {fileId: this.activeFileId})
    },

    downloadUrl () {
      return `https://storage.googleapis.com/editlayerapp.appspot.com/files/${this.activeFileId}/${this.activeFile.filename}`
      // let filePath = encodeURIComponent('files/' + this.activeFileId + '/' + this.activeFile.filename)
      // return `https://firebasestorage.googleapis.com/v0/b/editlayerapp.appspot.com/o/${filePath}?alt=media&token=${this.activeFile.downloadToken}`
    },

    tab () {
      return this.$route.params.tab
    },

    heading () {
      let heading = ''

      if (this.tab === 'schema' && _.has(this.activeFile, 'filename')) {
        heading = this.activeFile.filename
      } else if (this.tab === 'users') {
        heading = 'Users'
      } else if (this.tab === 'url') {
        heading = 'Json URL'
      }

      return heading
    },

  },

  watch: {

    'activeFile.schema' (value) {
      this.setSchema()
    },

    schema: _.debounce(function () {
      this.saveSchema()
    }, 1000)

  },

  methods: {

    newFile () {
      let filename = prompt('Filename', '');

      if (filename != null && filename != '') {
          this.$store.dispatch('newFile', filename)
      }
    },

    selectFile (fileId) {
      this.$router.push({ name: 'admin', params: { id: fileId, tab: 'schema' }})
    },

    switchMode () {
      if (this.activeFileId) {
        this.$router.push({ name: 'edit', params: { id: this.activeFileId }})
      } else {
        this.$router.push({ name: 'edit' })
      }
    },

    saveSchema () {
      this.$store.dispatch('saveSchema', {
        fileId: this.activeFileId,
        schema: this.schema,
      })
    },

    setSchema () {
      if (_.has(this.activeFile, 'schema')) {
        this.schema = this.activeFile.schema
      }
    }

  },

  created () {
    this.setSchema()
  },

}
</script>


<template>
<section class="layout -admin-mode">

  <nav class="side-nav">
    <header class="header">
      <div class="item" @click="newFile()">
        <div class="content">
          <img src="../../public/icon-file.svg" alt="">
          <div>New File</div>
        </div>
      </div>
    </header>

    <footer class="footer">
      <div class="item" @click.prevent="logout()">
        <div class="content">
          <img src="../../public/icon-account.svg" alt="">
        </div>
      </div>
      <div class="item -primary" @click="switchMode()">
        <div class="content">
          Switch Mode
        </div>
      </div>
    </footer>
  </nav>

  <aside class="side-panel">

    <!-- <header class="header">

      <div class="title">
        Admin Mode
      </div>

      <button
        type="button"
        name="button"
        class="button -secondary"
        @click="newFile()"
      >
        New File
      </button>

    </header> -->

    <section class="content">

      <section class="items">

        <div
          class="button item"
          :class="{ '-active': activeFileId === file.fileId }"
          v-for="file in files"
          @click="selectFile(file.fileId)"
          v-text="file.filename"
        />

      </section>

    </section>

    <!-- <footer class="footer">
      <UserInfo/>

      <div class="button -primary -outline" @click="switchMode()">
        Switch to Edit Mode
      </div>
    </footer> -->

  </aside>

  <main class="main-content">

    <header class="header">

      <div>
        <h1 class="heading">
          {{ heading }}
        </h1>
        <!-- <div class="description">
          Some short descrption or note here
        </div> -->
      </div>

      <nav class="nav">

        <div class="item" :class="{ '-active': tab === 'schema'}">
          <router-link :to="{ name: 'admin', params: { id: activeFileId, tab: 'schema' } }">Schema</router-link>
        </div>

        <div class="item" :class="{ '-active': tab === 'users'}">
          <router-link :to="{ name: 'admin', params: { id: activeFileId, tab: 'users' } }">Users</router-link>
        </div>

        <div class="item" :class="{ '-active': tab === 'url'}">
          <router-link :to="{ name: 'admin', params: { id: activeFileId, tab: 'url' } }">Json URL</router-link>
        </div>

      </nav>

    </header>

    <codemirror
      v-if="tab === 'schema'"
      v-model="schema"
      :options="{
        tabSize: 2,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
      }"
    />

    <div v-if="tab === 'url'">
      <a :href="downloadUrl" target="_blank">
        {{ downloadUrl }}
      </a>
    </div>

  </main>

</section>
</template>


<style lang="sass" scoped>

// You can use variables, mixins and functions of Page Core
@import '../sass/features'

.layout.-admin-mode

  .side-nav
    background-color: $color-secondary

  .side-panel .content .item::before
    background-color: $color-secondary

  .main-content .header .item.-active::after
    background-color: $color-secondary

</style>
