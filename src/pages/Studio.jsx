import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCallback, useMemo, useState } from "react";

import Canvas from "../studio/components/Canvas";
import Inspector from "../studio/components/Inspector";
import Sidebar from "../studio/components/Sidebar";

import { useBoard } from "../studio/hooks/useBoard";
import { useGoogleFonts } from "../studio/hooks/useGoogleFonts";
import { useUnsplashSearch } from "../studio/hooks/useUnsplashSearch";

import { SCENES, pickScene, randomScene } from "../studio/scenes/scenes";
import { ui } from "../studio/ui/ui";

export default function Studio() {
  const {
    board,
    setBoard,
    selectedId,
    setSelectedId,
    selectedItem,

    paletteStatus,
    paletteError,

    addNote,
    addShape,
    addTypography,
    addImage,
    generatePalette,
    extractPaletteFromImage,
    updateItem,

    handleDragStart,
    handleDragMove,
    handleDragEnd,

    deleteSelected,
    duplicateSelected,
    bringSelectedToFront,
    sendSelectedToBack,
  } = useBoard();

  const [panel, setPanel] = useState("tools");

  // scenes
  const [sceneId, setSceneId] = useState(() => SCENES?.[0]?.id ?? "default");
  const scene = useMemo(() => pickScene(sceneId), [sceneId]);

  const fonts = useGoogleFonts();
  const unsplash = useUnsplashSearch();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleRandomScene = useCallback(() => {
    setSceneId(randomScene().id);
  }, []);

  const handleTitleChange = useCallback(
    (e) => {
      const title = e.target.value;
      setBoard((prev) => ({ ...prev, title }));
    },
    [setBoard],
  );

  const handleExtractFromSelected = useCallback(() => {
    if (selectedItem) extractPaletteFromImage(selectedItem);
  }, [selectedItem, extractPaletteFromImage]);

  return (
    <div className={ui.appBg}>
      <header className={ui.header}>
        <div className={ui.headerInner}>
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className={ui.brandMark}>
              <div className={ui.brandDot} />
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-white">
                HueBoard
              </div>
              <div className="text-xs text-white/55">
                Palette • Typography • Moodboard
              </div>
            </div>
          </div>

          {/* Center pill */}
          <div className="hidden md:flex w-[520px] max-w-[44vw] items-center gap-3 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/12 shadow-[0_18px_40px_rgba(0,0,0,.45)]">
            <span className="text-white/55">🔎</span>

            <input
              value={board.title ?? ""}
              onChange={handleTitleChange}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
              placeholder="Untitled Project"
            />

            <button
              type="button"
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/12 hover:bg-white/14"
              title="Save (local)"
              onClick={() => {
                // si on ajoute l'autosave dans useBoard, on peut même virer ce bouton
                try {
                  localStorage.setItem("hueboard", JSON.stringify(board));
                } catch {
                  //
                }
              }}
            >
              Save
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={ui.btnGhost + " rounded-full px-4 py-2 text-white/80"}
              title="Export"
            >
              Export
            </button>
            <button
              type="button"
              className={ui.btnShare + " rounded-full px-5 py-2 font-semibold"}
              title="Share"
            >
              Share
            </button>
          </div>
        </div>
      </header>

      <main className={ui.main}>
        <Sidebar
          panel={panel}
          setPanel={setPanel}
          scenes={SCENES}
          sceneId={sceneId}
          setSceneId={setSceneId}
          onRandomScene={handleRandomScene}
          onGeneratePalette={generatePalette}
          onAddShape={addShape}
          onAddNote={addNote}
          onLoadFonts={fonts.loadFonts}
          fontsStatus={fonts.status}
          fontsError={fonts.error}
          fontQuery={fonts.query}
          setFontQuery={fonts.setQuery}
          filteredFonts={fonts.filteredFonts}
          onAddTypography={addTypography}
          imgQuery={unsplash.query}
          setImgQuery={unsplash.setQuery}
          onSearchUnsplash={unsplash.searchFirstPage}
          imgStatus={unsplash.status}
          imgError={unsplash.error}
          images={unsplash.images}
          onAddImage={addImage}
          onLoadMoreImages={unsplash.loadMore}
        />

        <Canvas
          scene={scene}
          board={board}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          canExtract={selectedItem?.type === "image"}
          onExtractPalette={handleExtractFromSelected}
          onUpdateItem={updateItem}
          onDeleteSelected={deleteSelected}
          onDuplicateSelected={duplicateSelected}
          onBringToFront={bringSelectedToFront}
          onSendToBack={sendSelectedToBack}
          onRandomScene={handleRandomScene}
        />

        <Inspector
          selectedItem={selectedItem}
          boardTitle={board.title}
          paletteStatus={paletteStatus}
          paletteError={paletteError}
          onExtractPaletteFromImage={extractPaletteFromImage}
          onUpdateItem={updateItem}
        />
      </main>
    </div>
  );
}
