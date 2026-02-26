import { ensureFontLoaded } from "../../utils/fonts";

export default function TypographyCard({ item }) {
  ensureFontLoaded(item.family);

  const family = `"${item.family}", system-ui, sans-serif`;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-white/45">
            {item.category}
          </div>
          <div className="mt-0.5 text-sm font-semibold text-white/85 truncate">
            {item.family}
          </div>
        </div>

        {/* accent chip */}
        <div className="h-6 w-10 shrink-0 rounded-full bg-white/10 ring-1 ring-white/12" />
      </div>

      {/* Title sample */}
      <div
        className="mt-4 text-[26px] leading-tight text-white"
        style={{ fontFamily: family }}
      >
        {item.title}
      </div>

      {/* Body sample */}
      <div
        className="mt-2 text-sm leading-relaxed text-white/70"
        style={{ fontFamily: family }}
      >
        {item.body}
      </div>

      {/* subtle baseline grid feel */}
      <div className="mt-3 h-px w-full bg-white/10" />
    </div>
  );
}
