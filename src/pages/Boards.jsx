import { useNavigate } from "react-router-dom";
import { useBoards } from "../studio/hooks/useBoards";
import { ui } from "../studio/ui/ui";

export default function Boards() {
  const nav = useNavigate();
  const { boardsArray, createBoard, deleteBoard, duplicateBoard, renameBoard } =
    useBoards();

  return (
    <div className={ui.appBg}>
      <header className={ui.header}>
        <div className={ui.headerInner}>
          <div className="text-white font-semibold">HueBoard</div>

          <button
            className={ui.btnShare + " rounded-full px-5 py-2 font-semibold"}
            onClick={() => {
              const newId = createBoard();
              nav(`/studio/${newId}`);
            }}
            type="button"
          >
            New Board
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-none px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {boardsArray.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl bg-white/8 ring-1 ring-white/12 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-4"
            >
              <input
                value={b.title || ""}
                onChange={(e) => renameBoard(b.id, e.target.value)}
                className="w-full bg-transparent text-white/90 font-semibold outline-none"
                placeholder="Untitled"
              />

              <div className="mt-2 text-xs text-white/55">
                {b.items?.length || 0} items
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className={ui.btnSoft + " rounded-xl px-3 py-2 text-white/80"}
                  onClick={() => nav(`/studio/${b.id}`)}
                  type="button"
                >
                  Open
                </button>

                <button
                  className={
                    ui.btnGhost + " rounded-xl px-3 py-2 text-white/80"
                  }
                  onClick={() => {
                    const newId = duplicateBoard(b.id);
                    nav(`/studio/${newId}`); // ✅ FIX
                  }}
                  type="button"
                >
                  Duplicate
                </button>

                <button
                  className="rounded-xl px-3 py-2 text-white/80 ring-1 ring-rose-400/30 bg-rose-500/15 hover:bg-rose-500/25"
                  onClick={() => deleteBoard(b.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
