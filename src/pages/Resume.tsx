import { useState } from "react";
import resumeScene from "../assets/generated/sets/resume-library-v2.png";
import { items } from "../assets/minecraft";
import { BookModal } from "../components/BookModal";
import { MinecraftButton } from "../components/MinecraftButton";
import { TexturePanel } from "../components/TexturePanel";
import { profile } from "../data/profile";

export function Resume() {
  const [open, setOpen] = useState(false);

  return (
    <section className="world-page resume-page biome-library">
      <img className="scene-set-image" src={resumeScene} alt="A warm voxel library with a lectern and a large open book" />
      <div className="page-heading">
        <span>Grand library</span>
        <h1>Resume on the lectern</h1>
        <p>A concise, repository-backed summary presented as a written book.</p>
      </div>
      <div className="lectern-layout">
        <TexturePanel texture="wood" className="lectern-panel">
          <img src={items.writtenBook} alt="" className="lectern-book" />
          <h2>Harshpreet's Resume</h2>
          <p>Open the book for a concise summary of the work represented in the public repositories.</p>
          <MinecraftButton type="button" variant="emerald" icon={items.writtenBook} onClick={() => setOpen(true)}>
            Open Book
          </MinecraftButton>
        </TexturePanel>
        <TexturePanel texture="book" className="resume-preview">
          <h2>Quick Preview</h2>
          <ul>
            <li>Django applications with authentication, ownership, search, and deployment settings</li>
            <li>TypeScript work across developer tooling and a Chrome extension interface</li>
            <li>PyTorch experiments for image classification and neural pruning</li>
            <li>C++ editor-engine work using a gap buffer and command history</li>
          </ul>
        </TexturePanel>
      </div>
      <BookModal open={open} onClose={() => setOpen(false)} resumeUrl={profile.resumeUrl} />
    </section>
  );
}
