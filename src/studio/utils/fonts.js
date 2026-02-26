export function ensureFontLoaded(family) {
  const id = `gf-${family.toLowerCase().replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family
    .trim()
    .replace(/\s+/g, "+")}&display=swap`;
  document.head.appendChild(link);
}
