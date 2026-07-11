import { useState } from "react";
import { items } from "../assets/minecraft";
import { achievements } from "../data/achievements";

const achievementIcons = [items.map, items.diamondSword, items.writtenBook, items.potion, items.diamondPickaxe, items.emerald];

export function Achievements() {
  const [selectedId, setSelectedId] = useState(achievements[1]?.id ?? achievements[0].id);
  const selectedAchievement = achievements.find((achievement) => achievement.id === selectedId) ?? achievements[0];
  const selectedIndex = achievements.findIndex((achievement) => achievement.id === selectedAchievement.id);

  return (
    <section className="world-page achievements-page biome-advancements">
      <div className="page-heading">
        <h1>The Trophy Chest</h1>
        <p>Six hard-earned artifacts. Open a drawer to inspect the story behind each one.</p>
      </div>

      <div className="trophy-vault">
        <div className="trophy-vault__lid" aria-hidden="true"><span /></div>
        <div className="trophy-vault__drawers" role="group" aria-label="Achievement artifacts">
          {achievements.map((achievement, index) => (
            <button
              type="button"
              key={achievement.id}
              className={`trophy-drawer rarity-${achievement.rarity} ${selectedId === achievement.id ? "is-open" : ""}`}
              onClick={() => setSelectedId(achievement.id)}
              aria-pressed={selectedId === achievement.id}
            >
              <img src={achievementIcons[index]} alt="" aria-hidden="true" />
              <div>
                <h3>{achievement.title}</h3>
                <span>{achievement.rarity}</span>
              </div>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>

        <article className="trophy-vault__tray" aria-live="polite">
          <img src={achievementIcons[selectedIndex]} alt="" aria-hidden="true" />
          <div>
            <span>{selectedAchievement.unlock}</span>
            <h2>{selectedAchievement.title}</h2>
            <p>{selectedAchievement.description}</p>
          </div>
          <strong className={`rarity-text rarity-text--${selectedAchievement.rarity}`}>{selectedAchievement.rarity} artifact</strong>
        </article>
      </div>
    </section>
  );
}
