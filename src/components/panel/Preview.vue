// <script>
// import _ from 'lodash'
// // import Color from 'color'
//
// export default {
//   name: 'Item',
//
//   props: {
//     item: Object,
//   },
//
//   computed: {
//
//     preview () {
//       if (this.item.EDITOR === 'image') {
//         let imageUrl = this.item._content
//
//         return {
//           type: 'image',
//           content: imageUrl,
//         }
//       }
//       else if (this.item.EDITOR === 'code') {
//         let content = this.item._content
//
//         if (content && content.length > 60) {
//           content = content.substring(0, 57).trim() + '…'
//         }
//
//         return {
//           type: 'code',
//           content: content,
//         }
//       }
//       // else if (this.item.EDITOR === 'color') {
//       //   let content = this.item._content
//       //   let color = Color(this.item._content)
//       //
//       //   return {
//       //     type: 'color',
//       //     content: content,
//       //     color: color,
//       //     isDark: color.isDark(),
//       //   }
//       // }
//       else if (this.item.EDITOR === 'switch') {
//         let content = null
//
//         if (this.item._content === true) {
//           content = 'ON'
//         }
//         else if (this.item._content === false) {
//           content = 'OFF'
//         }
//
//         return {
//           type: 'switch',
//           content: content,
//         }
//       }
//       else if (this.item._content) {
//         let content = this.item._content
//
//         let div = document.createElement('div')
//         div.innerHTML = content
//
//         content = div.textContent || div.innerText || ''
//
//         if (content && content.length > 70) {
//           content = content.substring(0, 67).trim() + '…'
//         }
//
//         return {
//           type: 'text',
//           content: content,
//         }
//       }
//       else {
//         return {}
//       }
//     },
//
//   },
//
// }
// </script>
//
// <template>
// <component :is="activePreviewComponent"/>
// </template>
//
// <style lang="sass" scoped>
// @import '../../sass/variables'
// @import '../../sass/mixins/all'
//
// .item
//   position: relative
//
//   &::after
//     content: ''
//     position: absolute
//     left: 0
//     top: 0
//     bottom: 0
//     right: 0
//     border-radius: $button-border-radius
//     border-left: .5rem solid $color-info
//     transition: opacity .2s
//     opacity: 0
//
//   &.-active::after
//     opacity: 1
//
//   .heading
//     font-size: 1rem
//     font-weight: 600
//
//     .text
//       +chain(.25rem)
//
//   .draft
//     color: $color-warning
//     font-size: .75rem
//
//   .content
//     flex-grow: 1
//
//   .content
//     font-size: .8em
//     overflow: hidden
//
//     &.-code
//       font-size: .7em
//       font-family: monospace
//       background-color: $color-gray
//       color: mix($color-gray, $color-white, 20%)
//
//     &.-color
//       font-family: monospace
//       color: $color-black
//
//       &.-isDark
//         color: $color-white
//
//     &.-switch
//       font-size: 1rem
//       font-weight: 900
//
//       &.-isOn
//         color: $color-success
//
//       &.-isOff
//         color: $color-danger
//
//     &.-image
//       position: relative
//       background-image: url('../../assets/image-background.png')
//       background-position: center
//       border-bottom-left-radius: $button-border-radius
//       border-bottom-right-radius: $button-border-radius
//       height: 5em
//       display: flex
//       justify-content: center
//       align-items: center
//       padding: 0
//
//       .image
//         border-bottom-left-radius: $button-border-radius
//         border-bottom-right-radius: $button-border-radius
//         height: 6em
//         width: 100%
//         object-fit: cover
//         filter: brightness(93%)
//
// </style>
