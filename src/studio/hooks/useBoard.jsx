import { useMemo, useRef, useState } from "react";
import { ensureFontLoaded } from "../utils/fonts";

const initialBoard = {
  title: "Untitled",
  items: [
    {
      id: "shape-1",
      type: "shape",
      kind: "circle",
      x: 50,
      y: 250,
      w: 380,
      h: 380,
      z: 0,
      rotation: 0,
      opacity: 0.35,
      fill: {
        kind: "gradient",
        from: "#22c55e",
        via: "#38bdf8",
        to: "#a855f7",
      },
    },
    {
      id: "note-1",
      type: "note",
      x: 70,
      y: 70,
      w: 320,
      h: 190,
      z: 2,
      title: "Welcome to HueBoard",
      body: "Next: search images + extract palette from an image (coherent).",
    },
  ],
};

const Z_BASE = 10;

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nextZ(items) {
  return items.reduce((m, it) => Math.max(m, it.z ?? 0), 0) + 1;
}

function rgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function randomHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return n.toString(16).padStart(6, "0");
}

export function useBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedId, setSelectedId] = useState(null);

  // palette UI feedback
  const [paletteStatus, setPaletteStatus] = useState("idle");
  const [paletteError, setPaletteError] = useState("");

  // Drag smoothness: track delta progression
  const lastDeltaRef = useRef({ x: 0, y: 0 });

  const selectedItem = useMemo(() => {
    return board.items.find((it) => it.id === selectedId) ?? null;
  }, [board.items, selectedId]);

  // ---------- internal helpers ----------
  function bringToFront(id) {
    setBoard((prev) => {
      const maxZ = prev.items.reduce(
        (m, it) => Math.max(m, it.z ?? Z_BASE),
        Z_BASE,
      );
      return {
        ...prev,
        items: prev.items.map((it) =>
          it.id === id ? { ...it, z: maxZ + 1 } : it,
        ),
      };
    });
  }

  function sendToBack(id) {
    setBoard((prev) => {
      const minZ = prev.items.reduce(
        (m, it) => Math.min(m, it.z ?? Z_BASE),
        Infinity,
      );
      const nextZ = Math.max(Z_BASE, (minZ === Infinity ? Z_BASE : minZ) - 1);

      return {
        ...prev,
        items: prev.items.map((it) =>
          it.id === id ? { ...it, z: nextZ } : it,
        ),
      };
    });
  }

  function moveItemBy(id, dx, dy) {
    setBoard((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id
          ? { ...it, x: (Number(it.x) || 0) + dx, y: (Number(it.y) || 0) + dy }
          : it,
      ),
    }));
  }

  // ---------- public actions ----------
  function addNote() {
    const newItem = {
      id: uid(),
      type: "note",
      x: 90 + Math.random() * 260,
      y: 90 + Math.random() * 220,
      w: 320,
      h: 190,
      z: nextZ(board.items),
      title: "New note",
      body: "Type something...",
    };
    setBoard((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setSelectedId(newItem.id);
  }

  function addShape() {
    const kind = pick(["circle", "triangle", "stripe"]);
    const gradients = [
      { from: "#F472B6", via: "#38BDF8", to: "#A3E635" },
      { from: "#FB7185", via: "#FBBF24", to: "#34D399" },
      { from: "#A78BFA", via: "#22D3EE", to: "#FDE047" },
    ];
    const g = pick(gradients);

    const newItem = {
      id: uid(),
      type: "shape",
      kind,
      x: 40 + Math.random() * 280,
      y: 80 + Math.random() * 280,
      w: kind === "stripe" ? 560 : 380,
      h: kind === "stripe" ? 240 : 380,
      z: nextZ(board.items),
      rotation: -18 + Math.random() * 36,
      opacity: 0.25 + Math.random() * 0.2,
      fill: { kind: "gradient", from: g.from, via: g.via, to: g.to },
    };

    setBoard((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setSelectedId(newItem.id);
  }

  function addTypography(font) {
    ensureFontLoaded(font.family);

    const newItem = {
      id: uid(),
      type: "typography",
      x: 120 + Math.random() * 240,
      y: 120 + Math.random() * 220,
      w: 440,
      h: 230,
      z: nextZ(board.items),
      family: font.family,
      category: font.category,
      title: "Design with type",
      body: "Sphinx of black quartz, judge my vow.",
    };

    setBoard((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setSelectedId(newItem.id);
  }

  function addImage(photo) {
    const w = 520;
    const ratio =
      photo.width && photo.height ? photo.height / photo.width : 0.75;
    const h = Math.max(240, Math.min(520, Math.round(w * ratio)));

    const newItem = {
      id: uid(),
      type: "image",
      x: 110 + Math.random() * 240,
      y: 110 + Math.random() * 220,
      w,
      h,
      z: nextZ(board.items),
      url: photo.urls?.regular || photo.urls?.small,
      thumb: photo.urls?.small || photo.urls?.thumb,
      alt: photo.alt_description || photo.description || "Unsplash photo",
      authorName: photo.user?.name || "Unknown",
      authorUrl: photo.user?.links?.html || "",
      photoUrl: photo.links?.html || "",
      source: "Unsplash",
    };

    setBoard((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setSelectedId(newItem.id);
  }

  async function generatePalette() {
    // modes plus "design-friendly"
    const modes = ["analogic", "monochrome", "monochrome-dark", "complement"];
    const mode = pick(modes);
    const seed = randomHex();

    try {
      setPaletteStatus("loading");
      setPaletteError("");

      const url = `https://www.thecolorapi.com/scheme?hex=${seed}&mode=${mode}&count=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Color API error: ${res.status}`);

      const data = await res.json();
      const colors = (data.colors || [])
        .map((c) => c?.hex?.value)
        .filter(Boolean);

      const newItem = {
        id: uid(),
        type: "palette",
        x: 120 + Math.random() * 240,
        y: 120 + Math.random() * 220,
        w: 520,
        h: 200,
        z: nextZ(board.items),
        name: `${mode} • #${seed.toUpperCase()}`,
        colors,
      };

      setBoard((prev) => ({ ...prev, items: [...prev.items, newItem] }));
      setSelectedId(newItem.id);
      setPaletteStatus("success");
    } catch (e) {
      setPaletteStatus("error");
      setPaletteError(e?.message ?? "Palette API failed.");
    }
  }

  async function extractPaletteFromImage(imgItem) {
    try {
      setPaletteStatus("loading");
      setPaletteError("");

      const ColorThief = (await import("colorthief")).default;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgItem.thumb || imgItem.url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const thief = new ColorThief();
      const paletteRgb = thief.getPalette(img, 5);
      const colors = paletteRgb.map(([r, g, b]) => rgbToHex(r, g, b));

      const newItem = {
        id: uid(),
        type: "palette",
        x: imgItem.x + 40,
        y: imgItem.y + imgItem.h + 20,
        w: 520,
        h: 200,
        z: nextZ(board.items),
        name: `From image • ${imgItem.source || "photo"}`,
        colors,
      };

      setBoard((prev) => ({ ...prev, items: [...prev.items, newItem] }));
      setSelectedId(newItem.id);
      setPaletteStatus("success");
    } catch (e) {
      setPaletteStatus("error");
      setPaletteError(
        e?.message ||
          "Could not extract palette (sometimes CORS blocks it). Try another image.",
      );
    }
  }

  function updateItem(id, patch) {
    setBoard((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  }

  // ---------- drag handlers for Canvas ----------
  function handleDragStart(evt) {
    const id = String(evt.active.id);
    setSelectedId(id);
    bringToFront(id);
    lastDeltaRef.current = { x: 0, y: 0 };
  }

  function handleDragMove(evt) {
    const id = String(evt.active.id);
    const dx = evt.delta.x - lastDeltaRef.current.x;
    const dy = evt.delta.y - lastDeltaRef.current.y;
    if (dx === 0 && dy === 0) return;
    moveItemBy(id, dx, dy);
    lastDeltaRef.current = { x: evt.delta.x, y: evt.delta.y };
  }

  function handleDragEnd() {
    lastDeltaRef.current = { x: 0, y: 0 };
  }

  // --------- Actions -----------
  function deleteSelected() {
    if (!selectedId) return;
    setBoard((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== selectedId),
    }));
    setSelectedId(null);
  }

  function duplicateSelected() {
    if (!selectedId) return;

    setBoard((prev) => {
      const base = prev.items.find((it) => it.id === selectedId);
      if (!base) return prev;

      const copy = {
        ...base,
        id: uid(),
        x: base.x + 24,
        y: base.y + 24,
        z: nextZ(prev.items),
      };

      // Important : on met aussi la sélection à jour ici
      setSelectedId(copy.id);

      return { ...prev, items: [...prev.items, copy] };
    });
  }

  function bringSelectedToFront() {
    if (!selectedId) return;
    bringToFront(selectedId);
  }

  function sendSelectedToBack() {
    if (!selectedId) return;
    sendToBack(selectedId);
  }

  return {
    board,
    setBoard,

    selectedId,
    setSelectedId,
    selectedItem,

    paletteStatus,
    paletteError,

    addNote,
    addShape,
    addTypography,
    addImage,
    generatePalette,
    extractPaletteFromImage,
    updateItem,

    handleDragStart,
    handleDragMove,
    handleDragEnd,

    deleteSelected,
    duplicateSelected,
    bringSelectedToFront,
    sendSelectedToBack,
  };
}
