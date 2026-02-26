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
      {/* largeur fixée pour matcher le visuel */}
      <div className={cx(ui.panel, "p-4 w-[320px] max-w-[320px]")}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xl font-semibold text-white">Command</div>
            <div className="mt-1 text-xs text-white/55">
              Tools • Type • Images
            </div>
          </div>

          <button
            onClick={onRandomScene}
            className={cx(ui.btn, ui.btnSoft, "p-2")}
            type="button"
            title="Random scene"
          >
            <Shuffle size={16} />
          </button>
        </div>

        {/* Tabs (comme le visuel) */}
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
                <span className="text-xs text-white/45">
                  {Array.isArray(scenes) ? scenes.length : 0}
                </span>
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

              <div className="pt-1">
                <div className="h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/12 shadow-[0_0_40px_rgba(255,45,178,.5)]" />
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
      <div className="h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/12 flex items-center justify-center text-white">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{label}</div>
        <div className="text-xs text-white/55">{hint}</div>
      </div>

      <div
        className={cx(
          "h-8 w-8 rounded-full ring-1 flex items-center justify-center",
          accent
            ? "ring-white/20 bg-[conic-gradient(from_210deg,#ff2db2,#00d9ff,#b7ff00,#ffcc00,#ff2db2)]"
            : "ring-white/12 bg-white/10",
        )}
        aria-hidden="true"
      >
        <ChevronRight size={14} className="text-white/60" />
      </div>
    </button>
  );
}

function SceneThumb({ scene, active, onClick }) {
  const p = scene?.palette ?? {};
  const a = p.pink ?? p.a ?? "#ff2db2";
  const b = p.cyan ?? p.b ?? "#00d9ff";
  const d = p.yellow ?? p.d ?? "#ffcc00";
  const bg = p.bg ?? "#070816";

  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-2xl p-2 text-left ring-1 transition",
        active
          ? "ring-white/30 bg-white/12"
          : "ring-white/12 bg-white/6 hover:bg-white/10",
      )}
      type="button"
    >
      <div
        className="h-14 w-full rounded-xl ring-1 ring-white/12"
        style={{
          background: `
            radial-gradient(circle at 25% 35%, ${a}, transparent 60%),
            radial-gradient(circle at 70% 45%, ${b}, transparent 62%),
            radial-gradient(circle at 45% 85%, ${d}, transparent 65%),
            linear-gradient(135deg, ${bg}, ${bg})
          `,
        }}
      />
      <div className="mt-2 text-xs font-semibold text-white/85 truncate">
        {scene.name}
      </div>
    </button>
  );
}

function StatusLine({ status, error }) {
  if (status === "loading")
    return <div className="mt-2 text-xs text-white/55">Loading…</div>;
  if (status === "error")
    return (
      <div className="mt-2 text-xs text-rose-200">{error || "Error."}</div>
    );
  return null;
}
