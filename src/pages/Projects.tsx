import { useState } from "react";
import projectsScene from "../assets/generated/sets/projects-hall-v2.png";
import { ItemFrameCard } from "../components/ItemFrameCard";
import { ProjectDetailPanel } from "../components/ProjectDetailPanel";
import { projects } from "../data/projects";
import type { Project } from "../types";

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section className="world-page projects-page biome-trophy">
      <img className="projects-page__scene" src={projectsScene} alt="A grand voxel trophy hall built from deepslate, stone and dark oak" />
      <div className="page-heading">
        <span>Repository trophy hall</span>
        <h1>Projects</h1>
        <p>Every build is displayed as an artifact. Inspect one to open its written-book walkthrough.</p>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <ItemFrameCard key={project.id} project={project} onInspect={setSelectedProject} />
        ))}
      </div>
      <ProjectDetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
