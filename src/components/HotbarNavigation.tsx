import { GitFork } from "lucide-react";
import { NavLink } from "react-router-dom";
import { items, textures } from "../assets/minecraft";
import { profile } from "../data/profile";

const navItems = [
  { to: "/", label: "Home", icon: items.compass },
  { to: "/about", label: "About", icon: items.map },
  { to: "/projects", label: "Projects", icon: items.itemFrame },
  { to: "/skills", label: "Skills", icon: items.diamondSword },
  { to: "/journey", label: "Journey", icon: items.minecart },
  { to: "/resume", label: "Resume", icon: items.writtenBook },
  { to: "/achievements", label: "Achievements", icon: items.experienceBottle },
  { to: "/contact", label: "Contact", icon: items.emerald },
];

export function HotbarNavigation() {
  return (
    <nav className="hotbar-nav" aria-label="Main navigation">
      <NavLink to="/" className="nav-brand" aria-label="Harshpreet home">
        <img src={textures.grassTop} alt="" aria-hidden="true" />
        <span>Harshpreet</span>
      </NavLink>
      <div className="hotbar-nav__slots">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `hotbar-slot ${isActive ? "is-active" : ""}`}
            title={item.label}
          >
            <img src={item.icon} alt="" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      <a className="nav-github" href={profile.github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile">
        <GitFork size={20} aria-hidden="true" />
      </a>
    </nav>
  );
}
