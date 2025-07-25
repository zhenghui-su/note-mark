import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 扩展Window接口
declare global {
  interface Window {
    context: {
      locale: string
      timeZone: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
    }
  }
}
/**
 * 合并并处理CSS类名的工具函数
 *
 * @param args - 需要合并的类名数组，支持字符串、对象、数组等多种格式的类名
 * @returns 返回经过处理和合并后的最终CSS类名字符串
 */
export const cn = (...args: ClassValue[]): string => {
  // 使用clsx处理类名数组，将其转换为字符串格式
  // 然后使用twMerge对类名进行合并和优化处理
  return twMerge(clsx(...args))
}

const dateFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: window.context.timeZone
})

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms)
