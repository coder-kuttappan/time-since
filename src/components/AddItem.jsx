import { useState } from 'react'

export function AddItem({ onAdd }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="what did you do?"
        className="w-full px-5 py-3.5 rounded-2xl bg-card text-text text-base
          placeholder:text-text-secondary/60 shadow-sm
          outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
      />
    </form>
  )
}
