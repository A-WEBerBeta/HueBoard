import { useMemo, useState } from "react";

export function useGoogleFonts() {
  const [fonts, setFonts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const filteredFonts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fonts.slice(0, 30);
    return fonts.filter((f) => f.family.toLowerCase().includes(q)).slice(0, 30);
  }, [fonts, query]);

  async function loadFonts() {
    const key = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

    if (!key) {
      setStatus("error");
      setError(
        "Missing API key. Add VITE_GOOGLE_FONTS_API_KEY in .env then restart.",
      );
      return;
    }

    try {
      setStatus("loading");
      setError("");

      const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${key}`,
      );

      if (!res.ok) throw new Error(`Google Fonts API error: ${res.status}`);

      const data = await res.json();
      setFonts(Array.isArray(data.items) ? data.items : []);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e?.message ?? "Failed to load fonts.");
    }
  }

  return {
    fonts,
    status,
    error,
    query,
    setQuery,
    filteredFonts,
    loadFonts,
  };
}
