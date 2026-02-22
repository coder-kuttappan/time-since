const MS_PER_HOUR = 1000 * 60 * 60
const MS_PER_DAY = MS_PER_HOUR * 24

export function formatTimeSince(timestamp) {
  const ms = Date.now() - timestamp

  // Use calendar-day comparison in local timezone so "yesterday" is always "1 day"
  // regardless of what time the entry was logged or what time it currently is
  const now = new Date()
  const then = new Date(timestamp)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const thenStart = new Date(then.getFullYear(), then.getMonth(), then.getDate()).getTime()
  const days = Math.round((todayStart - thenStart) / MS_PER_DAY)

  if (days < 1) return 'today'
  if (days < 7) return days === 1 ? '1 day' : `${days} days`
  if (days < 28) {
    const weeks = Math.floor(days / 7)
    const remainDays = days % 7
    if (remainDays === 0) return weeks === 1 ? '1 week' : `${weeks} weeks`
    return `${weeks}w ${remainDays}d`
  }
  if (days < 365) {
    const months = Math.round(days / 30.44)
    return months <= 1 ? '1 month' : `${months} months`
  }
  const years = days / 365.25
  if (years < 1.5) return '1 year'
  const rounded = Math.round(years * 10) / 10
  return `${rounded} years`
}

export function formatDetailedTime(timestamp) {
  const ms = Date.now() - timestamp
  const totalHours = Math.floor(ms / MS_PER_HOUR)
  const totalDays = Math.floor(ms / MS_PER_DAY)

  if (totalHours < 1) {
    const mins = Math.floor(ms / 60000)
    return mins <= 1 ? 'less than a minute ago' : `${mins} minutes ago`
  }

  const parts = []
  const years = Math.floor(totalDays / 365)
  let remaining = totalDays % 365
  const months = Math.floor(remaining / 30)
  remaining = remaining % 30
  const weeks = Math.floor(remaining / 7)
  const days = remaining % 7
  const hours = totalHours % 24

  if (years > 0) parts.push(`${years}y`)
  if (months > 0) parts.push(`${months}mo`)
  if (weeks > 0) parts.push(`${weeks}w`)
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0 && totalDays < 28) parts.push(`${hours}h`)

  return parts.join(' ') + ' ago'
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
