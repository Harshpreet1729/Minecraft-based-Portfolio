import { TimelineRail } from "../components/TimelineRail";

export function Journey() {
  return (
    <section className="world-page journey-page biome-rails">
      <div className="page-heading">
        <h1>Journey through the biomes</h1>
        <p>Follow the map from first builds to the systems I craft today.</p>
      </div>
      <TimelineRail />
    </section>
  );
}
