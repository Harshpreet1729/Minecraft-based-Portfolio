import { motion } from "framer-motion";
import { ExternalLink, GitFork, Search } from "lucide-react";
import { items } from "../assets/minecraft";
import type { Project } from "../types";

export function ItemFrameCard({
  project,
  onInspect,
}: {
  project: Project;
  onInspect: (project: Project) => void;
}) {
  return (
    <motion.article
      className={`item-frame-card rarity-${project.rarity} ${project.featured ? "is-featured" : ""}`}
      whileHover={{ y: -8, rotate: -0.4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="item-frame-card__artifact">
        <img src={items[project.artifactIcon]} alt="" aria-hidden="true" />
      </div>
      <div className="item-frame-card__body">
        <p className="tooltip-label">{project.category}</p>
        <h3>{project.name}</h3>
        <p>{project.shortDescription}</p>
        <div className="crafting-chips" aria-label={`${project.name} tech stack`}>
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
      <div className="item-frame-card__actions">
        <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
          <GitFork size={17} aria-hidden="true" /> GitHub
        </a>
        {project.liveDemoUrl ? (
          <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live demo`}>
            <ExternalLink size={17} aria-hidden="true" /> Demo
          </a>
        ) : null}
        <button type="button" onClick={() => onInspect(project)}>
          <Search size={17} aria-hidden="true" /> Inspect
        </button>
      </div>
    </motion.article>
  );
}
