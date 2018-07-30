<script>
import EditorBase from '@/editors/common/BasePreview'
import dayjs from 'dayjs'
import _ from 'lodash'

export default {
  extends: EditorBase,
  // this.content - Content (read-only)
  // this.config - Config data from the schema (read-only)
  name: 'CalenderPreview',

  computed: {

    previewText () {
      if ((!this.config.MODE || this.config.MODE === 'date-time') && _.has(this.config, 'SECOND') && this.config.SECOND !== false) {
        return dayjs(this.content).format('YYYY-MM-DD HH:mm:ss')
      }
      else if ((!this.config.MODE || this.config.MODE === 'date-time')) {
        return dayjs(this.content).format('YYYY-MM-DD HH:mm')
      }
      else if (this.config.MODE === 'date') {
        return dayjs(this.content).format('YYYY-MM-DD')
      }
      else if (this.config.MODE === 'time' && _.has(this.config, 'SECOND') && this.config.SECOND !== false) {
        return dayjs(this.content).format('HH:mm:ss')
      }
      else if (this.config.MODE === 'time') {
        return dayjs(this.content).format('HH:mm')
      }
      else if (this.config.MODE === 'date-range') {
        return `${dayjs(this.content.start).format('YYYY-MM-DD')} – ${dayjs(this.content.end).format('YYYY-MM-DD')}`
      }
      else if (this.config.MODE === 'date-multiple') {
        if (!_.isArray(this.content)) return ''

        return this.content.map(date => {
          return dayjs(date).format('YYYY-MM-DD')
        })
      }
    },

  },

}
</script>

<template>
<div class="preview -calendar">
  <div
    class="date"
    v-text="previewText"
    v-if="config.MODE !== 'date-multiple'"
  ></div>
  <div
    class="tag"
    v-text="item"
    v-for="(item, index) in previewText"
    :key="index"
    v-if="config.MODE === 'date-multiple'"
  ></div>
</div>
</template>

<style lang="sass" scoped>
@import '../../sass/variables'
@import '../../sass/core/mixins'

.preview.-calendar
  padding: .3rem 1rem
  font-size: .8rem

.date
  overflow: hidden
  text-overflow: ellipsis

.tag
  display: inline-block
  margin-right: .25rem
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  max-width: 7em
  background-color: $color-gray--lighter
  padding: .2em .75em
  border-radius: .25rem

</style>
