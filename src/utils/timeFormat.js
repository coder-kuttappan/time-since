import { TIME_UNITS } from '../constants'

const MS_PER_DAY = 1000 * 60 * 60 * 24
const MS_PER_WEEK = MS_PER_DAY * 7
const MS_PER_MONTH = MS_PER_DAY * 30.44
const MS_PER_YEAR = MS_PER_DAY * 365.25

function getDaysDiff(timestamp) {
  return Math.floor((Date.now() - timestamp) / MS_PER_DAY)
}

function formatInUnit(timestamp, unit) {
  const ms = Date.now() - timestamp
  const days = Math.floor(ms / MS_PER_DAY)

  switch (unit) {
    case 'days':
      return days === 0 ? 'today' : days === 1 ? '1 day' : `${days} days`
    case 'weeks': {
      const weeks = Math.round(ms / MS_PER_WEEK)
      return weeks <= 0 ? '< 1 week' : weeks === 1 ? '1 week' : `${weeks} weeks`
    }
    case 'months': {
      const months = Math.round(ms / MS_PER_MONTH)
      return months <= 0 ? '< 1 month' : months === 1 ? '1 month' : `${months} months`
    }
    case 'years': {
      const years = ms / MS_PER_YEAR
      if (years < 0.5) return '< 1 year'
      if (years < 1.5) return '1 year'
      const rounded = Math.round(years * 10) / 10
      return `${rounded} years`
    }
    default:
      return autoFormat(timestamp)
  }
}

function autoFormat(timestamp) {
  const days = getDaysDiff(timestamp)

  if (days === 0) return 'just now'
  if (days === 1) return '1 day'
  if (days < 14) return `${days} days`
  if (days < 60) {
    const weeks = Math.round(days / 7)
    return weeks === 1 ? '1 week' : `${weeks} weeks`
  }
  if (days < 365) {
    const months = Math.round(days / 30.44)
    return months === 1 ? '1 month' : `${months} months`
  }
  const years = days / 365.25
  if (years < 1.5) return '1 year'
  const rounded = Math.round(years * 10) / 10
  return `${rounded} years`
}

export function formatTimeSince(timestamp, unit = 'auto') {
  if (unit === 'auto') return autoFormat(timestamp)
  return formatInUnit(timestamp, unit)
}

export function nextUnit(currentUnit) {
  const idx = TIME_UNITS.indexOf(currentUnit)
  return TIME_UNITS[(idx + 1) % TIME_UNITS.length]
}
