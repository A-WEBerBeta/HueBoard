import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCallback, useMemo, useState } from "react";

import BoardSwitcher from "../studio/components/BoardSwitcher";
import Canvas from "../studio/components/Canvas";
import Inspector from "../studio/components/Inspector";
import Sidebar from "../studio/components/Sidebar";

import { useBoard } from "../studio/hooks/useBoard";
import { useBoards } from "../studio/hooks/useBoards";
import { useGoogleFonts } from "../studio/hooks/useGoogleFonts";
import { useUnsplashSearch } from "../studio/hooks/useUnsplashSearch";

import { SCENES, pickScene, randomScene } from "../studio/scenes/scenes";
import { ui } from "../studio/ui/ui";

export default function Studio() {
  const boards = useBoards();
  const board = boards.activeBoard;

  // Editor branché sur le board actif
  const editor = useBoard(board, (patchOrFn) =>
    boards.updateBoard(boards.activeId, patchOrFn),
  );

  const {
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
  } = editor;

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

  const handleExtractFromSelected = useCallback(() => {
    if (selectedItem) extractPaletteFromImage(selectedItem);
  }, [selectedItem, extractPaletteFromImage]);

  const clearSelection = useCallback(
    () => setSelectedId(null),
    [setSelectedId],
  );

  if (!board) return null;

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

          {/* Center */}
          <div className="hidden md:flex items-center gap-3">
            <BoardSwitcher boardsApi={boards} onBeforeSwitch={clearSelection} />

            <div className="hidden lg:flex w-[520px] max-w-[44vw] items-center gap-3 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/12 shadow-[0_18px_40px_rgba(0,0,0,.45)]">
              <span className="text-white/55">🔎</span>
              <input
                value={board.title ?? ""}
                onChange={(e) =>
                  boards.updateBoard(boards.activeId, { title: e.target.value })
                }
                className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
                placeholder="Untitled Project"
              />
            </div>
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

        {/* Right column: Inspector + Board manager UNDER it (not inside inspector) */}
        <div className="relative z-30 min-w-0 flex flex-col gap-5">
          <Inspector
            selectedItem={selectedItem}
            boardTitle={board.title}
            paletteStatus={paletteStatus}
            paletteError={paletteError}
            onExtractPaletteFromImage={extractPaletteFromImage}
            onUpdateItem={updateItem}
          />

          <div className="w-[320px]">
            <BoardSwitcher boardsApi={boards} onBeforeSwitch={clearSelection} />
          </div>
        </div>
      </main>
    </div>
  );
}
