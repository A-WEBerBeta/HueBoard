export default function ImageCard({ item }) {
  return (
    <div className="h-full">
      <div className="group h-full overflow-hidden rounded-2xl bg-white/8 ring-1 ring-white/12">
        {/* Image */}
        <div className="relative h-[calc(100%-44px)] w-full overflow-hidden">
          <img
            src={item.url}
            alt={item.alt || "Moodboard image"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* subtle overlay for readability */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0" />

          {/* tiny badge */}
          <div className="absolute left-3 top-3 rounded-full bg-black/35 px-2 py-1 text-[10px] text-white/80 ring-1 ring-white/15 backdrop-blur">
            {item.source || "Image"}
          </div>
        </div>

        {/* Footer */}
        <div className="flex h-8 items-center justify-between gap-3 px-3 text-xs overflow-hidden">
          <div className="min-w-0 truncate text-white/70">
            by{" "}
            {item.authorUrl ? (
              <a
                className="text-white/85 underline decoration-white/20 underline-offset-2 hover:decoration-white/60"
                href={item.authorUrl}
                target="_blank"
                rel="noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {item.authorName}
              </a>
            ) : (
              <span className="text-white/85">{item.authorName}</span>
            )}
          </div>

          {item.photoUrl ? (
            <a
              className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/80 ring-1 ring-white/12 hover:bg-white/14"
              href={item.photoUrl}
              target="_blank"
              rel="noreferrer"
              onPointerDown={(e) => e.stopPropagation()}
              title="Open on Unsplash"
            >
              Unsplash ↗
            </a>
          ) : (
            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/70 ring-1 ring-white/12">
              Unsplash
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
