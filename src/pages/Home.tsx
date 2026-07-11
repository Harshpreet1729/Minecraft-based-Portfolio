import { ArrowRight, GitFork } from "lucide-react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import homeScene from "../assets/generated/sets/home-overworld-v2.png";
import { items } from "../assets/minecraft";
import { featuredProjects } from "../data/projects";
import { profile } from "../data/profile";

export function Home() {
  return (
    <section className="world-home">
      <div className="world-hero">
        <img className="world-hero__scene" src={homeScene} alt="A lantern-lit voxel survival lodge beside mountains and forest" />
        <div className="world-hero__shade" aria-hidden="true" />
        <motion.div
          className="world-hero__copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          <h1>{profile.name}</h1>
          <p>{profile.introduction}</p>
          <div className="world-hero__actions">
            <Link to="/projects" className="world-cta world-cta--primary">
              Explore projects <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link to="/about" className="world-cta world-cta--secondary">
              About me
            </Link>
          </div>
          <a className="world-github" href={profile.github} target="_blank" rel="noreferrer">
            <GitFork size={17} aria-hidden="true" /> @{profile.handle} on GitHub
          </a>
        </motion.div>
        <div className="world-hero__hint" aria-hidden="true">Scroll to inspect builds</div>
      </div>
      <div className="featured-builds">
        <div className="featured-builds__heading">
          <div>
            <span className="pixel-label">Selected repositories</span>
            <h2>Built to be inspected.</h2>
          </div>
          <Link to="/projects">View every project <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="featured-builds__grid">
          {featuredProjects.slice(0, 3).map((project, index) => (
            <Link key={project.id} to="/projects" className="featured-build" style={{ "--build-index": index } as CSSProperties}>
              <img src={items[project.artifactIcon]} alt="" aria-hidden="true" />
              <div>
                <span>{project.category}</span>
                <h3>{project.name}</h3>
                <p>{project.shortDescription}</p>
              </div>
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
