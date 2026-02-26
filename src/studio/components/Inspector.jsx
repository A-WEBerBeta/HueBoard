import { cx, ui } from "../ui/ui";

export default function Inspector({
  selectedItem,
  boardTitle,
  paletteStatus,
  paletteError,
  onExtractPaletteFromImage,
  onUpdateItem,
  onRenameBoard,
}) {
  const canExtract = selectedItem?.type === "image";

  return (
    <aside className="relative z-30 min-w-0">
      <div className={cx(ui.panel, ui.panelInner, "w-[320px]")}>
        <div>
          <div className={ui.panelTitle}>Properties</div>
          <div className={ui.panelMuted}>Edit selection.</div>
        </div>

        <div className="mt-4">
          <div className={ui.sectionTitle}>Selection</div>

          <div className="mt-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/12">
            <div className="text-sm font-semibold text-white">
              {selectedItem ? selectedItem.type : "None"}
            </div>
            <div className="mt-1 text-xs text-white/55">
              {selectedItem ? selectedItem.id : "Click an item on the canvas"}
            </div>

            {/* NOTE */}
            {selectedItem?.type === "note" && (
              <div className="mt-4 space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-white/45">
                  Title
                </label>
                <input
                  value={selectedItem.title || ""}
                  onChange={(e) =>
                    onUpdateItem?.(selectedItem.id, { title: e.target.value })
                  }
                  className={ui.input}
                  placeholder="Note title"
                />

                <label className="text-[11px] uppercase tracking-wider text-white/45">
                  Body
                </label>
                <textarea
                  value={selectedItem.body || ""}
                  onChange={(e) =>
                    onUpdateItem?.(selectedItem.id, { body: e.target.value })
                  }
                  className={cx(ui.input, "min-h-[120px] resize-none")}
                  placeholder="Write…"
                />
              </div>
            )}

            {/* TYPOGRAPHY */}
            {selectedItem?.type === "typography" && (
              <div className="mt-4 space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-white/45">
                  Title
                </label>
                <input
                  value={selectedItem.title || ""}
                  onChange={(e) =>
                    onUpdateItem?.(selectedItem.id, { title: e.target.value })
                  }
                  className={ui.input}
                  placeholder="Heading"
                />

                <label className="text-[11px] uppercase tracking-wider text-white/45">
                  Body
                </label>
                <textarea
                  value={selectedItem.body || ""}
                  onChange={(e) =>
                    onUpdateItem?.(selectedItem.id, { body: e.target.value })
                  }
                  className={cx(ui.input, "min-h-[120px] resize-none")}
                  placeholder="Sample text…"
                />
              </div>
            )}

            {/* PALETTE */}
            {selectedItem?.type === "palette" && (
              <div className="mt-4 space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-white/45">
                  Name
                </label>
                <input
                  value={selectedItem.name || ""}
                  onChange={(e) =>
                    onUpdateItem?.(selectedItem.id, { name: e.target.value })
                  }
                  className={ui.input}
                  placeholder="Palette name"
                />
              </div>
            )}

            {/* IMAGE EXTRACT */}
            {canExtract && (
              <button
                onClick={() => onExtractPaletteFromImage(selectedItem)}
                className={cx(ui.btn, ui.btnNeon, "mt-4 w-full")}
                type="button"
              >
                🎨 Extract palette
              </button>
            )}

            {paletteStatus === "error" && (
              <div className="mt-3 rounded-2xl bg-rose-500/15 p-3 text-xs text-rose-100 ring-1 ring-rose-400/30">
                {paletteError || "Palette error."}
              </div>
            )}
          </div>

          {/* TRANSFORM */}
          {selectedItem && (
            <div className="mt-4 rounded-2xl bg-white/6 p-3 ring-1 ring-white/10">
              <div className={ui.sectionTitle}>Transform</div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <FieldNumber
                  label="X"
                  value={selectedItem.x ?? 0}
                  onChange={(v) => onUpdateItem?.(selectedItem.id, { x: v })}
                />
                <FieldNumber
                  label="Y"
                  value={selectedItem.y ?? 0}
                  onChange={(v) => onUpdateItem?.(selectedItem.id, { y: v })}
                />
                <FieldNumber
                  label="W"
                  value={selectedItem.w ?? 320}
                  onChange={(v) => onUpdateItem?.(selectedItem.id, { w: v })}
                />
                <FieldNumber
                  label="H"
                  value={selectedItem.h ?? 200}
                  onChange={(v) => onUpdateItem?.(selectedItem.id, { h: v })}
                />
              </div>

              <div className="mt-3">
                <FieldRange
                  label={`Rotation (${Number(selectedItem.rotation || 0)}°)`}
                  value={Number(selectedItem.rotation || 0)}
                  min={-180}
                  max={180}
                  step={1}
                  onChange={(v) =>
                    onUpdateItem?.(selectedItem.id, { rotation: v })
                  }
                />
              </div>

              <div className="mt-3">
                <FieldRange
                  label={`Opacity (${Math.round(
                    Number(selectedItem.opacity ?? 1) * 100,
                  )}%)`}
                  value={Number(selectedItem.opacity ?? 1)}
                  min={0.1}
                  max={1}
                  step={0.01}
                  onChange={(v) =>
                    onUpdateItem?.(selectedItem.id, { opacity: v })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className={ui.hr} />

        <div className="mt-4">
          <div className={ui.sectionTitle}>Board</div>
          <div className="mt-3 rounded-2xl bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/12">
            {boardTitle || "Untitled"}
          </div>
        </div>

        <details className="mt-4 rounded-2xl bg-white/6 p-3 ring-1 ring-white/10">
          <summary className="cursor-pointer text-xs font-semibold text-white/70">
            Debug details
          </summary>
          <pre className="mt-2 max-h-[34dvh] overflow-auto rounded-xl bg-black/30 p-3 text-xs text-white/75 ring-1 ring-white/10">
            {selectedItem
              ? JSON.stringify(selectedItem, null, 2)
              : "No selection"}
          </pre>
        </details>

        {/* Board */}
        <div className="mt-4">
          <div className={ui.sectionTitle}>Board</div>

          <input
            value={boardTitle || ""}
            onChange={(e) => onRenameBoard?.(e.target.value)}
            className={cx(ui.input, "mt-3")}
            placeholder="Untitled"
          />
        </div>
      </div>
    </aside>
  );
}

function FieldNumber({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-wider text-white/45">
        {label}
      </div>
      <input
        type="number"
        value={Number(value)}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={ui.input}
      />
    </label>
  );
}

function FieldRange({ label, value, min, max, step, onChange }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-wider text-white/45">
        {label}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number(value)}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
}
