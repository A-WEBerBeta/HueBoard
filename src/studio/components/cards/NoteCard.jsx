export default function NoteCard({ item, onUpdate }) {
  return (
    <div className="h-full">
      <input
        value={item.title || ""}
        onChange={(e) => onUpdate?.({ title: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full bg-transparent text-sm font-semibold text-white/90 outline-none placeholder:text-white/35"
        placeholder="Title"
      />

      <textarea
        value={item.body || ""}
        onChange={(e) => onUpdate?.({ body: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        className="mt-3 w-full resize-none bg-transparent text-sm leading-relaxed text-white/70 outline-none placeholder:text-white/35"
        placeholder="Write something…"
        rows={6}
      />
    </div>
  );
}
