import { useDraggable } from "@dnd-kit/core";
import { useCallback, useMemo } from "react";

import ImageCard from "./cards/ImageCard";
import NoteCard from "./cards/NoteCard";
import PaletteCard from "./cards/PaletteCard";
import ShapeCard from "./cards/ShapeCard";
import TypographyCard from "./cards/TypographyCard";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function BoardItemView({
  item,
  isSelected,
  onSelect,
  onUpdateItem,
}) {
  const isShape = item.type === "shape";

  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: item.id,
  });

  const rotation = Number(item.rotation || 0);

  // OUTER: must be overflow-visible so rotate handle (top -9) isn't clipped
  const outerClassName = useMemo(() => {
    const base = "absolute select-none overflow-visible";
    const state = isSelected
      ? "z-50" // selection should feel on top visually
      : "";
    return [base, state].join(" ");
  }, [isSelected]);

  // INNER: clips content + gets rings/shadows
  const innerClassName = useMemo(() => {
    if (isShape) return "h-full w-full rounded-3xl";

    const surface =
      "h-full w-full rounded-3xl overflow-hidden p-3 " +
      "backdrop-blur-xl bg-white/10 ring-1 ring-white/12 " +
      "shadow-[0_18px_60px_rgba(0,0,0,.45)]";

    const state = isSelected
      ? "ring-2 ring-white/35 shadow-[0_26px_90px_rgba(0,0,0,.65)]"
      : "hover:ring-white/18 hover:shadow-[0_22px_70px_rgba(0,0,0,.55)]";

    return ["transition-shadow", surface, state].join(" ");
  }, [isShape, isSelected]);

  const style = useMemo(() => {
    const opacity = typeof item.opacity === "number" ? item.opacity : 1;

    return {
      left: Number(item.x) || 0,
      top: Number(item.y) || 0,
      width: Number(item.w) || 320,
      height: Number(item.h) || 200,
      zIndex: item.z ?? 10, // keep items above backdrop layer
      opacity: isDragging ? 0.92 : opacity,
      cursor: "default",
      touchAction: "none",
      transform: `rotate(${rotation}deg)`,
      transformOrigin: "center",
    };
  }, [
    item.x,
    item.y,
    item.w,
    item.h,
    item.z,
    item.opacity,
    rotation,
    isDragging,
  ]);

  const startResize = useCallback(
    (e, corner) => {
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;

      const start = {
        x: Number(item.x) || 0,
        y: Number(item.y) || 0,
        w: Number(item.w) || 320,
        h: Number(item.h) || 200,
      };

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let next = { ...start };

        if (corner.includes("e")) next.w = start.w + dx;
        if (corner.includes("s")) next.h = start.h + dy;

        if (corner.includes("w")) {
          next.w = start.w - dx;
          next.x = start.x + dx;
        }
        if (corner.includes("n")) {
          next.h = start.h - dy;
          next.y = start.y + dy;
        }

        next.w = clamp(next.w, 180, 1600);
        next.h = clamp(next.h, 140, 1200);

        onUpdateItem?.(item.id, next);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [item.id, item.x, item.y, item.w, item.h, onUpdateItem],
  );

  const startRotate = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      const el = e.currentTarget.closest("[data-rot-box]");
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const startRotation = Number(item.rotation || 0);

      const onMove = (ev) => {
        const a = Math.atan2(ev.clientY - cy, ev.clientX - cx);
        const delta = a - startAngle;
        const deg = startRotation + (delta * 180) / Math.PI;
        onUpdateItem?.(item.id, { rotation: Math.round(deg) });
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [item.id, item.rotation, onUpdateItem],
  );

  return (
    <div
      ref={setNodeRef}
      className={outerClassName}
      style={style}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      data-rot-box
    >
      <div className={innerClassName}>
        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          className="mb-3 h-3 w-16 cursor-grab rounded-full bg-linear-to-r from-fuchsia-500 via-sky-400 to-lime-300 active:cursor-grabbing"
          onMouseDown={(e) => e.stopPropagation()}
          title="Drag"
        />

        {item.type === "note" ? (
          <NoteCard
            item={item}
            onUpdate={(patch) => onUpdateItem?.(item.id, patch)}
          />
        ) : item.type === "shape" ? (
          <ShapeCard item={item} />
        ) : item.type === "typography" ? (
          <TypographyCard item={item} />
        ) : item.type === "image" ? (
          <ImageCard item={item} />
        ) : item.type === "palette" ? (
          <PaletteCard item={item} />
        ) : null}
      </div>

      {/* Handles (outside the inner shell => not clipped) */}
      {isSelected && (
        <>
          <button
            type="button"
            onPointerDown={startRotate}
            className="absolute -top-9 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,.45)]"
            title="Rotate"
          >
            <span className="text-white/80 text-sm">↻</span>
          </button>

          <div
            onPointerDown={(e) => startResize(e, "nw")}
            className="absolute -top-2 -left-2 h-4 w-4 rounded bg-white/70 ring-1 ring-black/20 cursor-nwse-resize"
            title="Resize"
          />
          <div
            onPointerDown={(e) => startResize(e, "ne")}
            className="absolute -top-2 -right-2 h-4 w-4 rounded bg-white/70 ring-1 ring-black/20 cursor-nesw-resize"
            title="Resize"
          />
          <div
            onPointerDown={(e) => startResize(e, "sw")}
            className="absolute -bottom-2 -left-2 h-4 w-4 rounded bg-white/70 ring-1 ring-black/20 cursor-nesw-resize"
            title="Resize"
          />
          <div
            onPointerDown={(e) => startResize(e, "se")}
            className="absolute -bottom-2 -right-2 h-4 w-4 rounded bg-white/70 ring-1 ring-black/20 cursor-nwse-resize"
            title="Resize"
          />
        </>
      )}
    </div>
  );
}
