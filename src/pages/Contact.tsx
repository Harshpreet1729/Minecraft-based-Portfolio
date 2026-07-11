import { BriefcaseBusiness, ExternalLink, GitFork, Mail, Send } from "lucide-react";
import { useState } from "react";
import { profile } from "../data/profile";

const destinations = [
  { id: "email", label: "Email", href: profile.email, icon: Mail, note: profile.email ? "Send a direct message." : "Address coming soon." },
  { id: "linkedin", label: "LinkedIn", href: profile.linkedin, icon: BriefcaseBusiness, note: "Connect for hiring and professional conversations." },
  { id: "github", label: "GitHub", href: profile.github, icon: GitFork, note: "Inspect the public project repositories." },
];

export function Contact() {
  const [selectedId, setSelectedId] = useState(profile.email ? "email" : "linkedin");
  const selectedDestination = destinations.find((destination) => destination.id === selectedId) ?? destinations[0];

  return (
    <section className="world-page contact-page biome-portal">
      <div className="page-heading">
        <h1>Open a portal</h1>
        <p>Choose a destination or send a message through the gateway.</p>
      </div>

      <div className="portal-gateway">
        <div className="portal-frame">
          <div className="portal-field" aria-label="Contact destinations">
            <div className="portal-destinations">
              {destinations.map((destination) => {
                const Icon = destination.icon;
                return (
                  <button
                    key={destination.id}
                    type="button"
                    className={`portal-destination ${selectedId === destination.id ? "is-selected" : ""}`}
                    onClick={() => setSelectedId(destination.id)}
                    aria-pressed={selectedId === destination.id}
                  >
                    <Icon aria-hidden="true" />
                    <span>{destination.label}</span>
                    <ExternalLink aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="portal-status">
            <span>Destination: <strong>{selectedDestination.label}</strong></span>
            <p>{selectedDestination.note}</p>
            {selectedDestination.href ? (
              <a href={selectedDestination.href} target={selectedDestination.id === "email" ? undefined : "_blank"} rel="noreferrer">
                Enter {selectedDestination.label} portal <ExternalLink size={16} aria-hidden="true" />
              </a>
            ) : <button type="button" disabled>Email portal coming soon</button>}
          </div>
        </div>

        <article className="portal-message">
          <h2>Portal Message</h2>
          <form>
            <label>
              Name
              <input type="text" placeholder="Recruiter or collaborator" />
            </label>
            <label>
              Message
              <textarea rows={6} placeholder="Tell me about the project or opportunity" />
            </label>
            {profile.email ? (
              <a className="minecraft-button minecraft-button--emerald" href={profile.email}>
                <Send size={20} aria-hidden="true" />
                <span>Send via Email</span>
              </a>
            ) : (
              <button className="minecraft-button minecraft-button--ghost" type="button" disabled>
                <span>Email coming soon</span>
              </button>
            )}
          </form>
          <div className="portal-message__destination">
            <Mail size={18} aria-hidden="true" /> Destination: <strong>{profile.email ? "Email" : "Email not configured"}</strong>
          </div>
        </article>
      </div>
    </section>
  );
}
