// Editors
import Calendar from '@/editors/Calendar'
import Checkbox from '@/editors/Checkbox'
import Code from '@/editors/Code'
import Color from '@/editors/Color'
import Image from '@/editors/Image'
// import Input from '@/editors/Input'
import Markdown from '@/editors/Markdown'
import Number from '@/editors/Number'
import Radio from '@/editors/Radio'
import RichText from '@/editors/RichText'
import Select from '@/editors/Select'
import SelectImage from '@/editors/SelectImage'
import Text from '@/editors/Text'
import Textarea from '@/editors/Textarea'
import Video from '@/editors/Video'

// Previews
import ArrayPreview from '@/editors/previews/Array'
import CalendarPreview from '@/editors/previews/Calendar'
import CodePreview from '@/editors/previews/Code'
import ColorPreview from '@/editors/previews/Color'
import ImagePreview from '@/editors/previews/Image'
import OptionPreview from '@/editors/previews/Option'
import TextPreview from '@/editors/previews/Text'
import VideoPreview from '@/editors/previews/Video'

export default [
  {
    'schemaName': 'calendar',
    'editor': Calendar,
    'preview': CalendarPreview,
  },
  {
    'schemaName': 'checkbox',
    'editor': Checkbox,
    'preview': ArrayPreview,
  },
  {
    'schemaName': 'code',
    'editor': Code,
    'preview': CodePreview,
  },
  {
    'schemaName': 'color',
    'editor': Color,
    'preview': ColorPreview,
  },
  {
    'schemaName': 'image',
    'editor': Image,
    'preview': ImagePreview,
  },
  // {
  //   'schemaName': 'input',
  //   'editor': Input,
  //   'preview': TextPreview,
  // },
  {
    'schemaName': 'markdown',
    'editor': Markdown,
    'preview': TextPreview,
  },
  {
    'schemaName': 'number',
    'editor': Number,
    'preview': TextPreview,
  },
  {
    'schemaName': 'radio',
    'editor': Radio,
    'preview': OptionPreview,
  },
  {
    'schemaName': 'rich-text',
    'editor': RichText,
    'preview': TextPreview,
  },
  {
    'schemaName': 'select',
    'editor': Select,
    'preview': OptionPreview,
  },
  {
    'schemaName': 'select-image',
    'editor': SelectImage,
    'preview': ImagePreview,
  },
  {
    'schemaName': 'text',
    'editor': Text,
    'preview': TextPreview,
  },
  {
    'schemaName': 'textarea',
    'editor': Textarea,
    'preview': TextPreview,
  },
  {
    'schemaName': 'video',
    'editor': Video,
    'preview': VideoPreview,
  },
]
