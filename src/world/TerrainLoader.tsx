import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const loadingEnvironment = new URL(
  "../assets/world-archive/loading-terrain-environment.webp",
  import.meta.url,
).href;

const environmentSources = [
  loadingEnvironment,
  new URL("../assets/world-archive/spawn-environment.webp", import.meta.url).href,
  new URL("../assets/world-archive/build-archive-environment.webp", import.meta.url).href,
  new URL("../assets/world-archive/crafting-lab-environment.webp", import.meta.url).href,
  new URL("../assets/world-archive/milestone-rail-environment.webp", import.meta.url).href,
  new URL("../assets/world-archive/portal-environment.webp", import.meta.url).href,
];

const progressStages = [
  { at: 0, value: 8 },
  { at: 260, value: 21 },
  { at: 660, value: 39 },
  { at: 1080, value: 58 },
  { at: 1520, value: 76 },
  { at: 1900, value: 89 },
];

function preloadImage(source: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = source;
  });
}

function getStatus(progress: number) {
  if (progress < 24) return "Preparing resources";
  if (progress < 92) return "Building terrain";
  if (progress < 100) return "Loading terrain...";
  return "Done!";
}

export function TerrainLoader({ onComplete }: { onComplete: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(prefersReducedMotion ? 92 : progressStages[0].value);
  const [fontReady, setFontReady] = useState(false);
  const completedRef = useRef(false);
  const status = useMemo(() => getStatus(progress), [progress]);

  useEffect(() => {
    let cancelled = false;
    const showContent = () => {
      if (!cancelled) setFontReady(true);
    };
    const fontLoad = document.fonts?.load('16px "Minecraft"') ?? Promise.resolve([]);
    void fontLoad.then(showContent, showContent);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    let cancelled = false;

    const finish = async () => {
      const assetsReady = Promise.all(environmentSources.map(preloadImage));
      const fontReady = document.fonts?.ready ?? Promise.resolve();
      const minimumDisplay = new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, prefersReducedMotion ? 350 : 2200));
      });
      const assetTimeout = new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, 4800));
      });

      await Promise.all([Promise.race([Promise.all([assetsReady, fontReady]).then(() => undefined), assetTimeout]), minimumDisplay]);

      if (cancelled) return;
      setProgress(100);
      timers.push(
        window.setTimeout(() => {
          if (!cancelled && !completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, prefersReducedMotion ? 120 : 520),
      );
    };

    if (!prefersReducedMotion) {
      progressStages.slice(1).forEach((stage) => {
        timers.push(window.setTimeout(() => setProgress(stage.value), stage.at));
      });
    }

    void finish();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <motion.section
      className="terrain-loader"
      role="status"
      aria-label="Loading portfolio world"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.42, ease: "easeInOut" }}
    >
      <img className="terrain-loader__backdrop" src={loadingEnvironment} alt="" aria-hidden="true" />
      <div className="terrain-loader__veil" aria-hidden="true" />

      <div className={`terrain-loader__content${fontReady ? " is-font-ready" : ""}`}>
        <div className="terrain-loader__window">
          <div className="terrain-loader__title">Generating World</div>
          <div className="terrain-loader__body">
            <p className="terrain-loader__status">{status}</p>
            <div
              className="terrain-loader__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={status}
            >
              <span className="terrain-loader__fill" style={{ transform: `scaleX(${progress / 100})` }} />
              <span className="terrain-loader__segments" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
