import { AnimatePresence, motion } from "framer-motion";
import { items } from "../assets/minecraft";
import { MinecraftButton } from "./MinecraftButton";

export function BookModal({
  open,
  onClose,
  resumeUrl,
}: {
  open: boolean;
  onClose: () => void;
  resumeUrl: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            className="book-modal"
            initial={{ rotateY: -28, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 18, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-title"
          >
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close resume book">
              x
            </button>
            <img src={items.writtenBook} alt="" className="book-modal__icon" />
            <h2 id="book-title">Resume Book</h2>
            <p>
              A concise summary of the technologies and project types demonstrated in the public repositories.
            </p>
            <div className="resume-stat-grid">
              <span>Class: Software Developer</span>
              <span>Web: Django, TypeScript</span>
              <span>Systems: C++ editor engine</span>
              <span>ML: PyTorch experiments</span>
            </div>
            <div className="project-detail__actions">
              {resumeUrl ? (
                <>
                  <MinecraftButton href={resumeUrl} variant="diamond" icon={items.writtenBook}>
                    Open Full Resume
                  </MinecraftButton>
                  <MinecraftButton href={resumeUrl} variant="emerald" icon={items.map}>
                    Download Scroll
                  </MinecraftButton>
                </>
              ) : (
                <MinecraftButton type="button" variant="ghost" disabled>
                  Resume file coming soon
                </MinecraftButton>
              )}
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
