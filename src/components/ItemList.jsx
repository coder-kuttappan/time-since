import { ItemCard } from './ItemCard'

export function ItemList({ items, onLog, onDelete, onCycleUnit }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary/60">
        <p className="text-lg">nothing tracked yet</p>
        <p className="text-sm mt-1">type something above to start</p>
      </div>
    )
  }

  return (
    <div>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onLog={onLog}
          onDelete={onDelete}
          onCycleUnit={onCycleUnit}
        />
      ))}
    </div>
  )
}
