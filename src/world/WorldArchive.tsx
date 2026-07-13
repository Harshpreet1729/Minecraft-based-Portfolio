import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Box,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Hammer,
  Map as MapIcon,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { items, textures } from "../assets/minecraft";
import {
  chestTabs,
  craftIngredients,
  milestones,
  profile,
  projects,
  sectionIds,
  sectionMeta,
  type ChestTabId,
  type SectionId,
  type WorldProject,
} from "./data";

const environments = {
  spawn: new URL("../assets/world-archive/spawn-environment.webp", import.meta.url).href,
  archive: new URL("../assets/world-archive/build-archive-environment.webp", import.meta.url).href,
  craft: new URL("../assets/world-archive/crafting-lab-environment.webp", import.meta.url).href,
  journey: new URL("../assets/world-archive/milestone-rail-environment.webp", import.meta.url).href,
  portal: new URL("../assets/world-archive/portal-environment.webp", import.meta.url).href,
};

const sectionIcons: Record<SectionId, string> = {
  spawn: items.compass,
  archive: items.chestMinecart,
  craft: items.diamondPickaxe,
  journey: items.minecart,
  portal: items.enderPearl,
};

const storageKeys = {
  openedProjects: "worldArchive.openedProjects",
  soundEnabled: "worldArchive.soundEnabled",
};

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;
type SoundKind = "click" | "select" | "chest" | "level";

const soundPatterns: Record<SoundKind, { start: number; end: number; duration: number; volume: number }> = {
  click: { start: 220, end: 165, duration: 0.055, volume: 0.025 },
  select: { start: 390, end: 620, duration: 0.08, volume: 0.028 },
  chest: { start: 150, end: 92, duration: 0.14, volume: 0.034 },
  level: { start: 560, end: 880, duration: 0.16, volume: 0.03 },
};

const knownProjectIds = projects.map((project) => project.id);

function getSectionFromPath(pathname: string) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (normalizedPath === "/home") {
    return "spawn";
  }

  return sectionIds.find((sectionId) => sectionMeta[sectionId].route === normalizedPath) ?? null;
}

function readStoredSet(key: string, fallback: string[], allowedValues?: readonly string[]) {
  if (typeof window === "undefined") {
    return new Set(fallback);
  }

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : fallback;
    const values = Array.isArray(parsed) ? parsed : fallback;
    return new Set(
      values.filter(
        (item): item is string =>
          typeof item === "string" && (!allowedValues || allowedValues.includes(item)),
      ),
    );
  } catch {
    return new Set(fallback);
  }
}

function saveStoredSet(key: string, value: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(value)));
  } catch {
    // Progress persistence is optional when storage is unavailable.
  }
}

function readStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? fallback : storedValue === "true";
  } catch {
    return fallback;
  }
}

function getMatchingProjects(selectedIngredients: Set<string>) {
  if (selectedIngredients.size === 0) {
    return projects;
  }

  return projects.filter((project) =>
    Array.from(selectedIngredients).every((ingredientId) => {
      const ingredient = craftIngredients.find((item) => item.id === ingredientId);
      return ingredient?.projectIds.includes(project.id) ?? false;
    }),
  );
}

function useGameAudio() {
  const [soundEnabled, setSoundEnabled] = useState(() => readStoredBoolean(storageKeys.soundEnabled, false));
  const audioContextRef = useRef<AudioContext | null>(null);

  const synthesize = useCallback((kind: SoundKind) => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioContextConstructor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    try {
      const context = audioContextRef.current ?? new AudioContextConstructor();
      audioContextRef.current = context;

      if (context.state === "suspended") {
        void context.resume();
      }

      const pattern = soundPatterns[kind];
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = kind === "chest" ? "sawtooth" : "square";
      oscillator.frequency.setValueAtTime(pattern.start, now);
      oscillator.frequency.exponentialRampToValueAtTime(pattern.end, now + pattern.duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(pattern.volume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + pattern.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + pattern.duration + 0.01);
    } catch {
      // Audio is an optional enhancement; the interface remains fully usable without it.
    }
  }, []);

  const playSound = useCallback(
    (kind: SoundKind) => {
      if (soundEnabled) {
        synthesize(kind);
      }
    },
    [soundEnabled, synthesize],
  );

  const toggleSound = useCallback(() => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);

    try {
      window.localStorage.setItem(storageKeys.soundEnabled, String(nextValue));
    } catch {
      // Persistence is optional when storage is unavailable.
    }

    if (nextValue) {
      synthesize("level");
    }
  }, [soundEnabled, synthesize]);

  useEffect(
    () => () => {
      const context = audioContextRef.current;
      audioContextRef.current = null;

      if (context && context.state !== "closed") {
        void context.close();
      }
    },
    [],
  );

  return { soundEnabled, playSound, toggleSound };
}

function scoreProject(project: WorldProject, selectedIngredients: Set<string>) {
  return craftIngredients.reduce((score, ingredient) => {
    if (!selectedIngredients.has(ingredient.id)) {
      return score;
    }

    return ingredient.projectIds.includes(project.id) ? score + 1 : score;
  }, 0);
}

function pickProjectFromIngredients(selectedIngredients: Set<string>) {
  if (selectedIngredients.size === 0) {
    return null;
  }

  return [...projects].sort((first, second) => {
    const scoreDelta = scoreProject(second, selectedIngredients) - scoreProject(first, selectedIngredients);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return projects.indexOf(first) - projects.indexOf(second);
  })[0];
}

function Environment({ id }: { id: SectionId }) {
  return (
    <>
      <img
        className="world-section__backdrop"
        src={environments[id]}
        alt=""
        aria-hidden="true"
        decoding="async"
        loading={id === "spawn" ? "eager" : "lazy"}
      />
      <div className="world-section__shade" aria-hidden="true" />
      <div className="world-section__scanline" aria-hidden="true" />
    </>
  );
}

function Header({
  activeSection,
  soundEnabled,
  onNavigate,
  onSoundToggle,
}: {
  activeSection: SectionId;
  soundEnabled: boolean;
  onNavigate: (sectionId: SectionId) => void;
  onSoundToggle: () => void;
}) {
  return (
    <header className="world-topbar">
      <button
        className="world-mark"
        type="button"
        onClick={() => onNavigate("spawn")}
        aria-label={`${profile.name} — Home`}
      >
        <span className="world-mark__slot" aria-hidden="true">
          <img src={items.compass} alt="" />
        </span>
        <span className="world-mark__name">{profile.name}</span>
      </button>
      <nav className="world-topbar__nav" aria-label="Primary">
        {sectionIds.map((sectionId) => (
          <button
            key={sectionId}
            type="button"
            className={activeSection === sectionId ? "is-active" : ""}
            onClick={() => onNavigate(sectionId)}
            aria-current={activeSection === sectionId ? "page" : undefined}
          >
            <img src={sectionIcons[sectionId]} alt="" aria-hidden="true" />
            <span>{sectionMeta[sectionId].label}</span>
          </button>
        ))}
      </nav>
      <div className="world-topbar__utility">
        <button
          className="sound-toggle"
          type="button"
          aria-label={soundEnabled ? "Turn interface sounds off" : "Turn interface sounds on"}
          aria-pressed={soundEnabled}
          onClick={onSoundToggle}
          title={soundEnabled ? "Sound on" : "Sound off"}
        >
          {soundEnabled ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

function Hero({
  onNavigate,
  prefersReducedMotion,
}: {
  onNavigate: (sectionId: SectionId) => void;
  prefersReducedMotion: boolean;
}) {
  const reveal = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="spawn" className="world-section world-hero" data-world-section>
      <Environment id="spawn" />
      <motion.div
        className="world-container world-hero__content"
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        transition={{ staggerChildren: prefersReducedMotion ? 0 : 0.09, delayChildren: prefersReducedMotion ? 0 : 0.08 }}
      >
        <motion.p className="world-kicker" variants={reveal} transition={{ duration: 0.34 }}>
          {profile.title} · Student
        </motion.p>
        <motion.h1 tabIndex={-1} variants={reveal} transition={{ duration: 0.42 }}>{profile.name}</motion.h1>
        <motion.p className="world-hero__lead" variants={reveal} transition={{ duration: 0.38 }}>
          {profile.summary}
        </motion.p>
        <motion.p className="world-hero__detail" variants={reveal} transition={{ duration: 0.38 }}>
          {profile.detail}
        </motion.p>
        <motion.div className="world-actions" variants={reveal} transition={{ duration: 0.38 }}>
          <button className="mc-button mc-button--primary" type="button" onClick={() => onNavigate("archive")}>
            <Box size={18} aria-hidden="true" />
            Explore {projects.length} Builds
          </button>
          <a className="mc-button" href={profile.githubUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={18} aria-hidden="true" />
            View GitHub
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProjectFrame({
  project,
  isOpen,
  buttonRef,
  onSelect,
}: {
  project: WorldProject;
  isOpen: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onSelect: (projectId: string) => void;
}) {
  return (
    <button
      ref={buttonRef}
      className={`archive-frame rarity-${project.rarity}${isOpen ? " is-open" : ""}`}
      type="button"
      onClick={() => onSelect(project.id)}
      aria-expanded={isOpen}
      aria-controls={`project-chest-${project.id}`}
    >
      <span className="archive-frame__image" aria-hidden="true">
        <img className="archive-frame__wood" src={items.itemFrame} alt="" />
        <img className="archive-frame__item" src={items[project.icon]} alt="" />
      </span>
      <span className="archive-frame__meta">
        <span>{project.name}</span>
        <small>{project.category}</small>
      </span>
    </button>
  );
}

function ProjectChest({
  project,
  activeTab,
  onTabChange,
  onClose,
  onProjectMove,
}: {
  project: WorldProject;
  activeTab: ChestTabId;
  onTabChange: (tab: ChestTabId) => void;
  onClose: () => void;
  onProjectMove: (direction: -1 | 1) => void;
}) {
  const tabPanelId = "project-chest-panel";

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % chestTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + chestTabs.length) % chestTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = chestTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    onTabChange(chestTabs[nextIndex].id);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    tabs?.[nextIndex]?.focus();
  };

  return (
    <motion.aside
      id={`project-chest-${project.id}`}
      className="project-chest"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      aria-labelledby="project-chest-title"
    >
      <div className="project-chest__lid">
        <div>
          <p className="world-kicker">Opened Chest</p>
          <h3 id="project-chest-title">{project.name}</h3>
        </div>
        <div className="project-chest__tools">
          <button type="button" className="icon-button" onClick={() => onProjectMove(-1)} aria-label="Previous project">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" onClick={() => onProjectMove(1)} aria-label="Next project">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close project chest">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="project-chest__body">
        <div className="project-chest__artifact">
          <span className={`rarity-gem rarity-${project.rarity}`}>{project.rarity}</span>
          <img src={items[project.icon]} alt="" aria-hidden="true" />
          <p>{project.analogy}</p>
        </div>

        <div className="project-chest__content">
          <div className="chest-tabs" role="tablist" aria-label={`${project.name} details`}>
            {chestTabs.map((tab, tabIndex) => (
              <button
                key={tab.id}
                id={`chest-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={tabPanelId}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={activeTab === tab.id ? "is-active" : ""}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, tabIndex)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div
            id={tabPanelId}
            className="chest-tab-panel"
            role="tabpanel"
            aria-labelledby={`chest-tab-${activeTab}`}
          >
            {activeTab === "blueprint" ? (
              <div className="chest-prose">
                <p>{project.summary}</p>
                <dl>
                  <div>
                    <dt>Problem</dt>
                    <dd>{project.problem}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                </dl>
              </div>
            ) : null}

            {activeTab === "recipe" ? (
              <ul className="ingredient-list">
                {project.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            ) : null}

            {activeTab === "capabilities" ? (
              <ul className="chest-list">
                {project.capabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
            ) : null}

            {activeTab === "source" ? (
              <div className="source-grid">
                <div>
                  <h4>Evidence</h4>
                  <ul className="chest-list">
                    {project.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Tradeoffs</h4>
                  <ul className="chest-list">
                    {project.tradeoffs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="project-links">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={17} aria-hidden="true" />
                    Repository
                  </a>
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={17} aria-hidden="true" />
                      Live
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function BuildArchive({
  selectedProjectId,
  activeTab,
  onProjectSelect,
  onProjectClose,
  onTabChange,
  onProjectMove,
}: {
  selectedProjectId: string;
  activeTab: ChestTabId;
  onProjectSelect: (projectId: string) => void;
  onProjectClose: () => void;
  onTabChange: (tab: ChestTabId) => void;
  onProjectMove: (direction: -1 | 1) => void;
}) {
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const chestRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (selectedProject) {
      const scrollTimer = window.setTimeout(
        () => chestRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        80,
      );

      return () => window.clearTimeout(scrollTimer);
    }

    return undefined;
  }, [selectedProject?.id]);

  const closeProjectAndRestoreFocus = () => {
    const closingProjectId = selectedProjectId;
    onProjectClose();
    window.requestAnimationFrame(() => frameRefs.current.get(closingProjectId)?.focus());
  };

  return (
    <section id="archive" className="world-section build-archive" data-world-section>
      <Environment id="archive" />
      <div className="world-container">
        <div className="section-heading">
          <p className="world-kicker">Build Archive</p>
          <h1 className="section-title" tabIndex={-1}>Item frames that open into project chests.</h1>
          <p>Open a frame to inspect the problem, stack, capabilities, source evidence, and trade-offs behind each build.</p>
        </div>
        <div className="archive-grid" aria-label="Projects">
          {projects.map((project) => (
            <ProjectFrame
              key={project.id}
              project={project}
              isOpen={selectedProjectId === project.id}
              buttonRef={(node) => {
                if (node) {
                  frameRefs.current.set(project.id, node);
                } else {
                  frameRefs.current.delete(project.id);
                }
              }}
              onSelect={onProjectSelect}
            />
          ))}
        </div>
        <div ref={chestRef} className="project-chest-anchor">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <ProjectChest
                key={selectedProject.id}
                project={selectedProject}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onClose={closeProjectAndRestoreFocus}
                onProjectMove={onProjectMove}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function CraftingLab({
  selectedIngredients,
  craftedProject,
  matchingProjects,
  onIngredientToggle,
  onClearIngredients,
  onOpenProject,
}: {
  selectedIngredients: Set<string>;
  craftedProject: WorldProject | null;
  matchingProjects: WorldProject[];
  onIngredientToggle: (ingredientId: string) => void;
  onClearIngredients: () => void;
  onOpenProject: (projectId: string) => void;
}) {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const hasSelection = selectedIngredients.size > 0;
  const hasExactRecipe = hasSelection && matchingProjects.length > 0;
  const matchLabel =
    selectedIngredients.size === 0
      ? `${matchingProjects.length} recipes available`
      : `${matchingProjects.length} exact ${matchingProjects.length === 1 ? "recipe" : "recipes"}`;
  const suggestedProjects = matchingProjects.length > 0 ? matchingProjects : craftedProject ? [craftedProject] : [];
  const visibleRecipes = showAllRecipes ? suggestedProjects : suggestedProjects.slice(0, 3);

  return (
    <section id="craft" className="world-section crafting-lab" data-world-section>
      <Environment id="craft" />
      <div className="world-container crafting-layout">
        <div className="section-heading">
          <p className="world-kicker">Crafting Lab</p>
          <h1 className="section-title" tabIndex={-1}>Build a project recipe.</h1>
          <p>Select resource blocks. The number on each slot shows how many projects use it; combining blocks narrows the recipe book.</p>
        </div>

        <aside className="recipe-book" aria-label="Recipe hints">
          <div className="recipe-book__heading">
            <span className="recipe-book__icon" aria-hidden="true">
              <BookOpen size={22} />
            </span>
            <div>
              <p className="world-kicker">Recipe Book</p>
              <h3 role="status" aria-live="polite">
                {!hasSelection || hasExactRecipe ? matchLabel : "No exact recipe"}
              </h3>
            </div>
            <button type="button" onClick={onClearIngredients} disabled={selectedIngredients.size === 0}>
              Clear grid
            </button>
          </div>
          <p className="recipe-book__hint">
            {selectedIngredients.size === 0
              ? "Choose a resource to see which builds can be crafted with it."
              : hasExactRecipe
                ? "These builds contain every resource currently selected. Choose one to open its project chest."
                : "That stack has no exact recipe. Remove one resource, or use the closest-match output on the table."}
          </p>
          <div className="recipe-book__results">
            {visibleRecipes.map((project) => (
              <button key={project.id} type="button" onClick={() => onOpenProject(project.id)}>
                <img src={items[project.icon]} alt="" aria-hidden="true" />
                <span>{project.name}</span>
                <small>{matchingProjects.length > 0 ? "Open recipe" : "Closest match"}</small>
              </button>
            ))}
            {suggestedProjects.length > 3 ? (
              <button
                className="recipe-book__more"
                type="button"
                onClick={() => setShowAllRecipes((current) => !current)}
                aria-expanded={showAllRecipes}
              >
                {showAllRecipes ? "Show fewer" : `Show ${suggestedProjects.length - 3} more`}
              </button>
            ) : null}
          </div>
        </aside>

        <div className="crafting-table" style={{ "--craft-texture": `url(${textures.craftingTop})` } as CSSVars}>
          <div className="craft-grid" aria-label="Craft ingredients">
            {craftIngredients.map((ingredient) => {
              const isSelected = selectedIngredients.has(ingredient.id);
              const recipeCount = ingredient.projectIds.length;

              return (
                <button
                  key={ingredient.id}
                  type="button"
                  className={`craft-slot${isSelected ? " is-selected" : ""}`}
                  aria-pressed={isSelected}
                  aria-label={`${ingredient.name}, used in ${recipeCount} ${recipeCount === 1 ? "recipe" : "recipes"}`}
                  onClick={() => onIngredientToggle(ingredient.id)}
                >
                  <small className="craft-slot__count" aria-hidden="true">{recipeCount}</small>
                  <img src={items[ingredient.icon]} alt="" aria-hidden="true" />
                  <span>{ingredient.name}</span>
                </button>
              );
            })}
          </div>
          <div className="craft-arrow" aria-hidden="true" />
          {craftedProject ? (
            <button className="craft-result" type="button" onClick={() => onOpenProject(craftedProject.id)}>
              <span>{hasExactRecipe ? "Crafted output" : "Closest output"}</span>
              <img src={items[craftedProject.icon]} alt="" aria-hidden="true" />
              <strong>{craftedProject.name}</strong>
              <small>{craftedProject.category}</small>
            </button>
          ) : (
            <div className="craft-result craft-result--empty" aria-live="polite">
              <span>Output</span>
              <Box className="craft-result__placeholder" size={38} aria-hidden="true" />
              <strong>Select resources</strong>
              <small>The output appears here.</small>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MilestoneRail({
  activeStationIndex,
  onStationSelect,
  onProjectOpen,
}: {
  activeStationIndex: number;
  onStationSelect: (index: number) => void;
  onProjectOpen: (projectId: string) => void;
}) {
  const station = milestones[activeStationIndex];
  const progress = milestones.length > 1 ? (activeStationIndex / (milestones.length - 1)) * 100 : 0;
  const stationButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (activeStationIndex + delta + milestones.length) % milestones.length;
    onStationSelect(nextIndex);
    stationButtonRefs.current[nextIndex]?.focus();
  };

  return (
    <section id="journey" className="world-section milestone-rail" data-world-section>
      <Environment id="journey" />
      <div className="world-container">
        <div className="section-heading">
          <p className="world-kicker">Milestone Rail</p>
          <h1 className="section-title" tabIndex={-1}>The journey reads like connected stations.</h1>
          <p>Every stop points back to real repositories instead of vague resume lines.</p>
        </div>

        <div className="rail-console">
          <div
            className="rail-track"
            style={{ "--rail-progress": `${progress}%` } as CSSVars}
            onKeyDown={handleRailKeyDown}
            aria-label="Journey stations"
          >
            <img className="rail-track__cart" src={items.minecart} alt="" aria-hidden="true" />
            {milestones.map((milestone, index) => (
              <button
                key={milestone.id}
                ref={(node) => {
                  stationButtonRefs.current[index] = node;
                }}
                type="button"
                className={index === activeStationIndex ? "is-active" : ""}
                onClick={() => onStationSelect(index)}
                aria-current={index === activeStationIndex ? "step" : undefined}
                aria-label={`Station ${index + 1}: ${milestone.title}`}
              >
                <span>{index + 1}</span>
              </button>
            ))}
          </div>

          <article className="station-panel">
            <div>
              <p className="world-kicker">{station.biome}</p>
              <h3>{station.title}</h3>
              <p>{station.detail}</p>
            </div>
            <div className="station-projects">
              {station.projectIds.map((projectId) => {
                const project = projects.find((item) => item.id === projectId);
                if (!project) {
                  return null;
                }

                return (
                  <button key={project.id} type="button" onClick={() => onProjectOpen(project.id)}>
                    <img src={items[project.icon]} alt="" aria-hidden="true" />
                    {project.name}
                  </button>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function PortalFinale({ openedCount }: { openedCount: number }) {
  return (
    <section id="portal" className="world-section portal-finale" data-world-section>
      <Environment id="portal" />
      <div className="world-container portal-layout">
        <div className="portal-copy">
          <p className="world-kicker">Portal Room</p>
          <h1 className="section-title" tabIndex={-1}>Leave through the source portal.</h1>
          <p>
            The archive keeps its progress locally: {openedCount} of {projects.length} project chests have been opened on
            this browser.
          </p>
          <div className="world-actions">
            <a className="mc-button mc-button--primary" href={profile.githubUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={18} aria-hidden="true" />
              GitHub
            </a>
            <a className="mc-button" href={profile.linkedinUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={18} aria-hidden="true" />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="portal-ledger" aria-label="Archive summary">
          <div>
            <BookOpen size={22} aria-hidden="true" />
            <span>Projects</span>
            <strong>{projects.length}</strong>
          </div>
          <div>
            <Hammer size={22} aria-hidden="true" />
            <span>Skill Ingredients</span>
            <strong>{craftIngredients.length}</strong>
          </div>
          <div>
            <MapIcon size={22} aria-hidden="true" />
            <span>Milestones</span>
            <strong>{milestones.length}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorldArchive() {
  const prefersReducedMotion = useReducedMotion();
  const { soundEnabled, playSound, toggleSound } = useGameAudio();
  const location = useLocation();
  const navigate = useNavigate();
  const routeSection = getSectionFromPath(location.pathname);
  const activeSection = routeSection ?? "spawn";
  const [openedProjects, setOpenedProjects] = useState(() =>
    readStoredSet(storageKeys.openedProjects, [], knownProjectIds),
  );
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [activeTab, setActiveTab] = useState<ChestTabId>("blueprint");
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(() => new Set(["typescript", "django"]));
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const previousSectionRef = useRef(activeSection);

  const craftedProject = useMemo(() => pickProjectFromIngredients(selectedIngredients), [selectedIngredients]);
  const matchingProjects = useMemo(() => getMatchingProjects(selectedIngredients), [selectedIngredients]);

  const navigateToSection = useCallback((sectionId: SectionId) => {
    playSound("click");
    if (sectionId === "archive") {
      setSelectedProjectId("");
    }
    if (sectionId === activeSection) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    navigate(sectionMeta[sectionId].route);
  }, [activeSection, navigate, playSound, prefersReducedMotion]);

  const markProjectOpened = useCallback((projectId: string) => {
    setOpenedProjects((current) => (current.has(projectId) ? current : new Set(current).add(projectId)));
  }, []);

  const openProject = useCallback(
    (projectId: string) => {
      playSound("chest");
      setSelectedProjectId(projectId);
      setActiveTab("blueprint");
      markProjectOpened(projectId);
      if (activeSection !== "archive") {
        navigate(sectionMeta.archive.route);
      }
    },
    [activeSection, markProjectOpened, navigate, playSound],
  );

  const closeProject = useCallback(() => {
    setSelectedProjectId("");
  }, []);

  const moveProject = useCallback(
    (direction: -1 | 1) => {
      const currentIndex = projects.findIndex((project) => project.id === selectedProjectId);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + projects.length) % projects.length;
      openProject(projects[nextIndex].id);
    },
    [openProject, selectedProjectId],
  );

  const toggleIngredient = useCallback((ingredientId: string) => {
    playSound("select");
    setSelectedIngredients((current) => {
      const next = new Set(current);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  }, [playSound]);

  const clearIngredients = useCallback(() => {
    playSound("click");
    setSelectedIngredients(new Set());
  }, [playSound]);

  const changeChestTab = useCallback((tab: ChestTabId) => {
    playSound("select");
    setActiveTab(tab);
  }, [playSound]);

  const selectStation = useCallback((index: number) => {
    playSound("select");
    setActiveStationIndex(index);
  }, [playSound]);

  useEffect(() => {
    if (!routeSection) {
      navigate(sectionMeta.spawn.route, { replace: true });
    } else if (location.pathname !== sectionMeta[routeSection].route) {
      navigate(sectionMeta[routeSection].route, { replace: true });
    }
  }, [location.pathname, navigate, routeSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeSection]);

  useEffect(() => {
    saveStoredSet(storageKeys.openedProjects, openedProjects);
  }, [openedProjects]);

  useEffect(() => {
    document.title =
      activeSection === "spawn"
        ? "Harshpreet | Developer World"
        : `${sectionMeta[activeSection].label} | Harshpreet`;

    if (previousSectionRef.current === activeSection) {
      return;
    }

    previousSectionRef.current = activeSection;
    const focusTimer = window.setTimeout(() => {
      document.querySelector<HTMLElement>("[data-world-section] h1")?.focus({ preventScroll: true });
    }, prefersReducedMotion ? 0 : 240);

    return () => window.clearTimeout(focusTimer);
  }, [activeSection, prefersReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isTyping) {
        return;
      }

      if (event.key === "Escape") {
        closeProject();
      }

    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeProject]);

  const renderedPage = (() => {
    switch (activeSection) {
      case "archive":
        return (
          <BuildArchive
            selectedProjectId={selectedProjectId}
            activeTab={activeTab}
            onProjectSelect={openProject}
            onProjectClose={closeProject}
            onTabChange={changeChestTab}
            onProjectMove={moveProject}
          />
        );
      case "craft":
        return (
          <CraftingLab
            selectedIngredients={selectedIngredients}
            craftedProject={craftedProject}
            matchingProjects={matchingProjects}
            onIngredientToggle={toggleIngredient}
            onClearIngredients={clearIngredients}
            onOpenProject={openProject}
          />
        );
      case "journey":
        return (
          <MilestoneRail
            activeStationIndex={activeStationIndex}
            onStationSelect={selectStation}
            onProjectOpen={openProject}
          />
        );
      case "portal":
        return <PortalFinale openedCount={openedProjects.size} />;
      case "spawn":
      default:
        return <Hero onNavigate={navigateToSection} prefersReducedMotion={Boolean(prefersReducedMotion)} />;
    }
  })();

  return (
    <MotionConfig reducedMotion="user">
      <main className={`world-archive${prefersReducedMotion ? " prefers-reduced-motion" : ""}`}>
        <Header
          activeSection={activeSection}
          soundEnabled={soundEnabled}
          onNavigate={navigateToSection}
          onSoundToggle={toggleSound}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            className="world-page-motion"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {renderedPage}
          </motion.div>
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
