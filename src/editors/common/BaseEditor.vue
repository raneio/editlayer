<script>
import _ from 'lodash'

export default {

  data () {
    return {
      content: this.$store.getters.activeItem._content,
    }
  },

  computed: {

    config () {
      if (!_.has(this.$store, 'getters.activeItem')) return {}
      let config = {}

      _.each(this.$store.getters.activeItem, (value, key) => {
        if (!_.startsWith(key, '_')) config[key] = value
      })

      return config
    },

    isPatternValid () {
      if (!this.config.PATTERN) return true
      let regex = new RegExp(this.config.PATTERN, this.config.FLAGS)
      return regex.test(this.content)
    },

    isRequiredValid () {
      return this.config.REQUIRED !== true || this.content === true || !_.isEmpty(this.content)
    },

    isValid () {
      return this.isPatternValid && this.isRequiredValid && this.preventSave !== true
    },

  },

  watch: {

    content (newContent, oldContent) {
      if (this.isValid === false) {
        this.$store.commit('setEditorContentValid', false)
        return null
      }

      this.$store.commit('setEditorContentValid', true)
      this.updateContent(newContent)
    },

  },

  methods: {

    updateContent: _.throttle(function (content) {
      // TODO: Change this.$route to this.$store.route
      // console.log('updateContent', content)
      this.$store.dispatch('updateContent', {
        projectId: this.$route.params.projectId,
        path: this.$store.getters.activeItem._path,
        content: content,
      })
    }, 500),

  },

  mounted () {
    this.$store.commit('setEditorContentValid', true)
  },

}
</script>
