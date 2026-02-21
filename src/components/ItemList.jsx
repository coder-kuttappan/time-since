import { ItemCard } from './ItemCard'
import { ExampleCard } from './ExampleCard'

export function ItemList({ items, examples, onLog, onDelete, onEditTime, onRename }) {
  return (
    <div>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onLog={onLog}
          onDelete={onDelete}
          onEditTime={onEditTime}
          onRename={onRename}
        />
      ))}

      {examples.length > 0 && (
        <div className="pointer-events-none">
          <p className="text-xs text-text-secondary/40 uppercase tracking-wider mb-3 px-1">e.g.</p>
          {examples.map((item) => (
            <ExampleCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
