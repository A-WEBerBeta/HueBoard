import { useMemo, useRef, useState } from "react";
import { ensureFontLoaded } from "../utils/fonts";

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

// ✅ board vient de useBoards, updateBoard = (fn(board)=>nextBoard) ou patch
export function useBoard(board, updateBoard) {
  const [selectedId, setSelectedId] = useState(null);

  const [paletteStatus, setPaletteStatus] = useState("idle");
  const [paletteError, setPaletteError] = useState("");

  const lastDeltaRef = useRef({ x: 0, y: 0 });

  const items = board?.items ?? [];

  const selectedItem = useMemo(() => {
    return items.find((it) => it.id === selectedId) ?? null;
  }, [items, selectedId]);

  // --- core patch ---
  function patchItems(fn) {
    updateBoard((prev) => ({
      ...prev,
      items: fn(prev.items || []),
    }));
  }

  function updateItem(id, patch) {
    patchItems((arr) =>
      arr.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  }

  function bringToFront(id) {
    patchItems((arr) => {
      const maxZ = arr.reduce((m, it) => Math.max(m, it.z ?? 0), 0);
      return arr.map((it) => (it.id === id ? { ...it, z: maxZ + 1 } : it));
    });
  }

  function sendToBack(id) {
    patchItems((arr) => {
      const minZ = arr.reduce((m, it) => Math.min(m, it.z ?? 0), 0);
      return arr.map((it) => (it.id === id ? { ...it, z: minZ - 1 } : it));
    });
  }

  function moveItemBy(id, dx, dy) {
    patchItems((arr) =>
      arr.map((it) =>
        it.id === id ? { ...it, x: it.x + dx, y: it.y + dy } : it,
      ),
    );
  }

  // --- add items ---
  function addNote() {
    const newItem = {
      id: uid(),
      type: "note",
      x: 120,
      y: 120,
      w: 320,
      h: 190,
      z: nextZ(items),
      rotation: 0,
      title: "New note",
      body: "Type something…",
    };
    patchItems((arr) => [...arr, newItem]);
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
      x: 120,
      y: 120,
      w: kind === "stripe" ? 560 : 380,
      h: kind === "stripe" ? 240 : 380,
      z: nextZ(items),
      rotation: 0,
      opacity: 0.3,
      fill: { kind: "gradient", from: g.from, via: g.via, to: g.to },
    };

    patchItems((arr) => [...arr, newItem]);
    setSelectedId(newItem.id);
  }

  function addTypography(font) {
    ensureFontLoaded(font.family);
    const newItem = {
      id: uid(),
      type: "typography",
      x: 120,
      y: 120,
      w: 440,
      h: 230,
      z: nextZ(items),
      rotation: 0,
      family: font.family,
      category: font.category,
      title: "Design with type",
      body: "Sphinx of black quartz, judge my vow.",
    };
    patchItems((arr) => [...arr, newItem]);
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
      x: 120,
      y: 120,
      w,
      h,
      z: nextZ(items),
      rotation: 0,
      url: photo.urls?.regular || photo.urls?.small,
      thumb: photo.urls?.small || photo.urls?.thumb,
      alt: photo.alt_description || photo.description || "Unsplash photo",
      authorName: photo.user?.name || "Unknown",
      authorUrl: photo.user?.links?.html || "",
      photoUrl: photo.links?.html || "",
      source: "Unsplash",
    };

    patchItems((arr) => [...arr, newItem]);
    setSelectedId(newItem.id);
  }

  async function generatePalette() {
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
        x: 120,
        y: 120,
        w: 520,
        h: 190,
        z: nextZ(items),
        rotation: 0,
        name: `${mode} • #${seed.toUpperCase()}`,
        colors,
      };

      patchItems((arr) => [...arr, newItem]);
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
        h: 190,
        z: nextZ(items),
        rotation: 0,
        name: `From image • ${imgItem.source || "photo"}`,
        colors,
      };

      patchItems((arr) => [...arr, newItem]);
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

  // --- drag ---
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
    if (!dx && !dy) return;
    moveItemBy(id, dx, dy);
    lastDeltaRef.current = { x: evt.delta.x, y: evt.delta.y };
  }

  function handleDragEnd() {
    lastDeltaRef.current = { x: 0, y: 0 };
  }

  // --- actions ---
  function deleteSelected() {
    if (!selectedId) return;
    patchItems((arr) => arr.filter((it) => it.id !== selectedId));
    setSelectedId(null);
  }

  function duplicateSelected() {
    if (!selectedId) return;
    const base = items.find((it) => it.id === selectedId);
    if (!base) return;

    const copy = {
      ...base,
      id: uid(),
      x: base.x + 24,
      y: base.y + 24,
      z: nextZ(items),
    };

    patchItems((arr) => [...arr, copy]);
    setSelectedId(copy.id);
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
