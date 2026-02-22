import { CATEGORIES } from '../constants'

export function FilterBar({ items, filter, onFilter }) {
  const activeCategories = CATEGORIES.filter((cat) => items.some((i) => i.category === cat))
  if (activeCategories.length === 0) return null

  return (
    <div
      className="flex gap-2 mb-4 overflow-x-auto"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: '2px' }}
    >
      <button
        onClick={() => onFilter(null)}
        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
          !filter
            ? 'bg-accent text-white'
            : 'bg-border text-text-secondary hover:bg-border/80'
        }`}
      >
        All
      </button>
      {activeCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilter(filter === cat ? null : cat)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            filter === cat
              ? 'bg-accent text-white'
              : 'bg-border text-text-secondary hover:bg-border/80'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
