import {
  ChevronRight,
  Image as ImageIcon,
  Palette,
  Shapes,
  Shuffle,
  StickyNote,
  Type,
  Wrench,
} from "lucide-react";
import { cx, ui } from "../ui/ui";

export default function Sidebar({
  panel = "tools",
  setPanel = () => {},

  scenes = [],
  sceneId = "",
  setSceneId = () => {},
  onRandomScene = () => {},

  onGeneratePalette = () => {},
  onAddShape = () => {},
  onAddNote = () => {},

  onLoadFonts = () => {},
  fontsStatus = "idle",
  fontsError = "",
  fontQuery = "",
  setFontQuery = () => {},
  filteredFonts = [],
  onAddTypography = () => {},

  imgQuery = "",
  setImgQuery = () => {},
  onSearchUnsplash = () => {},
  imgStatus = "idle",
  imgError = "",
  images = [],
  onAddImage = () => {},
  onLoadMoreImages = () => {},
}) {
  const safePanel =
    panel === "tools" || panel === "typography" || panel === "images"
      ? panel
      : "tools";

  return (
    <aside className="relative z-30 min-w-0">
      <div className={cx(ui.panel, "p-4 w-[320px] max-w-[320px]")}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xl font-semibold text-white">Command</div>
            <div className="mt-1 text-xs text-white/55">
              Tools • Type • Images
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={cx(ui.tabs, "mt-4")}>
          <button
            type="button"
            className={safePanel === "tools" ? ui.tabActive : ui.tab}
            onClick={() => setPanel("tools")}
          >
            <span className="inline-flex items-center gap-2">
              <Wrench size={14} /> Tools
            </span>
          </button>

          <button
            type="button"
            className={safePanel === "typography" ? ui.tabActive : ui.tab}
            onClick={() => setPanel("typography")}
          >
            <span className="inline-flex items-center gap-2">
              <Type size={14} /> Type
            </span>
          </button>

          <button
            type="button"
            className={safePanel === "images" ? ui.tabActive : ui.tab}
            onClick={() => setPanel("images")}
          >
            <span className="inline-flex items-center gap-2">
              <ImageIcon size={14} /> Images
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          {safePanel === "tools" && (
            <>
              <SectionTitle>CORE ACTIONS</SectionTitle>

              <div className="space-y-2">
                <ActionRow
                  icon={<Palette size={18} />}
                  label="Generate palette"
                  hint="Coherent 5 colors"
                  onClick={onGeneratePalette}
                  accent
                />

                <ActionRow
                  icon={<Shapes size={18} />}
                  label="Add shape"
                  hint="Circle / triangle / stripe"
                  onClick={onAddShape}
                />

                <ActionRow
                  icon={<StickyNote size={18} />}
                  label="Add note"
                  hint="Ideas & annotations"
                  onClick={onAddNote}
                />
              </div>

              <div className={ui.hr} />

              <div className="flex items-center justify-between">
                <SectionTitle>SCENES</SectionTitle>

                <button
                  onClick={onRandomScene}
                  className={cx(ui.btn, ui.btnSoft, "px-3 py-1.5")}
                  type="button"
                  title="Random scene"
                >
                  <span className="inline-flex items-center gap-2">
                    <Shuffle size={14} />
                    Random
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(Array.isArray(scenes) ? scenes : []).map((s) => (
                  <SceneThumb
                    key={s.id}
                    scene={s}
                    active={s.id === sceneId}
                    onClick={() => setSceneId(s.id)}
                  />
                ))}
              </div>
            </>
          )}

          {safePanel === "typography" && (
            <>
              <div className="flex items-center justify-between">
                <SectionTitle>GOOGLE FONTS</SectionTitle>

                <button
                  className={cx(ui.btn, ui.btnInk, "py-1.5")}
                  onClick={onLoadFonts}
                  type="button"
                >
                  Load
                </button>
              </div>

              <input
                value={fontQuery}
                onChange={(e) => setFontQuery(e.target.value)}
                placeholder="Search fonts…"
                className={ui.input}
              />

              <StatusLine status={fontsStatus} error={fontsError} />

              {fontsStatus === "success" && (
                <div className="max-h-[54vh] overflow-auto space-y-2 pr-1">
                  {filteredFonts.map((f) => (
                    <button
                      key={f.family}
                      onClick={() => onAddTypography(f)}
                      className="w-full rounded-2xl bg-white/8 px-3 py-2 text-left ring-1 ring-white/12 hover:bg-white/12"
                      type="button"
                    >
                      <div className="text-sm font-semibold text-white truncate">
                        {f.family}
                      </div>
                      <div className="text-xs text-white/55">{f.category}</div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {safePanel === "images" && (
            <>
              <SectionTitle>UNSPLASH</SectionTitle>

              <div className="flex gap-2">
                <input
                  value={imgQuery}
                  onChange={(e) => setImgQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearchUnsplash()}
                  placeholder='Try: "memphis", "bauhaus", "neon"'
                  className={ui.input}
                />

                <button
                  className={cx(ui.btn, ui.btnInk)}
                  onClick={onSearchUnsplash}
                  type="button"
                >
                  Go
                </button>
              </div>

              <StatusLine status={imgStatus} error={imgError} />

              {imgStatus === "success" && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onAddImage(p)}
                        className="group overflow-hidden rounded-2xl bg-white/8 ring-1 ring-white/12 hover:bg-white/12"
                        title="Add to board"
                        type="button"
                      >
                        <img
                          src={p.urls?.small}
                          alt={p.alt_description || "Unsplash"}
                          className="h-24 w-full object-cover transition group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    className={cx(ui.btn, ui.btnSoft, "w-full")}
                    onClick={onLoadMoreImages}
                    type="button"
                  >
                    Load more
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/55">
      {children}
    </div>
  );
}

function ActionRow({ icon, label, hint, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "w-full rounded-2xl p-3 text-left ring-1 transition",
        "flex items-center gap-3",
        accent
          ? "bg-white/14 ring-white/20 shadow-[0_12px_30px_rgba(0,0,0,.35)] hover:bg-white/16"
          : "bg-white/8 ring-white/12 hover:bg-white/12",
      )}
      type="button"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/12">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white">{label}</div>
        <div className="text-xs text-white/55">{hint}</div>
      </div>

      <div
        className={cx(
          "flex h-8 w-8 items-center justify-center rounded-full ring-1",
          accent
            ? "ring-white/20 bg-[conic-gradient(from_210deg,#ff2db2,#00d9ff,#b7ff00,#ffcc00,#ff2db2)]"
            : "bg-white/10 ring-white/12",
        )}
        aria-hidden="true"
      >
        <ChevronRight size={14} className="text-white/60" />
      </div>
    </button>
  );
}

function SceneThumb({ scene, active, onClick }) {
  const isDots = scene.type === "dots";
  const isGrid = scene.type === "grid";

  return (
    <button
      onClick={onClick}
      className={cx(
        "overflow-hidden rounded-2xl text-left ring-1 transition",
        active
          ? "bg-white/12 ring-white/30"
          : "bg-white/6 ring-white/12 hover:bg-white/10 hover:ring-white/20",
      )}
      type="button"
      title={scene.name}
    >
      <div className="relative h-20 w-full overflow-hidden rounded-xl">
        {scene.image && (
          <img
            src={scene.image}
            alt={scene.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}

        {isDots && (
          <div
            className="absolute inset-0 bg-[#0c0d12]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
        )}

        {isGrid && (
          <div
            className="absolute inset-0 bg-[#0c0d12]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "18px 18px",
            }}
          />
        )}
      </div>

      <div className="px-2 py-2">
        <div className="truncate text-xs font-semibold text-white/85">
          {scene.name}
        </div>
      </div>
    </button>
  );
}

function StatusLine({ status, error }) {
  if (status === "loading") {
    return <div className="mt-2 text-xs text-white/55">Loading…</div>;
  }

  if (status === "error") {
    return (
      <div className="mt-2 text-xs text-rose-200">{error || "Error."}</div>
    );
  }

  return null;
}
