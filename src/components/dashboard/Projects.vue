<script>
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'Projects',

  computed: {

    projects () {
      return _.chain(this.$store.getters.projects)
        .map((file) => {
          let roleEditors = 0
          let roleAdmins = 0
          let myRole = null
          let publishedAgo = 'Never published'

          _.each(file.roles, (role, userId) => {
            if (role.role === 'editor') {
              roleEditors++
            }
            else if (role.role === 'admin') {
              roleAdmins++
            }

            if (userId === this.$store.state.user.id) {
              myRole = role.role
            }
          })

          if (_.has(file, 'published.publishedAt.seconds')) {
            publishedAgo = `Published ${moment.unix(file.published.publishedAt.seconds).fromNow()}`
          }

          return {
            name: file.name,
            projectId: file.projectId,
            status: (file.published && _.isEqual(file.draft, file.published.draft) && file.structure === file.published.structure) ? 'published' : 'draft',
            users: {
              editors: roleEditors,
              admins: roleAdmins,
            },
            role: myRole,
            publishedAgo: publishedAgo,
          }
        })
        .orderBy('name')
        .value()
    },

  },

  methods: {

    newProject () {
      let name = prompt('Name', 'Project')

      if (name !== null && name !== '') {
        this.$store.dispatch('newProject', {
          name: name,
        })
      }
    },

    selectProject (project) {
      this.$router.push({name: 'Content', params: {projectId: project.projectId}})
      // if (event.target.tagName !== 'A') {
      //   this.$router.push({name: 'Content', params: {projectId: project.projectId}})
      // }
    },

  },

}
</script>

<template>
<section class="projects">

  <div class="project-grid">

    <div class="project" v-for="project in projects" :key="project.projectId">

      <div class="card -link" @click="selectProject(project, $event)">

        <header class="header">
          <h2 class="heading" v-text="project.name"></h2>
          <div class="spacer"/>
          <div class="status">
            <!-- <icon name="check" class="published" v-if="project.status === 'published'"/> -->
            <div class="draft" v-if="project.status === 'draft'">
              draft
            </div>
          </div>
          <div class="select">
            <icon name="chevron-right"/>
          </div>
        </header>

        <section class="content">

          <div class="info">
            <icon name="regular/user"/>
            <div>
              <span v-if="project.users.admins > 0" :class="{'my-role': project.role === 'admin'}">
                {{project.users.admins}} admin<span v-if="project.users.admins > 1">s</span>
              </span>
              <span v-if="project.users.admins > 0 && project.users.editors > 0">, </span>
              <span v-if="project.users.editors > 0" :class="{'my-role': project.role === 'editor'}">
                {{project.users.editors}} editor<span v-if="project.users.editors > 1">s</span>
              </span>
            </div>
          </div>

          <div class="info">
            <icon name="regular/clock"/>
            <div v-text="project.publishedAgo"/>
          </div>

        </section>
      </div>

    </div>

    <div class="project -new">
      <button class="button -success" @click="newProject()">
        + New Project
      </button>
    </div>

  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/mixins/all'

.project-grid
  +grid(1, 2rem)

  +breakpoint('small')
    +grid(2)

  +breakpoint('medium')
    +grid(3)

  +breakpoint('large')
    +grid(4)

  +breakpoint('extra-large')
    +grid(5)

.project
  display: flex
  align-items: stretch

  > .card,
  > .button
    width: 100%

.card

  .content
    +gap(.25rem)
    padding: 1rem 1.25rem

  .info
    +chain(.5rem)

  .fa-icon
    height: 1rem
    fill: $color-gray

  .select
    width: 0
    opacity: 0
    overflow: hidden
    transition: width .2s, opacity .2s

  &:hover

    .select
      +center()
      width: 2rem
      opacity: 1

.my-role
  font-weight: 600

.project.-new .button
  font-size: 1.4rem
  padding-top: 2rem
  padding-bottom: 2rem

.status
  +center()

  .published
    width: 1.5rem
    fill: $color-success

  .draft
    color: $color-warning

</style>
