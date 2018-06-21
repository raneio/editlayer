<script>
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'Projects',

  computed: {

    projects () {
      return this.$store.getters.projects
    },

  },

  methods: {

    selectProject (project) {
      this.$router.push({name: 'Content', params: {projectId: project.id}})
    },

    usersCount (project, role) {
      return _.filter(project.users, {role: role}).length
    },

    usersText (project, role, singular, plural) {
      let count = this.usersCount(project, role)
      return count > 1 ? `${count} ${plural}` : `${count} ${singular}`
    },

    publishedAgo (project) {
      let seconds = _.get(project, 'published.publishedAt.seconds')
      let published = moment.unix(seconds).fromNow()
      return seconds ? `Published ${published}` : 'Never published'
    },

  },

}
</script>

<template>
<section class="projects">
  <div class="project" v-for="project in projects" :key="project.id">

    <card-core link @click.native="selectProject(project, $event)">
      <header class="header">
        <h2 v-text="project.name"></h2>
        <div class="draft" v-if="project.status === 'draft'">draft</div>
      </header>

      <main class="main">

        <div class="line">
          <icon name="regular/user"/>
          <span class="text">
            <span v-if="usersCount(project, 'admin')" :class="{'my-role': project.role === 'admin'}">
              {{usersText(project, 'admin', 'Admin', 'Admins')}}
            </span>

            <span v-if="usersCount(project, 'admin') && usersCount(project, 'editor')">, </span>

            <span v-if="usersCount(project, 'editor')" :class="{'my-role': project.role === 'editor'}">
              {{usersText(project, 'editor', 'Editor', 'Editors')}}
            </span>
          </span>
        </div>

        <div class="line">
          <icon name="regular/clock"/>
          <span class="text" v-text="publishedAgo(project)"></span>
        </div>

      </main>
    </card-core>

  </div>
</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../core/sass/mixins'

.projects
  +grid(1, 2rem)

  +breakpoint('small')
    +grid(2)

  +breakpoint('medium')
    +grid(3)

  +breakpoint('large')
    +grid(4)

  +breakpoint('huge')
    +grid(5)

  .main
    +gap(.5rem)
    font-size: .9rem

  .line
    +chain(.75rem)

    .text
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

    .fa-icon
      height: 1.2rem
      fill: $color-gray--dark

  .my-role
    font-weight: 600

  .draft
    color: $color-warning

</style>
