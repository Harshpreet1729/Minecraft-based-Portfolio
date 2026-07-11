import { motion } from "framer-motion";
import { useState } from "react";
import { journey } from "../data/journey";

export function TimelineRail() {
  const [selectedId, setSelectedId] = useState(journey[journey.length - 1].id);
  const selectedStation = journey.find((station) => station.id === selectedId) ?? journey[0];

  return (
    <div className="journey-map">
      <div className="journey-map__canvas" aria-label="Career journey map">
        <svg className="journey-map__route" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
          <path d="M145 125 C245 75 320 95 385 145 S525 255 620 175 S790 125 830 245 S740 415 620 390 S405 330 300 420 S150 430 130 350" />
        </svg>
        {journey.map((station, index) => (
          <motion.button
            type="button"
            className={`journey-waypoint journey-waypoint--${index + 1} ${selectedId === station.id ? "is-selected" : ""}`}
            key={station.id}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.25 }}
            onClick={() => setSelectedId(station.id)}
            aria-pressed={selectedId === station.id}
          >
            <span className="journey-waypoint__number">{index + 1}</span>
            <span className="journey-waypoint__copy">
              <strong>{station.title}</strong>
              <small>{station.biome}</small>
            </span>
            {index === journey.length - 1 ? <span className="journey-waypoint__you">You are here</span> : null}
          </motion.button>
        ))}
      </div>

      <motion.article
        key={selectedStation.id}
        className="journey-map__detail"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        aria-live="polite"
      >
        <span>{selectedStation.year} route</span>
        <div>
          <h2>{selectedStation.title}</h2>
          <strong>{selectedStation.biome}</strong>
        </div>
        <p>{selectedStation.detail}</p>
      </motion.article>
    </div>
  );
}
