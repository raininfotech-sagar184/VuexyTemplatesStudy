// React Imports
import { Fragment, forwardRef, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const Title = ({ title, flexGrow = false }) => {
  return flexGrow ? (
    <span className='grow text-[15px] leading-[1.4667] truncate'>{title}</span>
  ) : (
    <span className='text-[15px] leading-[1.4667] truncate'>{title}</span>
  )
}

const TitleWithAncestors = ({ title, flexGrow = false, ancestors }) => {
  if (ancestors.length === 0) return <Title title={title} flexGrow={flexGrow} />

  return (
    <div className='flex items-center grow gap-2'>
      {ancestors.map(ancestor => (
        <Fragment key={ancestor.id}>
          <span style={{ opacity: 0.5 }}>{ancestor.name}</span>
          <span>&rsaquo;</span>
        </Fragment>
      ))}
      <Title title={title} flexGrow={flexGrow} />
    </div>
  )
}

const Shortcut = ({ shortcut }) => {
  if (shortcut.length > 1) {
    return (
      <div className='flex items-center gap-1.5'>
        {shortcut.map(sc => (
          <kbd key={sc} className='kbd flex items-center justify-center is-6 bs-6 rounded-sm text-sm bg-actionSelected'>
            {sc}
          </kbd>
        ))}
      </div>
    )
  }

  return (
    <kbd className='kbd flex items-center justify-center is-6 bs-6 rounded-sm text-sm bg-actionSelected'>
      {shortcut[0]}
    </kbd>
  )
}

const EnterComponent = ({ active, currentPath, data, locale }) => {
  const theme = useTheme()

  return (
    active && (
      <i
        className={classnames('text-xl', {
          'tabler-corner-down-left': theme.direction === 'ltr',
          'tabler-corner-down-right': theme.direction === 'rtl',
          'text-primary': currentPath === getLocalizedUrl(data.url, locale)
        })}
      />
    )
  )
}

const SearchResultItem = forwardRef(({ action, active, currentRootActionId, currentPath, data }, ref) => {
  // Hooks
  const locale = 'en'

  const ancestors = useMemo(() => {
    if (!currentRootActionId) return action.ancestors
    const index = action.ancestors.findIndex(ancestor => ancestor.id === currentRootActionId)

    return action.ancestors.slice(index + 1)
  }, [action.ancestors, currentRootActionId])

  return (
    <div
      ref={ref}
      className={classnames('flex items-center justify-between gap-4 relative plb-2 pli-4 cursor-pointer rounded-md', {
        'bg-[var(--mui-palette-action-selected)]': active,
        'bg-[var(--mui-palette-primary-lightOpacity)] text-primary':
          !active && currentPath === getLocalizedUrl(data.url, locale),
        'bg-[var(--mui-palette-primary-mainOpacity)] text-primary':
          active && currentPath === getLocalizedUrl(data.url, locale)
      })}
    >
      <div className='flex items-center grow gap-2 text-sm'>
        {action.icon && <i className={classnames(action.icon, 'text-xl')} />}
        {action.name &&
          (action.subtitle ? (
            <div className='flex flex-col grow'>
              <TitleWithAncestors title={action.name} ancestors={ancestors} />
              {action.subtitle && (
                <span className='text-[13px] leading-[1.538462] text-textSecondary'>{action.subtitle}</span>
              )}
            </div>
          ) : (
            <TitleWithAncestors flexGrow title={action.name} ancestors={ancestors} />
          ))}
      </div>
      <EnterComponent active={active} currentPath={currentPath} data={data} locale={locale} />
      {action.shortcut?.length && <Shortcut shortcut={action.shortcut} />}
    </div>
  )
})

export default SearchResultItem
