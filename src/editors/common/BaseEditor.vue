<script>
import _ from 'lodash'

export default {

  data () {
    return {
      content: this.$store.getters.activeSchema._content,
    }
  },

  computed: {

    config () {
      if (!_.has(this.$store, 'getters.activeSchema')) return {}
      let config = {}

      _.each(this.$store.getters.activeSchema, (value, key) => {
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

    // '$store.getters.activeSchema._content' (value) {
    //   this.content = value
    // },

    // '$store.getters.activeSchema._path' (value) {
    //   this.content = this.$store.getters.activeSchema._content
    //   this.$store.commit('setEditorContentValid', true)
    // },

    content (newContent, oldContent) {
      // if (oldContent === null) return null
      if (this.isValid === false) {
        this.$store.commit('setEditorContentValid', false)
        return null
      }

      this.$store.commit('setEditorContentValid', true)
      this.saveContent(newContent)
    },

  },

  methods: {

    saveContent: _.throttle(function (content) {
      this.$store.dispatch('saveContent', {
        projectId: this.$route.params.projectId,
        path: this.$store.getters.activeSchema._path,
        content: content,
      })
    }, 500),

  },

  mounted () {
    this.$store.commit('setEditorContentValid', true)
  },

}
</script>
