import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon'

import 'vue-awesome/icons/regular/file'
import 'vue-awesome/icons/regular/user'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/cloud-upload-alt'
import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/regular/edit'
import 'vue-awesome/icons/cogs'
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/regular/clock'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/edit'
import 'vue-awesome/icons/sign-out-alt'
import 'vue-awesome/icons/regular/copy'
import 'vue-awesome/icons/regular/thumbs-up'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/kiwi-bird'
import 'vue-awesome/icons/play-circle'

Icon.register({
  editlayer: {
    width: 28,
    height: 20,
    paths: [
      {d: 'm13.8461538 15.8859592 10.8869191-5.238444 2.9592348 1.2250892v1.1380841l-13.8461539 6.433133-13.8461538-6.433133v-1.1380841l2.86214193-1.2250892z'},
      {d: 'm13.8461538 0 13.8461539 6.72571046v1.13808415l-13.8461539 6.43313299-13.8461538-6.43313299v-1.13808415z'},
    ],
  },
})

Icon.register({
  schema: {
    width: 25,
    height: 23,
    d: 'M3.337 15.132c0-1.597-1.113-2.396-3.337-2.396v-2.46c1.129 0 1.967-.195 2.515-.585.548-.391.822-.986.822-1.784V3.902c0-1.34.453-2.324 1.36-2.955C5.606.316 6.967 0 8.782 0v2.344c-.954.043-1.646.242-2.076.599-.431.356-.646.886-.646 1.59v3.825c0 1.708-.958 2.73-2.873 3.065v.154c1.915.31 2.873 1.327 2.873 3.052v3.85c0 .705.213 1.237.64 1.598.426.36 1.12.55 2.082.566V23c-1.932-.017-3.322-.354-4.171-1.01-.849-.658-1.273-1.72-1.273-3.188v-3.67zm18.502 3.953c0 1.34-.416 2.322-1.248 2.95-.832.626-2.164.948-3.995.965v-2.357c.794-.008 1.413-.174 1.856-.495.443-.322.665-.878.665-1.668v-3.374c0-1.039.222-1.842.665-2.408.443-.567 1.179-.94 2.207-1.12v-.155c-1.915-.335-2.872-1.357-2.872-3.065V4.533c0-.704-.19-1.234-.57-1.59-.381-.357-1.032-.556-1.951-.6V0c1.864 0 3.205.328 4.02.985.815.657 1.223 1.732 1.223 3.226v3.696c0 .859.265 1.468.796 1.829.532.36 1.32.54 2.365.54v2.46c-1.029 0-1.813.183-2.352.548-.54.364-.81.98-.81 1.848v3.953z',
  },
})

Vue.component('icon', Icon)
