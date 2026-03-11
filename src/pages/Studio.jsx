import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import BoardSwitcher from "../studio/components/BoardSwitcher";
import Canvas from "../studio/components/Canvas";
import Inspector from "../studio/components/Inspector";
import Sidebar from "../studio/components/Sidebar";

import { useBoard } from "../studio/hooks/useBoard";
import { useBoards } from "../studio/hooks/useBoards";
import { useGoogleFonts } from "../studio/hooks/useGoogleFonts";
import { useUnsplashSearch } from "../studio/hooks/useUnsplashSearch";

import hueboardLogo from "../assets/hueboard.svg";
import { SCENES, pickScene, randomScene } from "../studio/scenes/scenes";
import { ui } from "../studio/ui/ui";

export default function Studio() {
  const boards = useBoards();
  const board = boards.activeBoard;

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
  const [isExporting, setIsExporting] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

  const fonts = useGoogleFonts();
  const unsplash = useUnsplashSearch();

  const canvasRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const scene = useMemo(() => {
    return pickScene(board?.sceneId);
  }, [board?.sceneId]);

  const handleRandomScene = useCallback(() => {
    const s = randomScene();
    boards.updateBoard(boards.activeId, { sceneId: s.id });
  }, [boards]);

  const handleExtractFromSelected = useCallback(() => {
    if (selectedItem) extractPaletteFromImage(selectedItem);
  }, [selectedItem, extractPaletteFromImage]);

  const handleExport = useCallback(async () => {
    if (!canvasRef.current || !board) return;

    try {
      setIsExporting(true);

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#070816",
      });

      const link = document.createElement("a");
      link.download = `${board.title || "moodboard"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [board]);

  if (!board) return null;

  return (
    <div className={ui.appBg}>
      <header className={ui.header}>
        <div className={ui.headerInner}>
          <div className="flex items-center gap-3">
            <img src={hueboardLogo} alt="HueBoard" className="h-9 w-9" />

            <div className="leading-tight">
              <div className="font-semibold tracking-tight text-white">
                HueBoard
              </div>

              <div className="text-xs text-white/55">
                Palette • Typography • Moodboard
              </div>
            </div>
          </div>

          <div className="hidden lg:flex min-w-0 flex-1 items-center justify-center gap-3 px-2">
            <BoardSwitcher
              boardsApi={boards}
              onBeforeSwitch={() => setSelectedId(null)}
            />

            <div className="hidden xl:flex w-105 2xl:w-130 max-w-[44vw] items-center gap-3 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/12 shadow-[0_18px_40px_rgba(0,0,0,.45)]">
              <input
                value={board.title ?? ""}
                onChange={(e) =>
                  boards.updateBoard(boards.activeId, {
                    title: e.target.value,
                  })
                }
                className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
                placeholder="Untitled Project"
              />
            </div>
          </div>

          <div className="flex xl:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className={ui.btnGhost + " rounded-full px-3 py-2 text-white/80"}
              title="Open tools"
            >
              Tools
            </button>

            <button
              type="button"
              onClick={() => setMobileInspectorOpen(true)}
              className={ui.btnGhost + " rounded-full px-3 py-2 text-white/80"}
              title="Open inspector"
            >
              Properties
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/14 shadow-[0_12px_30px_rgba(0,0,0,.35)] transition hover:bg-white/16"
              title="Export as PNG"
            >
              <Download size={16} />
              Export PNG
            </button>
          </div>
        </div>
      </header>

      <main className={ui.main}>
        <div className="hidden lg:block">
          <Sidebar
            panel={panel}
            setPanel={setPanel}
            scenes={SCENES}
            sceneId={board.sceneId}
            setSceneId={(id) =>
              boards.updateBoard(boards.activeId, { sceneId: id })
            }
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
        </div>

        <Canvas
          ref={canvasRef}
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
          isExporting={isExporting}
        />

        <div className="hidden xl:block">
          <Inspector
            selectedItem={selectedItem}
            boardTitle={board.title}
            paletteStatus={paletteStatus}
            paletteError={paletteError}
            onExtractPaletteFromImage={extractPaletteFromImage}
            onUpdateItem={updateItem}
          />
        </div>
      </main>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-90 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-3 top-20 bottom-3 w-75 max-w-[calc(100vw-24px)] overflow-auto">
            <Sidebar
              panel={panel}
              setPanel={setPanel}
              scenes={SCENES}
              sceneId={board.sceneId}
              setSceneId={(id) =>
                boards.updateBoard(boards.activeId, { sceneId: id })
              }
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
          </div>
        </div>
      )}

      {mobileInspectorOpen && (
        <div className="fixed inset-0 z-90 xl:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileInspectorOpen(false)}
          />
          <div className="absolute right-4 top-20 bottom-4 w-[320px] max-w-[calc(100vw-32px)] overflow-auto">
            <Inspector
              selectedItem={selectedItem}
              boardTitle={board.title}
              paletteStatus={paletteStatus}
              paletteError={paletteError}
              onExtractPaletteFromImage={extractPaletteFromImage}
              onUpdateItem={updateItem}
            />
          </div>
        </div>
      )}
    </div>
  );
}
