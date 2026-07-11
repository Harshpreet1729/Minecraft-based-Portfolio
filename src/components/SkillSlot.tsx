import { motion } from "framer-motion";
import { items } from "../assets/minecraft";
import type { Skill } from "../types";

export function SkillSlot({
  skill,
  selected,
  onSelect,
}: {
  skill: Skill;
  selected: boolean;
  onSelect: (skill: Skill) => void;
}) {
  return (
    <motion.button
      type="button"
      className={`skill-slot ${selected ? "is-selected" : ""}`}
      whileHover={{ y: -3 }}
      whileFocus={{ y: -3 }}
      onClick={() => onSelect(skill)}
      aria-pressed={selected}
    >
      <img src={items[skill.icon]} alt="" aria-hidden="true" />
      <span>{skill.name}</span>
    </motion.button>
  );
}
