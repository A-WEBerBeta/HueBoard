export default function ShapeCard({ item }) {
  const fill =
    item.fill?.kind === "solid"
      ? item.fill.color
      : `linear-gradient(135deg, ${item.fill.from}, ${
          item.fill.via ?? item.fill.from
        }, ${item.fill.to})`;

  const baseStyle = {
    width: "100%",
    height: "100%",
    transform: `rotate(${item.rotation ?? 0}deg)`,
    opacity: item.opacity ?? 0.35,
    background: fill,
    // donne ce côté “néon” sans partir en sapin de Noël
    filter: "saturate(1.08) contrast(1.05)",
  };

  const glowStyle = {
    boxShadow: "0 30px 90px rgba(0,0,0,.45), 0 0 55px rgba(255,255,255,.10)",
  };

  if (item.kind === "circle") {
    return (
      <div className="relative h-full w-full">
        <div
          className="absolute inset-0 rounded-full blur-[10px]"
          style={{ ...baseStyle, ...glowStyle }}
        />
        <div className="absolute inset-0 rounded-full" style={baseStyle} />
        <div
          className="absolute inset-0 rounded-full opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>
    );
  }

  if (item.kind === "triangle") {
    return (
      <div className="relative h-full w-full">
        <div
          className="absolute inset-0 blur-[10px]"
          style={{
            ...baseStyle,
            ...glowStyle,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            borderRadius: 24,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            ...baseStyle,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            borderRadius: 24,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>
    );
  }

  // stripe
  return (
    <div className="relative h-full w-full rounded-3xl">
      <div
        className="absolute inset-0 rounded-3xl blur-[10px]"
        style={{ ...baseStyle, ...glowStyle }}
      />
      <div className="absolute inset-0 rounded-3xl" style={baseStyle} />

      {/* striped highlight */}
      <div
        className="absolute inset-0 rounded-3xl opacity-[0.42] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.45) 0px, rgba(255,255,255,0.45) 14px, rgba(255,255,255,0) 14px, rgba(255,255,255,0) 32px)",
        }}
      />
    </div>
  );
}
