import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { HotbarNavigation } from "./HotbarNavigation";
import { CustomCursor } from "./CustomCursor";

export function PageShell() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <CustomCursor />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <HotbarNavigation />
    </div>
  );
}
