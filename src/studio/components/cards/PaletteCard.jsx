function copyToClipboard(text) {
  try {
    navigator.clipboard?.writeText(text);
  } catch {
    // ok, pas grave si le navigateur bloque
  }
}

export default function PaletteCard({ item }) {
  const colors = (item.colors || []).slice(0, 6);
  const title = item.name || "Untitled palette";

  return (
    <div className="h-full">
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-white/45">
            Palette
          </div>
          <div className="mt-0.5 text-sm font-semibold text-white/85 truncate">
            {title}
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/80 ring-1 ring-white/12 hover:bg-white/14"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => copyToClipboard(colors.join(", "))}
          title="Copy colors"
        >
          Copy
        </button>
      </div>

      {/* Swatches */}
      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/12">
        <div className="flex">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className="group relative h-14 flex-1"
              style={{ background: c }}
              title={`Copy ${c}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => copyToClipboard(c)}
            >
              {/* glossy highlight */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-0 bg-linear-to-b from-white/35 via-white/0 to-black/10" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => copyToClipboard(c)}
            className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs text-white/75 ring-1 ring-white/12 hover:bg-white/12"
            title={`Copy ${c}`}
          >
            <span
              className="h-3 w-3 rounded-full ring-1 ring-white/20"
              style={{ background: c }}
            />
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
