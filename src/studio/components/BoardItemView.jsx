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
  isExporting = false,
}) {
  const isShape = item.type === "shape";

  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: item.id,
    disabled: false,
  });

  const rotation = Number(item.rotation || 0);

  const outerClassName = useMemo(() => {
    return [
      "absolute select-none overflow-visible",
      isSelected ? "z-50" : "",
    ].join(" ");
  }, [isSelected]);

  const innerClassName = useMemo(() => {
    if (isShape) {
      return "relative h-full w-full rounded-3xl";
    }

    const surface = isExporting
      ? "h-full w-full rounded-3xl overflow-hidden px-3 pb-3 pt-12 bg-[#161821] ring-1 ring-white/8 shadow-[0_18px_40px_rgba(0,0,0,.35)]"
      : "h-full w-full rounded-3xl overflow-hidden px-3 pb-3 pt-12 backdrop-blur-xl bg-white/10 ring-1 ring-white/12 shadow-[0_18px_60px_rgba(0,0,0,.45)]";

    const state = isExporting
      ? ""
      : isSelected
        ? "ring-2 ring-white/35 shadow-[0_26px_90px_rgba(0,0,0,.65)]"
        : "hover:ring-white/18 hover:shadow-[0_22px_70px_rgba(0,0,0,.55)]";

    return ["transition-shadow", surface, state].join(" ");
  }, [isShape, isSelected, isExporting]);

  const style = useMemo(() => {
    const opacity = typeof item.opacity === "number" ? item.opacity : 1;
    const rawWidth = Number(item.w) || 320;
    const maxWidth = Math.min(rawWidth, window.innerWidth - 120);

    return {
      left: Number(item.x) || 0,
      top: Number(item.y) || 0,
      width: maxWidth,
      height: Number(item.h) || 200,
      zIndex: item.z ?? 10,
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
      {...(isShape ? listeners : {})}
      {...(isShape ? attributes : {})}
    >
      {!isExporting && !isShape && (
        <div
          {...listeners}
          {...attributes}
          className="absolute left-1/2 top-2 z-20 -translate-x-1/2 inline-flex h-6 w-10 cursor-grab items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10 backdrop-blur active:cursor-grabbing"
          onMouseDown={(e) => e.stopPropagation()}
          title="Drag"
        >
          <div className="grid grid-cols-2 gap-0.75">
            <span className="h-1 w-1 rounded-full bg-white/45" />
            <span className="h-1 w-1 rounded-full bg-white/45" />
            <span className="h-1 w-1 rounded-full bg-white/45" />
            <span className="h-1 w-1 rounded-full bg-white/45" />
          </div>
        </div>
      )}

      <div className={innerClassName}>
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

      {isSelected && !isExporting && (
        <>
          <button
            type="button"
            onPointerDown={startRotate}
            className="absolute -top-9 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 shadow-[0_10px_30px_rgba(0,0,0,.45)]"
            title="Rotate"
          >
            <span className="text-sm text-white/80">↻</span>
          </button>

          <div
            onPointerDown={(e) => startResize(e, "nw")}
            className="absolute -left-2 -top-2 h-4 w-4 rounded bg-white/70 ring-1 ring-black/20 cursor-nwse-resize"
            title="Resize"
          />
          <div
            onPointerDown={(e) => startResize(e, "ne")}
            className="absolute -right-2 -top-2 h-4 w-4 rounded bg-white/70 ring-1 ring-black/20 cursor-nesw-resize"
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
