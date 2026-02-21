import { ItemCard } from './ItemCard'
import { ExampleCard } from './ExampleCard'

export function ItemList({ items, examples, onLog, onDelete, onEditTime, onRename, onDismissExample, onAdoptExample, onAdoptAllExamples, onDismissAllExamples, pendingDateItemId, onClearPendingDate }) {
  const hasItems = items.length > 0
  const hasExamples = examples.length > 0
  const isEmpty = !hasItems && !hasExamples

  if (isEmpty) {
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
          onEditTime={onEditTime}
          onRename={onRename}
          openWithDatePicker={item.id === pendingDateItemId}
          onClearPendingDate={onClearPendingDate}
        />
      ))}

      {hasExamples && (
        <>
          {hasItems && <div className="h-4" />}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs text-text-secondary/60 uppercase tracking-wider">
              examples
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onAdoptAllExamples}
                className="text-xs text-accent/60 hover:text-accent transition-colors cursor-pointer"
              >
                keep all
              </button>
              <button
                onClick={onDismissAllExamples}
                className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors cursor-pointer"
              >
                clear all
              </button>
            </div>
          </div>
          {examples.map((item) => (
            <ExampleCard
              key={item.id}
              item={item}
              onKeep={onAdoptExample}
              onDismiss={onDismissExample}
            />
          ))}
        </>
      )}
    </div>
  )
}
