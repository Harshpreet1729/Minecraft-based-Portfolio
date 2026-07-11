import type { Project } from "../types";

export function CraftingRecipe({ project }: { project: Project }) {
  return (
    <article className="recipe-card">
      <h3>{project.name} Recipe</h3>
      <div className="recipe-grid">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
        <strong>{project.name}</strong>
      </div>
    </article>
  );
}
