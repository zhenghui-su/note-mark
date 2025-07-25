import { NoteContent, NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'
const loadNotes = async () => {
  // 从文件中获取所有笔记信息
  const notes = await window.context.getNotes()
  // 按最近编辑时间排序
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex == null || !notes) return null

  const selectedNote = notes[selectedNoteIndex]

  // 从文件读取笔记内容
  const noteContent = await window.context.readNote(selectedNote.title)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      content: '',
      lastEditTime: 0
    }
)

export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  // 保存到硬盘 save on disk
  await window.context.writeNote(selectedNote.title, newContent)

  // 更新笔记的最后编辑时间 update the saved note's last edit time
  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }
      return note
    })
  )
})

export const createEmptyNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = await window.context.createNote()

  if (!title) return

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])
  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isDeleted = await window.context.deleteNote(selectedNote.title)

  if (!isDeleted) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})

// 主题管理
export type Theme = 'light' | 'dark' | 'system'

// 获取系统主题偏好
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 获取实际应用的主题（处理system模式）
const getAppliedTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

const getInitialTheme = (): Theme => {
  // 在服务端渲染环境中，localStorage可能不存在
  if (typeof window === 'undefined') return 'system'

  const saved = localStorage.getItem('notemark-theme')
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  return 'system' // 默认跟随系统主题
}

// 应用主题到DOM
const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return

  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 初始化主题atom
const initialTheme = getInitialTheme()
export const themeAtom = atom<Theme>(initialTheme)

// 计算实际应用的主题
export const appliedThemeAtom = atom<'light' | 'dark'>((get) => {
  const theme = get(themeAtom)
  return getAppliedTheme(theme)
})

// 初始化时设置HTML类
if (typeof window !== 'undefined') {
  const appliedTheme = getAppliedTheme(initialTheme)
  applyTheme(appliedTheme)

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    // 只有在system模式下才响应系统主题变化
    const currentTheme = localStorage.getItem('notemark-theme')
    if (currentTheme === 'system' || !currentTheme) {
      const newSystemTheme = getSystemTheme()
      applyTheme(newSystemTheme)
    }
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)
}

export const toggleThemeAtom = atom(null, (get, set) => {
  const currentTheme = get(themeAtom)
  let newTheme: Theme

  // 循环切换：system -> light -> dark -> system
  switch (currentTheme) {
    case 'system':
      newTheme = 'light'
      break
    case 'light':
      newTheme = 'dark'
      break
    case 'dark':
      newTheme = 'system'
      break
    default:
      newTheme = 'system'
  }

  set(themeAtom, newTheme)

  // 确保localStorage存在
  if (typeof window !== 'undefined') {
    localStorage.setItem('notemark-theme', newTheme)

    // 应用新主题
    const appliedTheme = getAppliedTheme(newTheme)
    applyTheme(appliedTheme)
  }
})
