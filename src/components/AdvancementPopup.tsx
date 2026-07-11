import { motion } from "framer-motion";
import { items } from "../assets/minecraft";

export function AdvancementPopup({ title = "Entered Developer World" }: { title?: string }) {
  return (
    <motion.div
      className="advancement-popup"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
    >
      <img src={items.experienceBottle} alt="" aria-hidden="true" />
      <div>
        <span>Advancement Made</span>
        <strong>{title}</strong>
      </div>
    </motion.div>
  );
}
