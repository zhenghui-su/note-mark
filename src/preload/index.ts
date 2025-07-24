import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolated must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // 获取系统语言和时区
    locale: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })
} catch (error) {
  console.error(error)
}
