<script>
import _ from 'lodash'

export default {

  props: {
    item: Object,
  },

  computed: {

    content () {
      return this.item._content
    },

    config () {
      let config = {}

      _.each(this.item, (value, key) => {
        if (!_.startsWith(key, '_')) config[key] = value
      })

      return config
    },

  },

}
</script>
