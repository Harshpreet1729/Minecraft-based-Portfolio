import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { items } from "../assets/minecraft";
import { SkillSlot } from "../components/SkillSlot";
import { projects } from "../data/projects";
import { skillGroups, skills } from "../data/skills";
import type { Skill } from "../types";

export function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(skills.find((skill) => skill.name === "Django") ?? skills[0]);
  const relatedProjects = projects.filter((project) => selectedSkill.projectIds.includes(project.id));

  return (
    <section className="world-page skills-rebuild">
      <div className="page-heading skills-rebuild__heading">
        <h1>Skills, backed by builds.</h1>
        <p>Choose a tool to reveal the projects forged with it.</p>
      </div>

      <div className="skills-workbench">
        <div className="skills-inventory">
          {skillGroups.map((group) => (
            <section key={group}>
              <h2>{group}</h2>
              <div className="skills-inventory__grid">
                {skills.filter((skill) => skill.category === group).map((skill) => (
                  <SkillSlot key={skill.name} skill={skill} selected={skill.name === selectedSkill.name} onSelect={setSelectedSkill} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <article className="skill-book parchment-panel" aria-live="polite">
          <div className="skill-book__title">
            <span className="item-frame-mini"><img src={items[selectedSkill.icon]} alt="" aria-hidden="true" /></span>
            <div><span>{selectedSkill.category}</span><h2>{selectedSkill.name}</h2></div>
          </div>
          <p>{selectedSkill.description}</p>
          <div className="book-rule" aria-hidden="true" />
          <h3>Related builds</h3>
          <div className="skill-book__projects">
            {relatedProjects.length > 0 ? relatedProjects.map((project) => (
              <a key={project.id} href={project.githubUrl} target="_blank" rel="noreferrer">
                <img src={items[project.artifactIcon]} alt="" aria-hidden="true" />
                <span>{project.name}</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )) : selectedSkill.usedIn.map((item) => <span key={item} className="skill-book__plain-entry">{item}</span>)}
          </div>
          <span className="skill-book__page">evidence / 01</span>
        </article>
      </div>
    </section>
  );
}
