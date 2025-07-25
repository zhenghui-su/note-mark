import { DeleteNoteButton, NewNoteButton } from '@/components'
import { ComponentProps } from 'react'
import { ThemeToggleButton } from './ThemeToggleButton'

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <div className="flex gap-1">
        <NewNoteButton />
        <DeleteNoteButton />
      </div>
      <ThemeToggleButton />
    </div>
  )
}
