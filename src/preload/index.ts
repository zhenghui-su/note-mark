import { GetNotes, ReadNote } from '@shared/types'
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
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args)
  })
} catch (error) {
  console.error(error)
}
