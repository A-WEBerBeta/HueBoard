import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function BoardSwitcher({ boardsApi, onBeforeSwitch }) {
  const {
    boards,
    activeId,
    activeBoard,
    setActiveId,
    createBoard,
    deleteBoard,
    updateBoard,
  } = boardsApi;

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  const title = activeBoard?.title || "Untitled";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center gap-2 rounded-full
          bg-black/40 px-3 py-2 text-sm text-white/90
          shadow-[0_18px_50px_rgba(0,0,0,.55)]
          backdrop-blur-xl
          hover:bg-black/50 transition
        "
        title="Boards"
      >
        <span className="max-w-[220px] truncate">{title}</span>
        <ChevronDown size={16} className="text-white/65" />
      </button>

      {open && (
        <div
          className="
            absolute left-0 mt-2 w-[340px] rounded-3xl
            bg-black/95 p-2
            backdrop-blur-xl
            shadow-[0_40px_120px_rgba(0,0,0,.85)]
            z-50
          "
        >
          <div className="px-2 py-2 text-[11px] uppercase tracking-[0.18em] text-white/55">
            Boards
          </div>

          <div className="max-h-[40dvh] overflow-auto pr-1 space-y-1">
            {boards.map((b) => {
              const isActive = b.id === activeId;

              return (
                <div
                  key={b.id}
                  className={[
                    "group flex items-center gap-2 rounded-2xl px-3 py-2 transition",
                    "ring-1 ring-white/8",
                    isActive ? "bg-white/14" : "bg-white/8 hover:bg-white/12",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => {
                      if (b.id === activeId) return setOpen(false);
                      onBeforeSwitch?.();
                      setActiveId(b.id);
                      setOpen(false);
                    }}
                    title="Open board"
                  >
                    <div className="truncate text-sm font-semibold text-white/90">
                      {b.title || "Untitled"}
                    </div>
                    <div className="text-[11px] text-white/50">
                      {b.items?.length ?? 0} items
                    </div>
                  </button>

                  <button
                    type="button"
                    className="
                      hidden group-hover:inline-flex
                      rounded-xl bg-white/8 px-2 py-1 text-[11px]
                      text-white/75 hover:bg-white/12 transition
                    "
                    onClick={() => {
                      const next = prompt(
                        "Rename board:",
                        b.title || "Untitled",
                      );
                      if (next == null) return;
                      updateBoard(b.id, { title: next });
                    }}
                    title="Rename"
                  >
                    Rename
                  </button>

                  <button
                    type="button"
                    className="
                      inline-flex items-center justify-center
                      rounded-xl bg-rose-500/15 p-2
                      hover:bg-rose-500/25 text-rose-100 transition
                      disabled:opacity-40
                    "
                    disabled={boards.length <= 1}
                    onClick={() => {
                      if (boards.length <= 1) return;
                      const ok = confirm("Delete this board?");
                      if (!ok) return;
                      onBeforeSwitch?.();
                      deleteBoard(b.id);
                    }}
                    title="Delete board"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-2 px-2 pb-1">
            <button
              type="button"
              className="
                w-full inline-flex items-center justify-center gap-2
                rounded-2xl bg-white/10 px-3 py-2
                text-sm font-semibold text-white
                hover:bg-white/14 transition
              "
              onClick={() => {
                onBeforeSwitch?.();
                createBoard(); // ✅ board clean côté useBoards
                setOpen(false);
              }}
              title="New board"
            >
              <Plus size={16} />
              New board
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
