import { MinecraftButton } from "../components/MinecraftButton";

export function NotFound() {
  return (
    <section className="page not-found-page">
      <div className="page-heading">
        <span>Lost Chunk</span>
        <h1>Page Not Found</h1>
        <p>This route has not been generated in the world yet.</p>
      </div>
      <MinecraftButton href="/" variant="emerald">
        Return to Spawn
      </MinecraftButton>
    </section>
  );
}
