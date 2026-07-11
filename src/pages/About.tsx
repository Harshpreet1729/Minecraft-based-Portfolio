import { ArrowRight, GitFork } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import aboutScene from "../assets/generated/sets/about-workshop-v2.png";
import { items } from "../assets/minecraft";
import { profile } from "../data/profile";

const repositoryEvidence = [
  { label: "Django & Python", detail: "LeetMentor and WriteYourOwn", icon: items.writtenBook },
  { label: "TypeScript Tooling", detail: "BlindCoder and LeetMentor", icon: items.redstone },
  { label: "C++ Systems", detail: "TextForge Engine", icon: items.diamondPickaxe },
  { label: "Applied Machine Learning", detail: "Prescription Scanner and Self-Pruning Network", icon: items.experienceBottle },
];

export function About() {
  return (
    <section className="world-page about-rebuild">
      <img className="about-rebuild__scene" src={aboutScene} alt="A warm voxel workshop with a crafting table, bookshelves, furnace and parchment board" />
      <div className="about-rebuild__layout">
        <motion.div
          className="about-rebuild__copy-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="about-rebuild__copy">
            <h1>About Harshpreet</h1>
            <p className="about-lead">A software developer who learns by building useful, thoughtful systems.</p>
            <div className="evidence-list" aria-label="Technologies demonstrated in public repositories">
              {repositoryEvidence.map((entry) => (
                <article key={entry.label}>
                  <span className="item-frame-mini"><img src={entry.icon} alt="" aria-hidden="true" /></span>
                  <div><strong>{entry.label}</strong><span>{entry.detail}</span></div>
                </article>
              ))}
            </div>
            <div className="about-rebuild__actions">
              <Link to="/projects" className="text-link">See the work <ArrowRight size={18} aria-hidden="true" /></Link>
              <a href={profile.github} target="_blank" rel="noreferrer" className="text-link text-link--muted">
                <GitFork size={18} aria-hidden="true" /> GitHub profile
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
