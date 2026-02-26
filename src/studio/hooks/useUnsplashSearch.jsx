import { useState } from "react";

export function useUnsplashSearch() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [query, setQuery] = useState("memphis design");
  const [page, setPage] = useState(1);

  async function search({ nextPage = 1, append = false } = {}) {
    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!key) {
      setStatus("error");
      setError("Missing Unsplash key. Add VITE_UNSPLASH_ACCESS_KEY in .env.");
      return;
    }

    const q = query.trim();
    if (!q) return;

    try {
      setStatus("loading");
      setError("");

      const url =
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}` +
        `&page=${nextPage}&per_page=18&orientation=landscape`;

      const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
      });

      if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);

      const data = await res.json();
      const results = Array.isArray(data.results) ? data.results : [];

      setImages((prev) => (append ? [...prev, ...results] : results));
      setStatus("success");
      setPage(nextPage);
    } catch (e) {
      setStatus("error");
      setError(e?.message ?? "Failed to load images.");
    }
  }

  function searchFirstPage() {
    return search({ nextPage: 1, append: false });
  }

  function loadMore() {
    return search({ nextPage: page + 1, append: true });
  }

  return {
    images,
    status,
    error,
    query,
    setQuery,
    page,
    search,
    searchFirstPage,
    loadMore,
  };
}
