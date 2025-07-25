import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>
export const ActionButton = ({ className, children, ...props }: ActionButtonProps) => {
  return (
    <button
      className={twMerge(
        `px-2 py-1 rounded-md border transition-colors duration-100
        border-gray-300 hover:bg-gray-200 text-gray-700
        dark:border-zinc-400/50 dark:hover:bg-zinc-600/50 dark:text-gray-200`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
