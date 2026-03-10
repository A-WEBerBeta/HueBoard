export default function MemphisBackdrop({ scene }) {
  if (!scene) return null;

  if (scene.type === "dots") {
    return (
      <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden bg-[#0c0d12]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 60%)",
          }}
        />
      </div>
    );
  }

  if (scene.type === "grid") {
    return (
      <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden bg-[#0c0d12]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 60%)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      <img
        src={scene.image}
        alt={scene.name}
        className="absolute inset-0 h-full w-full object-cover"
        draggable="false"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.3,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 0.8px, transparent 0.8px)",
          backgroundSize: "7px 7px",
        }}
      />
    </div>
  );
}
