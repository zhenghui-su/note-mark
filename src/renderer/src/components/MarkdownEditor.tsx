import {
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { appliedThemeAtom } from '@renderer/store'
import { useAtom } from 'jotai'

export const MarkdownEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()
  const [appliedTheme] = useAtom(appliedThemeAtom)

  if (!selectedNote) return null

  const editorClassName = `outline-none min-h-screen max-w-none text-lg px-8 py-5
    caret-yellow-500 prose prose-p:my-3 prose-p:leading-relaxed
    prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1
    prose-code:before:content-[''] prose-code:after:content-['']
    ${
      appliedTheme === 'dark'
        ? 'prose-invert prose-code:text-red-400'
        : 'prose-gray prose-code:text-red-600'
    }`

  return (
    <MDXEditor
      ref={editorRef}
      key={selectedNote.title}
      markdown={selectedNote.content}
      onChange={handleAutoSaving}
      onBlur={handleBlur}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin()
      ]}
      contentEditableClassName={editorClassName}
    />
  )
}
