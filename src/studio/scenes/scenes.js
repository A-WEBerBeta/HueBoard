export const SCENES = [
  {
    id: "memphis-sunset",
    name: "Memphis Sunset",
    palette: {
      bg: "#070816",
      pink: "#FF2DB2",
      cyan: "#00D9FF",
      lime: "#B7FF00",
      yellow: "#FFCC00",
      blue: "#5B6CFF",
    },
    backdrop: {
      blobs: [
        {
          x: -160,
          y: -160,
          size: 520,
          color: "rgba(255,45,178,.45)",
          blur: 140,
        },
        {
          x: "calc(100% - 300px)",
          y: 40,
          size: 520,
          color: "rgba(0,217,255,.35)",
          blur: 150,
        },
        {
          x: "35%",
          y: "calc(100% - 320px)",
          size: 560,
          color: "rgba(255,204,0,.25)",
          blur: 170,
        },
      ],
      disks: [
        { x: -140, y: 48, size: 520, a: "#FF2DB2" },
        { x: 80, y: "calc(100% - 440px)", size: 560, a: "#FFCC00" },
        {
          x: "calc(100% - 440px)",
          y: "calc(100% - 460px)",
          size: 620,
          a: "#00D9FF",
        },
      ],
      triangle: {
        x: "52%",
        y: "16%",
        size: 420,
        color: "#5B6CFF",
        dots: true,
        rotate: 2,
      },
      checker: { x: "86%", y: "52%", size: 210, opacity: 0.45 },
      stripes: {
        x: "calc(100% - 400px)",
        y: "calc(100% - 280px)",
        w: 320,
        h: 220,
        rotate: 2,
        gradient: "linear-gradient(90deg,#ff2db2,#00d9ff,#b7ff00,#ffcc00)",
      },
      dust: { size: 24, opacity: 0.18 },
    },
  },

  // Variante plus “bleu/cyan”
  {
    id: "neon-ocean",
    name: "Neon Ocean",
    palette: {
      bg: "#050A1A",
      pink: "#A78BFA",
      cyan: "#00D9FF",
      lime: "#22C55E",
      yellow: "#60A5FA",
      blue: "#2563EB",
    },
    backdrop: {
      blobs: [
        {
          x: -180,
          y: -180,
          size: 560,
          color: "rgba(0,217,255,.32)",
          blur: 160,
        },
        {
          x: "calc(100% - 320px)",
          y: 10,
          size: 520,
          color: "rgba(37,99,235,.30)",
          blur: 150,
        },
        {
          x: "42%",
          y: "calc(100% - 300px)",
          size: 540,
          color: "rgba(167,139,250,.22)",
          blur: 170,
        },
      ],
      disks: [
        { x: -160, y: 80, size: 520, a: "#00D9FF" },
        { x: 60, y: "calc(100% - 430px)", size: 560, a: "#2563EB" },
        {
          x: "calc(100% - 460px)",
          y: "calc(100% - 480px)",
          size: 620,
          a: "#22C55E",
        },
      ],
      triangle: {
        x: "54%",
        y: "14%",
        size: 420,
        color: "#2563EB",
        dots: true,
        rotate: 1,
      },
      checker: { x: "84%", y: "56%", size: 210, opacity: 0.35 },
      stripes: {
        x: "calc(100% - 420px)",
        y: "calc(100% - 290px)",
        w: 330,
        h: 220,
        rotate: 1,
        gradient: "linear-gradient(90deg,#00d9ff,#2563eb,#22c55e,#a78bfa)",
      },
      dust: { size: 26, opacity: 0.16 },
    },
  },
];

export function pickScene(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

export function randomScene() {
  return SCENES[Math.floor(Math.random() * SCENES.length)];
}
