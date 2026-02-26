import { useCallback, useEffect, useMemo, useState } from "react";

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

function makeEmptyBoard() {
  return {
    id: uid(),
    title: "Untitled",
    items: [
      {
        id: "note-1",
        type: "note",
        x: 70,
        y: 70,
        w: 320,
        h: 190,
        z: 1,
        rotation: 0,
        title: "Welcome to HueBoard",
        body: "Next: add shapes, type, images…",
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

const STORAGE_KEY = "hueboards.v1";

export function useBoards() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.boards?.length) return parsed;
      }
    } catch {
      //
    }
    const first = makeEmptyBoard();
    return { activeId: first.id, boards: [first] };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      //
    }
  }, [state]);

  const boards = state.boards;

  const activeBoard = useMemo(() => {
    return boards.find((b) => b.id === state.activeId) || boards[0] || null;
  }, [boards, state.activeId]);

  const setActiveId = useCallback((id) => {
    setState((prev) => ({ ...prev, activeId: id }));
  }, []);

  const updateBoard = useCallback((id, patchOrFn) => {
    setState((prev) => ({
      ...prev,
      boards: prev.boards.map((b) => {
        if (b.id !== id) return b;

        const next =
          typeof patchOrFn === "function"
            ? patchOrFn(b)
            : { ...b, ...patchOrFn };

        return { ...next, updatedAt: Date.now() };
      }),
    }));
  }, []);

  const createBoard = useCallback(() => {
    const b = makeEmptyBoard(); // ✅ NEW CLEAN BOARD
    setState((prev) => ({
      ...prev,
      activeId: b.id,
      boards: [b, ...prev.boards],
    }));
    return b.id;
  }, []);

  const deleteBoard = useCallback((id) => {
    setState((prev) => {
      const nextBoards = prev.boards.filter((b) => b.id !== id);
      const fallback = nextBoards[0] || makeEmptyBoard();
      return {
        activeId: prev.activeId === id ? fallback.id : prev.activeId,
        boards: nextBoards.length ? nextBoards : [fallback],
      };
    });
  }, []);

  return {
    boards,
    activeId: state.activeId,
    activeBoard,
    setActiveId,
    updateBoard,
    createBoard,
    deleteBoard,
  };
}
