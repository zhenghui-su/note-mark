import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolated must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // 获取系统语言和时区
    locale: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // 获取笔记
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    // 读取笔记内容
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    // 写入笔记内容
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    // 新建笔记
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    // 删除笔记
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args)
  })
} catch (error) {
  console.error(error)
}
