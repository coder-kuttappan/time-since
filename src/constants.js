export const STORAGE_KEY = 'time-since-items'
export const EXAMPLES_DISMISSED_KEY = 'time-since-examples-dismissed'
export const TOAST_DURATION = 4000

const now = Date.now()
const days = (d) => now - d * 86400000

export const EXAMPLE_ITEMS = [
  { id: 'example-1', name: 'Went to the dentist', logs: [days(94)], isExample: true },
  { id: 'example-2', name: 'Got a haircut', logs: [days(43)], isExample: true },
  { id: 'example-3', name: 'Changed bedsheets', logs: [days(10)], isExample: true },
  { id: 'example-4', name: 'Called Mom', logs: [days(3)], isExample: true },
  { id: 'example-5', name: 'Cleaned the fridge', logs: [days(15)], isExample: true },
]
