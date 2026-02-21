export const STORAGE_KEY = 'time-since-items'
export const TOAST_DURATION = 4000

const now = Date.now()
const days = (d) => now - d * 86400000

export const EXAMPLE_ITEMS = [
  { id: 'example-1', name: 'Went to the dentist', logs: [days(94)] },
  { id: 'example-2', name: 'Got a haircut', logs: [days(43)] },
  { id: 'example-3', name: 'Changed bedsheets', logs: [days(10)] },
  { id: 'example-4', name: 'Called Mom', logs: [days(3)] },
]
