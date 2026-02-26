function px(v) {
  return typeof v === "number" ? `${v}px` : v;
}

function Disk({ x, y, size, a }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: px(x),
        top: px(y),
        width: px(size),
        height: px(size),
        background: `radial-gradient(circle_at_35%_35%, ${a}, transparent 62%)`,
      }}
    />
  );
}

function Blob({ x, y, size, color, blur }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: px(x),
        top: px(y),
        width: px(size),
        height: px(size),
        background: color,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}

export default function MemphisBackdrop({ scene }) {
  const bg = scene?.palette?.bg ?? "#070816";
  const bd = scene?.backdrop ?? {};
  const triangle = bd.triangle ?? null;
  const checker = bd.checker ?? null;
  const stripes = bd.stripes ?? null;
  const dust = bd.dust ?? { size: 24, opacity: 0.18 };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[28px]"
      style={{ background: bg }}
    >
      {/* Glow blobs */}
      {(bd.blobs ?? []).map((b, i) => (
        <Blob key={i} {...b} />
      ))}

      {/* Big Memphis disks */}
      {(bd.disks ?? []).map((d, i) => (
        <Disk key={i} {...d} />
      ))}

      {/* Triangle with dots */}
      {triangle && (
        <>
          <div
            className="absolute"
            style={{
              left: px(triangle.x),
              top: px(triangle.y),
              width: px(triangle.size),
              height: px(triangle.size),
              transform: `rotate(${triangle.rotate ?? 0}deg)`,
              background: triangle.color ?? "#5B6CFF",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
          {triangle.dots && (
            <div
              className="absolute opacity-40"
              style={{
                left: px(triangle.x),
                top: px(triangle.y),
                width: px(triangle.size),
                height: px(triangle.size),
                transform: `rotate(${triangle.rotate ?? 0}deg)`,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                backgroundImage:
                  "radial-gradient(rgba(0,0,0,.55) 2px, transparent 2px)",
                backgroundSize: "22px 22px",
              }}
            />
          )}
        </>
      )}

      {/* Checkerboard block */}
      {checker && (
        <div
          className="absolute rounded-3xl bg-white/5 ring-1 ring-white/10 overflow-hidden"
          style={{
            left: `calc(${px(checker.x)} - ${px(checker.size)})`,
            top: px(checker.y),
            width: px(checker.size),
            height: px(checker.size),
          }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,.75) 50%, rgba(0,0,0,0) 50%), linear-gradient(rgba(255,255,255,.75) 50%, rgba(0,0,0,0) 50%)",
              backgroundSize: "36px 36px",
              mixBlendMode: "screen",
              opacity: checker.opacity ?? 0.45,
            }}
          />
        </div>
      )}

      {/* Striped card */}
      {stripes && (
        <div
          className="absolute rounded-[28px] shadow-[0_25px_80px_rgba(0,0,0,.55)]"
          style={{
            left: px(stripes.x),
            top: px(stripes.y),
            width: px(stripes.w),
            height: px(stripes.h),
            transform: `rotate(${stripes.rotate ?? 0}deg)`,
            background: stripes.gradient,
          }}
        >
          <div className="h-full w-full rounded-[28px] bg-[repeating-linear-gradient(135deg,rgba(0,0,0,.35)_0,rgba(0,0,0,.35)_16px,transparent_16px,transparent_38px)]" />
        </div>
      )}

      {/* Squiggle (on garde un élément “signature”) */}
      <div className="absolute left-[68%] bottom-[18%] h-10 w-40 rotate-2 opacity-80">
        <svg viewBox="0 0 200 40" className="h-full w-full">
          <path
            d="M0 20 C20 0, 40 40, 60 20 S100 40, 120 20 S160 0, 200 20"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Confetti */}
      <div className="absolute left-[46%] top-[40%] h-4 w-4 rotate-12 bg-yellow-300 shadow" />
      <div className="absolute left-[22%] top-[22%] h-5 w-5 rotate-6 bg-fuchsia-400 shadow" />
      <div className="absolute right-[34%] top-[18%] h-3 w-3 rounded-full bg-white shadow" />

      {/* Overall dot dust */}
      <div
        className="absolute inset-0"
        style={{
          opacity: dust.opacity ?? 0.18,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: `${dust.size ?? 24}px ${dust.size ?? 24}px`,
        }}
      />
    </div>
  );
}
