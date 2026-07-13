import React, { useRef, useCallback, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin } from "lucide-react";

interface TeamSlotProps {
  slot: any;
  index: number;
  updateSlot: (index: number, updates: Partial<any>) => void;
  getPokemonSpriteUrl: (pokemon: any, animated: boolean) => string;
  pokeballData: Record<string, { image: string; name: string }>;
  abilitiesData: Array<{ slug: string; name: string; description: string }>;
  placesData: Array<{ id: string; nombre: string }>;
  /** When true, the sprite can be dragged to adjust its translate offset */
  draggable?: boolean;
  /** Show the level badge on the slot (default true) */
  showLevel?: boolean;
  /** Show the pokeball icon on the slot (default true) */
  showPokeball?: boolean;
}

const TeamSlot: React.FC<TeamSlotProps> = ({
  slot,
  index,
  updateSlot,
  getPokemonSpriteUrl,
  pokeballData,
  abilitiesData,
  placesData,
  draggable = false,
  showLevel = true,
  showPokeball = true,
}) => {
  const getAbilityData = (slug: string) => {
    return abilitiesData.find((a) => a.slug === slug);
  };

  // ── Drag-to-translate state ──────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  // Live translate during drag (not committed to state yet)
  const liveTranslate = useRef({ x: 0, y: 0 });
  // Live zoom during wheel (not committed to state yet)
  const liveZoom = useRef<number>(slot.animated ? (slot.animatedZoom ?? 1) : (slot.staticZoom ?? 1));
  const wheelCommitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getTranslateKey = () =>
    slot.animated
      ? { x: "animatedTranslateX", y: "animatedTranslateY" }
      : { x: "staticTranslateX", y: "staticTranslateY" };

  const getZoomKey = () => slot.animated ? "animatedZoom" : "staticZoom";

  const getBaseTranslate = useCallback(() => ({
    x: slot.animated ? (slot.animatedTranslateX ?? 0) : (slot.staticTranslateX ?? 0),
    y: slot.animated ? (slot.animatedTranslateY ?? 0) : (slot.staticTranslateY ?? 0),
  }), [slot]);

  /** Apply a transform string directly to the img DOM node to avoid re-render lag */
  const applyLiveTransform = (tx: number, ty: number, zoom?: number) => {
    if (!imgRef.current) return;
    const z = zoom ?? liveZoom.current;
    imgRef.current.style.transform = `scale(${z}) translate(${tx}px, ${ty}px)`;
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!draggable || !slot.pokemon || index < 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    const base = getBaseTranslate();
    liveTranslate.current = { x: base.x, y: base.y };
    if (imgRef.current) {
      imgRef.current.style.transition = "none";
    }
  }, [draggable, slot, index, getBaseTranslate]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const base = getBaseTranslate();
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    // Divide by zoom so 1px of mouse movement = 1px of sprite offset regardless of scale
    const zoom = slot.animated ? slot.animatedZoom : slot.staticZoom;
    const tx = Math.round(base.x + dx / zoom);
    const ty = Math.round(base.y + dy / zoom);
    liveTranslate.current = { x: tx, y: ty };
    applyLiveTransform(tx, ty);
  }, [slot, getBaseTranslate]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (imgRef.current) {
      imgRef.current.style.transition = "";
    }
    const { x, y } = liveTranslate.current;
    const keys = getTranslateKey();
    updateSlot(index, { [keys.x]: x, [keys.y]: y });
  }, [index, updateSlot, getTranslateKey]);

  // Sync liveZoom ref whenever slot zoom prop changes (e.g. after a commit)
  useEffect(() => {
    liveZoom.current = slot.animated ? (slot.animatedZoom ?? 1) : (slot.staticZoom ?? 1);
  }, [slot.animated, slot.animatedZoom, slot.staticZoom]);

  // ── Wheel-to-zoom (non-passive so we can preventDefault) ─────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !draggable) return;

    const handleWheel = (e: WheelEvent) => {
      if (!slot.pokemon || index < 0) return;
      e.preventDefault();

      const STEP = 0.05;
      const MIN_ZOOM = 0.2;
      const MAX_ZOOM = 5;
      const delta = e.deltaY < 0 ? STEP : -STEP;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM,
        parseFloat((liveZoom.current + delta).toFixed(2))
      ));
      liveZoom.current = newZoom;

      const { x, y } = liveTranslate.current;
      applyLiveTransform(x, y, newZoom);

      // Debounce the state commit so we don't flood on rapid scrolling
      if (wheelCommitTimer.current) clearTimeout(wheelCommitTimer.current);
      wheelCommitTimer.current = setTimeout(() => {
        updateSlot(index, { [getZoomKey()]: newZoom });
      }, 300);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  // Re-attach whenever draggable/slot identity changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggable, slot.pokemon, slot.animated, index, updateSlot]);

  // Reset transition on unmount safety
  useEffect(() => {
    return () => {
      isDragging.current = false;
      if (wheelCommitTimer.current) clearTimeout(wheelCommitTimer.current);
    };
  }, []);

  const isDraggableSlot = draggable && !!slot.pokemon;
  const cursorClass = isDraggableSlot ? "cursor-grab active:cursor-grabbing" : "";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={containerRef}
            className={`bg-slate-800/80 border border-purple-500/20 rounded-lg p-2 flex flex-col items-center justify-between relative overflow-hidden group transition-all duration-300 select-none
              ${isDraggableSlot
                ? "hover:border-blue-400/60 hover:shadow-[0_0_0_1px_rgba(96,165,250,0.3)] cursor-grab active:cursor-grabbing"
                : "hover:border-purple-400/40"
              }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Level badge */}
            <div className="absolute top-1 left-1 flex flex-col items-start">
              {showLevel && slot.pokemon && (
                <span className="text-xs font-bold text-purple-200 bg-slate-900/80 rounded px-1 mt-0.5">Lv {slot.level}</span>
              )}
            </div>

            {slot.pokemon ? (
              <>
                {/* Pokemon sprite — absolutely positioned behind everything */}
                <img
                  ref={imgRef}
                  src={getPokemonSpriteUrl(slot.pokemon, slot.animated)}
                  alt={slot.pokemon.name.english}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-lg pointer-events-none"
                  style={{
                    transform: `scale(${slot.animated ? slot.animatedZoom : slot.staticZoom}) translate(${slot.animated ? (slot.animatedTranslateX ?? 0) : (slot.staticTranslateX ?? 0)}px, ${slot.animated ? (slot.animatedTranslateY ?? 0) : (slot.staticTranslateY ?? 0)}px)`,
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                  } as React.CSSProperties}
                  onError={(e) => {
                    if (slot.animated) {
                      const target = e.target as HTMLImageElement;
                      target.src = getPokemonSpriteUrl(slot.pokemon!, false);
                    }
                  }}
                  draggable={false}
                />

                {/* Pokeball indicator */}
                {showPokeball && (
                  <div className="absolute top-0 right-0 pointer-events-none z-10">
                    <img
                      src={pokeballData[slot.pokeball].image}
                      alt={pokeballData[slot.pokeball].name}
                      className="w-6 h-6 drop-shadow-md"
                      draggable={false}
                    />
                  </div>
                )}

                {/* Pokemon name — always on top */}
                <div className="absolute bottom-0 left-0 right-0 z-10 text-center px-1 pb-1">
                  <div className="text-md font-bold text-white truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {slot.nickname || slot.pokemon.name.english}
                  </div>
                </div>
              </>
            ) : (
              // Empty slot
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full mb-1 mx-auto flex items-center justify-center">
                    <span className="text-2xl">?</span>
                  </div>
                  <div className="text-sm">Vacío</div>
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
          <TooltipContent className="text-sm max-w-xs">
            <div className="font-bold mb-1">{getAbilityData(slot.ability)?.name}</div>
            <div>{getAbilityData(slot.ability)?.description}</div>
            {slot.place && (
                    <div className="flex items-center justify-center gap-1 text-xs text-purple-800 mt-0.5">
                      <MapPin className="w-3 h-3 inline-block" />
                      {slot.place === 'unknown'
                        ? 'Desconocido'
                        : (placesData.find((p) => p.id === slot.place)?.nombre || slot.place)}
                    </div>
                  )}
          </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TeamSlot;