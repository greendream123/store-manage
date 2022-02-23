import { createI18n } from 'vue-i18n'

import customZhCn from './zh-CN.js'
import customEnUs from './en-US.js'
import localeZH from 'element-plus/lib/locale/lang/zh-cn'
import localeEN from 'element-plus/lib/locale/lang/en'

const langs = ['zh-CN', 'en-US']
const productLang = langs[0]

const messages = {
  'zh-CN': Object.assign(customZhCn, localeZH),
  'en-US': Object.assign(customEnUs, localeEN)
}

const i18n = createI18n({
  locale: productLang,
  messages
})

export default i18n
