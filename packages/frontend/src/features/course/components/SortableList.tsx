import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Fragment, type ReactNode } from 'react';
import { LuGripVertical } from 'react-icons/lu';

/**
 * Generic vertical drag-and-drop list. `renderItem` receives the item plus a
 * ready-made drag handle node to place wherever it fits in the row UI.
 *
 * `renderGap` (optional) renders an interstitial slot before the first row and
 * after every row — used for hover-to-insert affordances. It is called with
 * `null` for the leading slot and the preceding item's id otherwise.
 */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  renderGap,
  disabled,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, handle: ReactNode) => ReactNode;
  renderGap?: (afterId: string | null) => ReactNode;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-3">
          {renderGap?.(null)}
          {items.map((item) => (
            <Fragment key={item.id}>
              <SortableRow id={item.id} disabled={disabled}>
                {(handle) => renderItem(item, handle)}
              </SortableRow>
              {renderGap?.(item.id)}
            </Fragment>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled?: boolean;
  children: (handle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const handle = (
    <button
      type="button"
      aria-label="Drag to reorder"
      className="text-muted-foreground hover:text-foreground grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <LuGripVertical className="size-4" />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style}>
      {children(handle)}
    </div>
  );
}
