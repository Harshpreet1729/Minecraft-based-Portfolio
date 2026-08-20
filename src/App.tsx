import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { TerrainLoader } from "./world/TerrainLoader";
import { WorldArchive } from "./world/WorldArchive";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const finishLoading = useCallback(() => setIsLoading(false), []);

  return (
    <>
      <WorldArchive />
      <AnimatePresence>{isLoading ? <TerrainLoader onComplete={finishLoading} /> : null}</AnimatePresence>
    </>
  );
}
