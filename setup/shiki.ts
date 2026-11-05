import { defineShikiSetup } from '@slidev/types'

/**
 * Code highlighting in Camunda brand colours only (light mode).
 * Black #1B1B1B, Mid gray #6F6F6F, Purple 700 #4A49A4, Orange 700 #A24313, Green 800 #617034.
 * All pass WCAG AA on the white code background.
 */
const camundaLight = {
  name: 'camunda-light',
  type: 'light',
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#1B1B1B',
  },
  tokenColors: [
    { settings: { foreground: '#1B1B1B' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#6F6F6F' } },
    { scope: ['string', 'string.quoted', 'markup.inline.raw'], settings: { foreground: '#617034' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: '#A24313' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.operator.new'], settings: { foreground: '#4A49A4' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: '#4A49A4' } },
    { scope: ['variable', 'variable.other', 'meta.object-literal.key'], settings: { foreground: '#1B1B1B' } },
    { scope: ['markup.heading', 'markup.bold'], settings: { foreground: '#1B1B1B' } },
    { scope: ['markup.list', 'punctuation.definition.list'], settings: { foreground: '#A24313' } },
    { scope: ['punctuation', 'keyword.operator'], settings: { foreground: '#6F6F6F' } },
  ],
}

export default defineShikiSetup(() => ({
  themes: { light: camundaLight as any, dark: camundaLight as any },
}))
