export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export const ui = {
  // ===== App shell =====
  appBg:
    "min-h-dvh w-full text-white " +
    "bg-[radial-gradient(900px_600px_at_12%_-10%,rgba(168,85,247,.28),transparent_60%)," +
    "radial-gradient(700px_500px_at_92%_0%,rgba(0,217,255,.20),transparent_60%)," +
    "radial-gradient(700px_500px_at_50%_120%,rgba(255,45,178,.16),transparent_60%)," +
    "#070816]",

  header:
    "sticky top-0 z-40 w-full " +
    "bg-black/30 backdrop-blur-xl " +
    "border-b border-white/10",
  headerInner:
    "mx-auto flex h-16 w-full max-w-none items-center justify-between px-6",

  main:
    "mx-auto grid w-full max-w-none gap-5 px-6 py-5 " +
    "grid-cols-[320px_1fr_320px] items-start",

  // ===== Brand =====
  brandMark:
    "relative h-10 w-10 rounded-2xl " +
    "bg-[conic-gradient(from_210deg,#ff2db2,#00d9ff,#b7ff00,#ffcc00,#ff2db2)] " +
    "shadow-[0_18px_50px_rgba(0,0,0,.60)]",
  brandDot:
    "absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[#070816] ring-1 ring-white/20",

  // ===== Panels (glass) =====
  panel:
    "rounded-[28px] " +
    "bg-white/10 backdrop-blur-xl " +
    "shadow-[0_25px_90px_rgba(0,0,0,.65)] " +
    "ring-1 ring-white/12",
  panelInner: "p-4",

  // ===== Typography =====
  panelTitle: "text-lg font-semibold tracking-tight text-white",
  panelMuted: "text-xs text-white/55",

  sectionTitle:
    "text-[11px] font-semibold tracking-[0.18em] uppercase text-white/55",

  // ===== Dividers =====
  hr: "my-3 h-px bg-white/10",

  // ===== Inputs =====
  input:
    "w-full rounded-2xl bg-white/10 px-3 py-2 text-sm text-white " +
    "placeholder:text-white/45 outline-none ring-1 ring-white/12 " +
    "focus:ring-2 focus:ring-white/25",

  // ===== Buttons =====
  btn:
    "rounded-2xl px-4 py-2 text-sm transition outline-none " +
    "active:translate-y-[1px] focus:ring-2 focus:ring-white/20",

  btnGhost: "bg-white/0 hover:bg-white/10 ring-1 ring-white/10",

  btnSoft: "bg-white/10 hover:bg-white/14 ring-1 ring-white/12",

  btnPrimary:
    "bg-white text-black hover:bg-white/90 " +
    "shadow-[0_12px_30px_rgba(0,0,0,.35)]",

  btnDanger:
    "bg-rose-500 text-white hover:bg-rose-400 " +
    "shadow-[0_12px_30px_rgba(0,0,0,.35)]",

  btnShare:
    "bg-[linear-gradient(90deg,#6d28d9,#a855f7,#ec4899)] text-white " +
    "hover:brightness-110 shadow-[0_18px_45px_rgba(0,0,0,.45)]",

  btnInk:
    "bg-white/12 hover:bg-white/16 ring-1 ring-white/14 text-white/85 " +
    "shadow-[0_12px_30px_rgba(0,0,0,.28)]",

  btnNeon:
    "text-white bg-[linear-gradient(90deg,rgba(255,45,178,.95),rgba(0,217,255,.92),rgba(183,255,0,.90))] " +
    "hover:brightness-110 ring-1 ring-white/20 " +
    "shadow-[0_18px_55px_rgba(0,0,0,.45)]",

  // ===== Tabs / pills =====
  tabs:
    "mt-3 grid grid-cols-3 gap-2 rounded-2xl " +
    "bg-white/8 p-1 ring-1 ring-white/10",

  tab:
    "rounded-2xl px-3 py-2 text-xs text-white/60 " +
    "hover:bg-white/10 transition",

  tabActive:
    "rounded-2xl px-3 py-2 text-xs bg-white/16 text-white " +
    "ring-1 ring-white/14 shadow",

  // ===== Chips / badges =====
  chip:
    "inline-flex items-center gap-2 rounded-full " +
    "bg-white/10 px-3 py-1 text-xs ring-1 ring-white/12 text-white/70",

  // ===== Utility =====
  subtleText: "text-white/60",
  strongText: "text-white",
};
