<script>
/**
 * Calendar Editor
 * @param {string} content - Content saves automatically when changing
 * @param {string} config.EDITOR - Name of editor
 * @param {string} config.TITLE
 * @param {string} config.MODE
 * @param {string} config.SECONDS
 * @param {string} config.HOUR_STEP
 * @param {string} config.MINUTE_STEP
 * @param {string} config.SECOND_STEP
 */

import EditorBase from '@/editors/common/BaseEditor'
import _ from 'lodash'
import dayjs from 'dayjs'
import {setupCalendar, DatePicker} from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

setupCalendar({
  firstDayOfWeek: 2,
})

export default {
  extends: EditorBase,

  name: 'DateTimeEditor',

  components: {
    'v-date-picker': DatePicker,
  },

  data () {
    return {
      date: null,
      hour: null,
      minute: null,
      second: null,
    }
  },

  watch: {

    date () {
      this.setContent()
    },

    hour () {
      this.setContent()
    },

    minute () {
      this.setContent()
    },

    second () {
      this.setContent()
    },

  },

  computed: {

    hourOptions () {
      return this.timeOptions(this.config.HOUR, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
    },

    minuteOptions () {
      return this.timeOptions(this.config.MINUTE, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59])
    },

    secondOptions () {
      return this.timeOptions(this.config.SECOND, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59])
    },

    pickerMode () {
      if (_.includes(['date', 'date-time'], this.config.MODE) || !this.config.MODE) {
        return 'single'
      }
      else if (this.config.MODE === 'date-range') {
        return 'range'
      }
      else if (this.config.MODE === 'date-multiple') {
        return 'multiple'
      }
      else {
        return false
      }
    },

    showTime () {
      return _.includes(['time', 'date-time'], this.config.MODE) || !this.config.MODE
    },

    showSecond () {
      return _.has(this.config, 'SECOND') && this.config.SECOND !== false
    },

    showNow () {
      return _.includes(['date', 'time', 'date-time'], this.config.MODE) || !this.config.MODE
    },

  },

  methods: {

    timeOptions (configTime, defaultValues) {
      let options = []
      configTime = _.isObject(configTime) ? configTime : defaultValues

      _.each(configTime, time => {
        if (_.has(time, 'value')) {
          let label = time.label || time.value
          options.push({
            value: `0${time.value}`.slice(-2),
            label: label,
          })
        }
        else {
          options.push({
            value: `0${time}`.slice(-2),
            label: `0${time}`.slice(-2),
          })
        }
      })

      return options
    },

    closestValue (options, value) {
      let selectedAccuracy = null
      let closestTime = null

      _.each(options, time => {
        let accuracy = Math.abs(time.value - value)
        if (selectedAccuracy > accuracy || selectedAccuracy === null || closestTime === null) {
          selectedAccuracy = accuracy
          closestTime = time.value
        }
      })

      return closestTime
    },

    initSingle () {
      if (dayjs(this.content).isValid() && this.config.MODE !== 'time' && dayjs(this.content).year() === 1970 && dayjs(this.content).month() === 0 && dayjs(this.content).date() === 1) {
        this.date = dayjs().toDate()
      }
      else if (dayjs(this.content).isValid()) {
        this.date = dayjs(this.content).toDate()
      }
      else {
        this.date = dayjs().toDate()
      }

      if (this.showTime) {
        this.hour = this.closestValue(this.hourOptions, dayjs(this.date).hour())
        this.minute = this.closestValue(this.minuteOptions, dayjs(this.date).minute())
      }
      else {
        this.hour = '00'
        this.minute = '00'
      }

      if (this.showTime && this.showSecond) {
        this.second = this.closestValue(this.secondOptions, dayjs(this.date).second())
      }
      else {
        this.second = '00'
      }
    },

    initMultiple () {
      let dateStrings = _.isArray(this.content) ? this.content : null
      let dates = []

      _.each(dateStrings, date => {
        dates.push(dayjs(date).toDate())
      })

      this.date = dates
    },

    initRange () {
      this.date = {
        start: dayjs(this.content.start).toDate(),
        end: dayjs(this.content.end).toDate(),
      }
    },

    setContent () {
      if (this.config.MODE === 'date-multiple') {
        let dates = []
        _.each(this.date, date => {
          dates.push(dayjs(date).toISOString())
        })
        this.content = dates
      }
      else if (this.config.MODE === 'date-range') {
        this.content = {
          start: dayjs(this.date.start).toISOString(),
          end: dayjs(this.date.end).toISOString(),
        }
      }
      else if (this.config.MODE === 'time') {
        this.content = dayjs(this.date)
          .set('year', 1970)
          .set('month', 0)
          .set('date', 1)
          .set('hour', this.hour)
          .set('minute', this.minute)
          .set('second', this.second)
          .toISOString()
      }
      else {
        this.content = dayjs(this.date)
          .set('hour', this.hour)
          .set('minute', this.minute)
          .set('second', this.second)
          .toISOString()
      }
    },

    selectNow () {
      this.date = dayjs().toDate()
      this.hour = this.closestValue(this.hourOptions, dayjs(this.date).hour())
      this.minute = this.closestValue(this.minuteOptions, dayjs(this.date).minute())
      this.second = this.closestValue(this.secondOptions, dayjs(this.date).second())
    },

  },

  created () {
    if (this.config.MODE === 'date-multiple') {
      this.initMultiple()
    }
    else if (this.config.MODE === 'date-range') {
      this.initRange()
    }
    else {
      this.initSingle()
    }
  },

}
</script>

<template>
<section class="editor -calendar">

  <v-date-picker
    v-if="pickerMode"
    :mode='pickerMode'
    is-inline
    v-model='date'
  ></v-date-picker>

  <section class="tools">

    <div class="time" v-if="showTime">
      <select class="select" v-model="hour">
        <option
          :value="time.value"
          v-text="time.label"
          v-for="(time, index) in hourOptions"
          :key="index"
        />
      </select>

      <span>:</span>

      <select class="select" v-model="minute">
        <option
          :value="time.value"
          v-text="time.label"
          v-for="(time, index) in minuteOptions"
          :key="index"
        />
      </select>

      <span v-if="showSecond">:</span>

      <select class="select" v-model="second" v-if="showSecond">
        <option
          :value="time.value"
          v-text="time.label"
          v-for="(time, index) in secondOptions"
          :key="index"
        />
      </select>
    </div>

    <hr>

    <button-core light @click.native="selectNow" v-if="showNow">Now</button-core>

  </section>

</section>
</template>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/core/mixins'

.editor.-calendar
  +gap()
  max-width: 30rem

.c-pane-container
  width: 100%

.tools
  +chain(.25rem)
  width: 100%

.time
  +chain(.25rem)
  max-width: 100%

  .select
    width: auto

</style>
