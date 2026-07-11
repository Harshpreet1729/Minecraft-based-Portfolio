import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, GitFork, X } from "lucide-react";
import { useEffect, useState } from "react";
import { items } from "../assets/minecraft";
import type { Project } from "../types";

export function ProjectDetailPanel({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    setSpread(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setSpread(1);
      if (event.key === "ArrowLeft") setSpread(0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, project]);

  return (
    <AnimatePresence>
      {project ? (
        <div
          className="book-backdrop"
          onClick={onClose}
        >
          <button className="book-close" type="button" onClick={onClose} aria-label="Close project book">
            <X size={22} aria-hidden="true" />
          </button>
          <article
            className="minecraft-book"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-book-title"
          >
            <div className="book-spine" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={spread}
                className="book-spread"
                initial={{ opacity: 0, rotateY: spread === 0 ? -3 : 3 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {spread === 0 ? (
                  <>
                    <section className="book-page book-page--title">
                      <img className="book-project-icon" src={items[project.artifactIcon]} alt="" aria-hidden="true" />
                      <span className="book-kicker">{project.category}</span>
                      <h2 id="project-book-title">{project.name}</h2>
                      <p className="book-summary">{project.shortDescription}</p>
                      <div className="book-rule" aria-hidden="true" />
                      <p>{project.longDescription}</p>
                    </section>
                    <section className="book-page">
                      <h3>Built with</h3>
                      <ul className="book-tech-list">
                        {project.techStack.map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                      <h3>Repository</h3>
                      <a className="book-repo-link" href={project.githubUrl} target="_blank" rel="noreferrer">
                        <GitFork size={18} aria-hidden="true" /> {project.githubUrl.replace("https://github.com/", "")}
                      </a>
                    </section>
                  </>
                ) : (
                  <>
                    <section className="book-page">
                      <h3>What it does</h3>
                      <ul className="book-feature-list">
                        {project.features.slice(0, 3).map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </section>
                    <section className="book-page">
                      <h3>More from the repository</h3>
                      <ul className="book-feature-list">
                        {project.features.slice(3).map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                      <div className="book-actions">
                        <a href={project.githubUrl} target="_blank" rel="noreferrer">
                          <GitFork size={18} aria-hidden="true" /> GitHub
                        </a>
                        {project.liveDemoUrl ? (
                          <a href={project.liveDemoUrl} target="_blank" rel="noreferrer">
                            <ExternalLink size={18} aria-hidden="true" /> Live demo
                          </a>
                        ) : null}
                      </div>
                    </section>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="book-pagination">
              <button type="button" onClick={() => setSpread(0)} disabled={spread === 0} aria-label="Previous book spread">
                <ArrowLeft size={22} aria-hidden="true" />
              </button>
              <span>{spread + 1} / 2</span>
              <button type="button" onClick={() => setSpread(1)} disabled={spread === 1} aria-label="Next book spread">
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
