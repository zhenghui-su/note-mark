import { GetNotes, ReadNote } from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      timeZone: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
    }
  }
}
