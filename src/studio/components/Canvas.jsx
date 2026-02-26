import { DndContext } from "@dnd-kit/core";
import { useCallback, useMemo } from "react";
import { cx, ui } from "../ui/ui";
import BoardItemView from "./BoardItemView";
import MemphisBackdrop from "./MemphisBackdrop";

import {
  ArrowDownToLine,
  ArrowUpToLine,
  Copy,
  Dices,
  Palette,
  Trash2,
} from "lucide-react";

function CanvasActionBar({
  hasSelection,
  canExtract,
  onRandomScene,
  onDuplicateSelected,
  onBringToFront,
  onSendToBack,
  onDeleteSelected,
  onExtractPalette,
}) {
  const disabled = !hasSelection;

  const btnBase =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold " +
    "ring-1 ring-white/10 bg-white/6 hover:bg-white/10 text-white/80 " +
    "transition disabled:opacity-40 disabled:cursor-not-allowed " +
    "focus:outline-none focus:ring-2 focus:ring-white/20";

  const btnDanger =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold " +
    "ring-1 ring-rose-400/30 bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 " +
    "transition disabled:opacity-40 disabled:cursor-not-allowed " +
    "focus:outline-none focus:ring-2 focus:ring-rose-300/30";

  return (
    <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-2xl bg-black/35 px-2 py-2 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,.55)]">
        <button
          onClick={onRandomScene}
          className={btnBase}
          title="Random scene"
          type="button"
        >
          <Dices size={16} />
          <span className="hidden sm:inline">Scene</span>
        </button>

        <div className="mx-1 h-6 w-px bg-white/10" />

        <button
          onClick={onDuplicateSelected}
          disabled={disabled}
          className={btnBase}
          title="Duplicate"
          type="button"
        >
          <Copy size={16} />
          <span className="hidden sm:inline">Duplicate</span>
        </button>

        <button
          onClick={onBringToFront}
          disabled={disabled}
          className={btnBase}
          title="Bring to front"
          type="button"
        >
          <ArrowUpToLine size={16} />
          <span className="hidden sm:inline">Front</span>
        </button>

        <button
          onClick={onSendToBack}
          disabled={disabled}
          className={btnBase}
          title="Send to back"
          type="button"
        >
          <ArrowDownToLine size={16} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={disabled}
          className={btnDanger}
          title="Delete"
          type="button"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Delete</span>
        </button>

        {canExtract && (
          <>
            <div className="mx-1 h-6 w-px bg-white/10" />
            <button
              onClick={onExtractPalette}
              className={cx(
                btnBase,
                "bg-white/10 hover:bg-white/14 text-white",
              )}
              title="Extract palette"
              type="button"
            >
              <Palette size={16} />
              <span className="hidden sm:inline">Extract</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Canvas({
  scene,
  board,
  selectedId,
  setSelectedId,
  sensors,
  onDragStart,
  onDragMove,
  onDragEnd,
  onUpdateItem,

  canExtract,
  onExtractPalette,
  onDeleteSelected,
  onDuplicateSelected,
  onBringToFront,
  onSendToBack, // ✅ NEW
  onRandomScene,
}) {
  const hasSelection = Boolean(selectedId);

  const sortedItems = useMemo(() => {
    return board.items.slice().sort((a, b) => a.z - b.z);
  }, [board.items]);

  const handleBackgroundPointerDown = useCallback(
    (e) => {
      // On ne deselect QUE si on clique vraiment le fond du canvas
      if (e.target === e.currentTarget) setSelectedId(null);
    },
    [setSelectedId],
  );

  return (
    <section className="relative z-10 min-w-0">
      <div className={ui.canvasShell}>
        <MemphisBackdrop scene={scene} />

        <CanvasActionBar
          hasSelection={hasSelection}
          canExtract={canExtract}
          onRandomScene={onRandomScene}
          onDuplicateSelected={onDuplicateSelected}
          onBringToFront={onBringToFront}
          onSendToBack={onSendToBack}
          onDeleteSelected={onDeleteSelected}
          onExtractPalette={onExtractPalette}
        />

        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        >
          <div
            className="relative z-10 h-[70dvh] w-full"
            onPointerDown={handleBackgroundPointerDown}
          >
            {sortedItems.map((item) => (
              <BoardItemView
                key={item.id}
                item={item}
                isSelected={item.id === selectedId}
                onSelect={() => setSelectedId(item.id)}
                onUpdateItem={onUpdateItem}
              />
            ))}
          </div>
        </DndContext>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />
      </div>
    </section>
  );
}
