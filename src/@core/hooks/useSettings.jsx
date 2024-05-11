// React Imports
import { useContext } from 'react'

// Context Imports
import { SettingsContext } from '@core/contexts/settingsContext'

export const useSettings = () => {
  // Hooks
  const context = useContext(SettingsContext)
console.log("object===============>",context)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }

  return context
}
