import { appliedThemeAtom, themeAtom, toggleThemeAtom } from '@renderer/store'
import { useAtom, useSetAtom } from 'jotai'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'
import { ActionButton } from './ActionButton'

export const ThemeToggleButton = () => {
  const [theme] = useAtom(themeAtom)
  const [appliedTheme] = useAtom(appliedThemeAtom)
  const toggleTheme = useSetAtom(toggleThemeAtom)

  const getIcon = () => {
    switch (theme) {
      case 'system':
        return <LuMonitor className="w-4 h-4" />
      case 'light':
        return <LuSun className="w-4 h-4" />
      case 'dark':
        return <LuMoon className="w-4 h-4" />
      default:
        return <LuMonitor className="w-4 h-4" />
    }
  }

  const getTooltip = () => {
    switch (theme) {
      case 'system':
        return `跟随系统 (当前: ${appliedTheme === 'dark' ? '深色' : '浅色'})`
      case 'light':
        return '浅色模式'
      case 'dark':
        return '深色模式'
      default:
        return '主题切换'
    }
  }

  return (
    <ActionButton onClick={toggleTheme} title={getTooltip()}>
      {getIcon()}
    </ActionButton>
  )
}
