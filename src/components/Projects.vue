<script>
import _ from 'lodash'
// import SideItem from '@/components/SideItem'

export default {
  name: 'Projects',

  // components: {
  //   SideItem
  // },

  computed: {

    projects () {
      return _.chain(this.$store.getters.projects)
        .map((file) => {
          let roleEditors = 0
          let roleAdmins = 0
          let myRole = null

          _.each(file.roles, (role, userId) => {
            if (role.role === 'editor') {
              roleEditors++
            } else if (role.role === 'admin') {
              roleAdmins++
            }

            if (userId === this.$store.state.user.id) {
              myRole = role.role
            }
          })

          return {
            name: file.name,
            projectId: file.projectId,
            status: (file.published && _.isEqual(file.draft, file.published.draft) && file.structure === file.published.structure) ? 'published' : 'draft',
            users: {
              editors: roleEditors,
              admins: roleAdmins,
            },
            role: myRole,
            jsonUrl: `https://cdn.editlayer.com/${file.projectId}/${file.filename}.json`,
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

    selectProject (project, event) {
      if (event.target.tagName !== 'A') {
        this.$router.push({name: 'Content', params: {projectId: project.projectId}})
      }
    },

  },

}
</script>

<template>
<section class="projects">

  <div class="project-grid">

    <div class="project" v-for="project in projects" :key="project.projectId">

      <div class="button -versatile" @click="selectProject(project, $event)">
        <h2 class="heading">
          <div v-text="project.name"></div>
          <div class="icon">
            <svg v-if="project.status === 'published'" width="26" height="20" viewBox="0 0 26 20" xmlns="http://www.w3.org/2000/svg"><title>Published</title><path d="M23.45.836a.538.538 0 0 1 .452-.227c.19 0 .34.076.453.227l.68.623c.113.151.17.321.17.51s-.057.34-.17.453L8.043 19.414c-.151.151-.312.227-.481.227-.17 0-.33-.076-.482-.227l-6.74-6.74a.612.612 0 0 1-.17-.453c0-.19.057-.359.17-.51l.68-.623a.538.538 0 0 1 .453-.227c.188 0 .34.076.453.227l5.607 5.607L23.45.836z" fill="#3FB143" fill-rule="evenodd"/></svg>
            <svg v-if="project.status === 'draft'" width="37" height="26" viewBox="0 0 37 26" xmlns="http://www.w3.org/2000/svg"><title>Draft</title><path d="M15.406 2.25a7.872 7.872 0 0 0-4.078 1.105 8.312 8.312 0 0 0-2.974 2.973 7.872 7.872 0 0 0-1.104 4.078c0 .34.019.661.057.963-1.549.227-2.851.935-3.909 2.124-1.057 1.19-1.586 2.577-1.586 4.163 0 1.133.284 2.19.85 3.172a6.23 6.23 0 0 0 2.322 2.322c.982.567 2.04.85 3.172.85H29c1.51 0 2.794-.529 3.851-1.586 1.058-1.057 1.586-2.341 1.586-3.851 0-1.36-.434-2.54-1.302-3.54-.869-1.001-1.964-1.615-3.285-1.841.641-.793.962-1.718.962-2.776 0-1.246-.443-2.313-1.33-3.2-.888-.887-1.974-1.331-3.257-1.331-1.284 0-2.38.49-3.286 1.473-.604-1.51-1.586-2.738-2.945-3.682-1.36-.944-2.889-1.416-4.588-1.416zm0-1.812c1.662 0 3.21.377 4.645 1.132a9.629 9.629 0 0 1 3.511 3.116 6.228 6.228 0 0 1 2.72-.623c1.132 0 2.19.283 3.171.85a6.23 6.23 0 0 1 2.322 2.321c.567.982.85 2.04.85 3.172 0 .604-.076 1.19-.227 1.756a7.376 7.376 0 0 1 2.804 2.69 7.03 7.03 0 0 1 1.048 3.71c0 1.322-.321 2.54-.963 3.654a7.053 7.053 0 0 1-2.634 2.634 7.189 7.189 0 0 1-3.653.962H8.156a7.872 7.872 0 0 1-4.078-1.104 8.312 8.312 0 0 1-2.974-2.974A7.872 7.872 0 0 1 0 17.656c0-1.737.5-3.313 1.501-4.73 1-1.415 2.313-2.406 3.936-2.973A9.692 9.692 0 0 1 6.91 5.167a9.946 9.946 0 0 1 3.625-3.455A9.775 9.775 0 0 1 15.406.438zm2.719 19.257c0 .19-.066.35-.198.482a.655.655 0 0 1-.482.198h-.453a.655.655 0 0 1-.481-.198.655.655 0 0 1-.199-.482v-8.552l-3.851 3.851a.704.704 0 0 1-.51.227.538.538 0 0 1-.453-.227l-.34-.283a.828.828 0 0 1-.17-.51c0-.189.057-.34.17-.453l5.608-5.607a.612.612 0 0 1 .453-.17c.189 0 .34.056.453.17l5.607 5.607c.114.113.17.264.17.453a.828.828 0 0 1-.17.51l-.34.283a.538.538 0 0 1-.453.227.704.704 0 0 1-.51-.227l-3.851-3.851v8.552z" fill="#EABE00" fill-rule="evenodd"/></svg>
          </div>
        </h2>

        <div class="content">

          <div class="info">
            <svg class="icon" width="22" height="19" viewBox="0 0 22 19" xmlns="http://www.w3.org/2000/svg"><path d="M17.187.25c.141 0 .258.07.352.211l3.516 5.73c.117.164.105.329-.036.493l-9.703 11.425c-.07.094-.175.141-.316.141-.14 0-.246-.047-.316-.14L.98 6.683C.84 6.52.828 6.355.945 6.19L4.461.461c.094-.14.21-.211.351-.211h12.375zm-.492 1.266H14.41l1.969 4.359h2.918l-2.602-4.36zm-3.691 0H8.996L6.992 5.875h8.016l-2.004-4.36zm-7.7 0l-2.6 4.359H5.62l1.969-4.36H5.305zM3.02 7l5.449 6.75L5.586 7H3.02zm3.937 0L11 16.281 15.043 7H6.957zm6.574 6.75L18.981 7h-2.567l-2.883 6.75z" fill="#252525" fill-rule="evenodd"/></svg>
            <div>Alpha <span class="light">(plans coming later)</span></div>
          </div>

          <div class="info">
            <svg class="icon" width="14" height="19" viewBox="0 0 14 19" xmlns="http://www.w3.org/2000/svg"><path d="M13.258 3.695c.328.328.492.727.492 1.196v11.671c0 .47-.164.868-.492 1.196a1.627 1.627 0 0 1-1.196.492H1.937c-.468 0-.867-.164-1.195-.492a1.627 1.627 0 0 1-.492-1.195V1.938c0-.47.164-.868.492-1.196A1.627 1.627 0 0 1 1.937.25H9.11c.47 0 .868.164 1.196.492l2.953 2.953zm-.809.809L9.496 1.55a.938.938 0 0 0-.246-.176V4.75h3.375a.939.939 0 0 0-.176-.246zm-.387 12.621a.548.548 0 0 0 .405-.158.547.547 0 0 0 .158-.404V5.874H8.969a.814.814 0 0 1-.598-.246.814.814 0 0 1-.246-.598V1.375H1.937a.548.548 0 0 0-.404.158.547.547 0 0 0-.158.405v14.624c0 .165.053.3.158.405.106.105.24.158.404.158h10.125zm-5.94-2.707a.514.514 0 0 1-.317.105.38.38 0 0 1-.282-.105l-2.39-2.39a.38.38 0 0 1-.106-.282c0-.117.035-.223.106-.316l.316-.282a.334.334 0 0 1 .281-.14c.118 0 .223.047.317.14l1.758 1.758 4.148-4.113c.094-.07.2-.105.317-.105.117 0 .21.046.28.14l.317.281c.07.094.106.2.106.317a.38.38 0 0 1-.106.281l-4.746 4.711z" fill="#252525" fill-rule="evenodd"/></svg>
            <div><a :href="project.jsonUrl" :target="project.projectId">Open published file</a></div>
          </div>

          <div class="info">
            <svg class="icon" width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg"><path d="M15.152 11.254c.985.281 1.735.844 2.25 1.687.399.657.598 1.348.598 2.075V16c0 .61-.223 1.137-.668 1.582-.445.445-.973.668-1.582.668H2.25c-.61 0-1.137-.223-1.582-.668C.223 17.137 0 16.609 0 16v-.984c0-.727.2-1.43.598-2.11.515-.82 1.265-1.37 2.25-1.652l1.722-.492a6.046 6.046 0 0 1-1.476-2.496 6.187 6.187 0 0 1-.282-1.828 6.09 6.09 0 0 1 .827-3.112c.55-.949 1.3-1.699 2.25-2.25A6.09 6.09 0 0 1 9 .25a6.09 6.09 0 0 1 3.111.826c.95.551 1.7 1.301 2.25 2.25.551.95.826 1.987.826 3.112 0 .609-.093 1.218-.28 1.828a6.046 6.046 0 0 1-1.477 2.496l1.722.492zM9 1.375c-.914 0-1.758.229-2.531.686a5.16 5.16 0 0 0-1.846 1.845 4.886 4.886 0 0 0-.686 2.532c0 .914.229 1.757.686 2.53a5.16 5.16 0 0 0 1.846 1.846A4.886 4.886 0 0 0 9 11.5c.914 0 1.758-.228 2.531-.686a5.16 5.16 0 0 0 1.846-1.845 4.886 4.886 0 0 0 .685-2.531c0-.915-.228-1.758-.685-2.532a5.16 5.16 0 0 0-1.846-1.845A4.886 4.886 0 0 0 9 1.375zM16.875 16v-.984c0-.61-.188-1.166-.563-1.67a2.83 2.83 0 0 0-1.476-1.037l-2.461-.704A6.01 6.01 0 0 1 9 12.625a6.01 6.01 0 0 1-3.375-1.02l-2.46.704a2.83 2.83 0 0 0-1.478 1.037 2.733 2.733 0 0 0-.562 1.67V16c0 .305.111.568.334.791.223.223.486.334.791.334h13.5c.305 0 .568-.111.791-.334.223-.223.334-.486.334-.791z" fill="#252525" fill-rule="evenodd"/></svg>
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

        </div>
      </div>

    </div>

    <div class="project -new">
      <button class="button -new" @click="newProject()">
        + New Project
      </button>
    </div>

  </div>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/features'

.project-grid
  +grid(1, 2rem)

  +for-tablet-portrait
    +grid(2, 2rem)

  +for-desktop
    +grid(3, 2rem)

  +for-big-desktop
    +grid(4, 2rem)

.project
  display: flex

  .button
    width: 100%

  .heading
    padding: .5rem 1.5rem

    .icon
      display: flex

  .content
    padding: .5rem 1.5rem
    +margin-to-childs(.25rem)

    .info
      +chain(.5rem)
      align-items: center

    .icon
      width: 2rem

.light
  color: mix($color-gray, white, 40%)

.my-role
  font-weight: 600

.button.-new
  font-size: 1.4rem
  padding-top: 2rem
  padding-bottom: 2rem

</style>
