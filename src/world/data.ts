import type { items } from "../assets/minecraft";

export const sectionIds = ["spawn", "archive", "craft", "journey", "portal"] as const;

export type SectionId = (typeof sectionIds)[number];
export type ItemId = keyof typeof items;
export type ChestTabId = "blueprint" | "recipe" | "capabilities" | "source";

export type WorldProject = {
  id: string;
  name: string;
  category: string;
  rarity: "common" | "uncommon" | "rare" | "epic";
  icon: ItemId;
  summary: string;
  problem: string;
  role: string;
  analogy: string;
  ingredients: string[];
  capabilities: string[];
  evidence: string[];
  tradeoffs: string[];
  githubUrl: string;
  liveUrl?: string;
};

export type CraftIngredient = {
  id: string;
  name: string;
  icon: ItemId;
  projectIds: string[];
};

export type Milestone = {
  id: string;
  title: string;
  biome: string;
  detail: string;
  projectIds: string[];
};

export const sectionMeta: Record<SectionId, { label: string; route: string }> = {
  spawn: { label: "Home", route: "/" },
  archive: { label: "Projects", route: "/archive" },
  craft: { label: "Skills", route: "/craft" },
  journey: { label: "Journey", route: "/journey" },
  portal: { label: "Contact", route: "/portal" },
};

export const projects: WorldProject[] = [
  {
    id: "leetmentor",
    name: "LeetMentor",
    category: "AI coding mentor",
    rarity: "epic",
    icon: "experienceBottle",
    summary:
      "A dual-surface DSA practice product: Django web workspace plus a Chrome extension prototype that calls a local Express proxy.",
    problem:
      "Interview practice often turns into copy-paste AI. This keeps hints, reviews, dry runs, and problem context inside the study loop.",
    role:
      "Full-stack builder across Django templates, Chrome extension UI, Express TypeScript proxying, LeetCode GraphQL, and Groq mentor flows.",
    analogy:
      "An enchanted lectern beside a chest. The frame holds the current LeetCode quest, and the chest opens into hints, anvil-style review, complexity notes, and dry-run maps.",
    ingredients: ["Django", "TypeScript", "Express", "Groq", "LeetCode GraphQL", "Chrome MV3"],
    capabilities: [
      "Problem lookup, daily challenge, metadata, tags, and language selection.",
      "Three hint levels plus explain, debug, complexity, optimize, dry-run, and solution modes.",
      "Local drafts and history in the extension surface.",
      "Render-hosted Django app with a separate local extension/backend prototype."
    ],
    evidence: [
      "The Django app, extension package, and Express server are separate code paths.",
      "The production deployment hosts the Django workspace; the extension flow targets localhost."
    ],
    tradeoffs: [
      "The extension backend is not production hosted.",
      "Some fallback answers are tag-driven heuristics and need stricter safeguards before public use."
    ],
    githubUrl: "https://github.com/Harshpreet1729/LeetMentor",
    liveUrl: "https://leetmentor-1ya8.onrender.com",
  },
  {
    id: "blindcoder",
    name: "BlindCoder VS Code Extension",
    category: "Accessibility developer tooling",
    rarity: "epic",
    icon: "diamondSword",
    summary:
      "A TypeScript VS Code extension project for audio-augmented Python editing, diagnostics, training, and WebView controls.",
    problem:
      "Code feedback is still heavily visual. This explores keyboard-first audio cues for developers who rely on sound and structured navigation.",
    role:
      "Extension engineer reading and shaping VS Code commands, WebView panels, generated earcons, Python diagnostic handling, and optional AI repair hooks.",
    analogy:
      "A diamond sword that hums when danger is near. Diagnostics become note-block cues, and the training arena teaches where each sound points.",
    ingredients: ["TypeScript", "VS Code API", "WebView", "Speech Synthesis", "Python", "Audio cues"],
    capabilities: [
      "Commands for line reading, error navigation, summaries, quiet mode, and training flows.",
      "WebView controls for speech and audio preferences.",
      "Generated WAV earcons and heuristic diagnostic classification.",
      "Optional Gemini-assisted repair path in the source."
    ],
    evidence: [
      "The extension manifest defines commands, keybindings, settings, and VS Code activation points.",
      "Source files use VS Code APIs, WebViews, filesystem/audio helpers, and Python-oriented diagnostics."
    ],
    tradeoffs: [
      "It is a prototype/forked extension, not a marketplace-polished accessibility product.",
      "AI repair behavior is optional and needs careful validation for accessibility-critical workflows."
    ],
    githubUrl: "https://github.com/Harshpreet1729/Audio-Augmented-Coding-Editor-for-Blind-Programmers",
  },
  {
    id: "writeyourown",
    name: "WriteYourOwn",
    category: "Django writing workspace",
    rarity: "epic",
    icon: "writtenBook",
    summary:
      "A private server-rendered writing workspace with email login, owner-scoped articles, HTMX search, pagination, and production packaging.",
    problem:
      "Writers need a private place to draft, search, and manage their own work without exposing every article as a public post.",
    role:
      "Backend-focused builder handling custom user/auth flow, article ownership, derived word counts, search, templates, Docker, and deployment settings.",
    analogy:
      "A locked enchanted library. Every signed book belongs to its player, and redstone search lights up the right shelf without reloading the whole hall.",
    ingredients: ["Django 6", "django-allauth", "HTMX", "Alpine", "PostgreSQL", "WhiteNoise", "Docker"],
    capabilities: [
      "Email-first authentication and verified-user flow.",
      "Owner-scoped article create, update, delete, dashboard, and search.",
      "Automatic word counts, statuses, pagination, and server-rendered templates.",
      "Gunicorn, WhiteNoise, Docker, Railway/production-style settings."
    ],
    evidence: [
      "The repository includes Django apps, templates, migrations, static output, tests, Dockerfile, and deployment config.",
      "The UI is private-workspace oriented; published is a status field, not a public publishing network."
    ],
    tradeoffs: [
      "A development seed/migration hygiene issue needs cleanup before treating it as production-ready.",
      "Search uses a PostgreSQL-specific path in places and needs a stronger SQLite fallback."
    ],
    githubUrl: "https://github.com/Harshpreet1729/WriteYourOwn",
  },
  {
    id: "textforge",
    name: "TextForge Engine",
    category: "C++ editor core",
    rarity: "epic",
    icon: "diamondPickaxe",
    summary:
      "A C++17 text editor engine with a gap buffer, command-pattern undo/redo, file I/O, search/replace, stats, CMake, and CTest.",
    problem:
      "Most editor demos only show UI. This digs into the storage, cursor, mutation, and history mechanics underneath a real text editor.",
    role:
      "Systems programmer building the buffer model, command history, CLI demo, CMake structure, and command-line tests.",
    analogy:
      "A diamond pickaxe for mining text blocks. The gap buffer moves like a tunnel, and undo/redo stacks store every mined block as a reversible command.",
    ingredients: ["C++17", "CMake", "CTest", "Gap buffer", "Command pattern", "File I/O"],
    capabilities: [
      "Cursor-aware insertion, deletion, and movement.",
      "Undo/redo through command objects and separate history stacks.",
      "Case-sensitive and case-insensitive search/replace.",
      "Document statistics, file loading/saving, CLI demo, and test suite."
    ],
    evidence: [
      "The codebase includes engine headers/sources, a CLI entry point, CMake config, and eight tests.",
      "It is a reusable editor core rather than a full graphical editor."
    ],
    tradeoffs: [
      "The project demonstrates the core engine; a polished GUI/editor surface is intentionally outside the current scope."
    ],
    githubUrl: "https://github.com/Harshpreet1729/textforge-engine",
  },
  {
    id: "prescription",
    name: "Prescription Scanner",
    category: "Applied ML prototype",
    rarity: "rare",
    icon: "potion",
    summary:
      "A Tkinter plus PyTorch prototype that classifies pre-cropped medicine-word images using a modified grayscale ResNet18 model.",
    problem:
      "Handwritten medicine text is hard to triage. This explores whether cropped prescription words can be mapped to medicine labels and purposes.",
    role:
      "ML developer assembling the training script, model definition, prediction path, Tkinter UI, CSV mapping, and metric plots.",
    analogy:
      "A potion scriptorium. Cropped handwritten runes enter the brewing stand, and the model sorts them into medicine barrels with purpose labels.",
    ingredients: ["Python", "PyTorch", "torchvision", "ResNet18", "Tkinter", "Pandas", "scikit-learn"],
    capabilities: [
      "64x64 grayscale image classification.",
      "Rotation and affine augmentation in the training pipeline.",
      "CSV-based medicine label and purpose mapping.",
      "Desktop image-picker flow with background prediction thread."
    ],
    evidence: [
      "The tracked source includes training, model, prediction, UI, and plotting code.",
      "The repository does not include the dataset, encoder, or checkpoints needed for a clean-clone run."
    ],
    tradeoffs: [
      "It classifies cropped medicine-word images, not whole prescriptions.",
      "Training and inference preprocessing need alignment before stronger accuracy claims."
    ],
    githubUrl: "https://github.com/Harshpreet1729/Prescription-Scanner-Medicine-Identifier",
  },
  {
    id: "self-pruning",
    name: "Self-Pruning Neural Network",
    category: "ML systems research",
    rarity: "rare",
    icon: "redstone",
    summary:
      "A PyTorch experiment that adds learnable sigmoid gates to linear layers and balances classification loss against sparsity loss.",
    problem:
      "Neural networks can carry unnecessary connections. This project studies whether the model can learn which paths to disconnect during training.",
    role:
      "Experimenter implementing the gated layer, sparsity objective, CIFAR-10 training loop, metric table, and visualizations.",
    analogy:
      "A redstone machine that learns to cut weak wires. The circuit keeps the paths that power useful predictions and darkens the rest.",
    ingredients: ["Python", "PyTorch", "torchvision", "CIFAR-10", "NumPy", "Matplotlib", "tqdm"],
    capabilities: [
      "Custom PrunableLinear layer with learned gates.",
      "Combined classification and sparsity objective.",
      "Lambda comparisons for accuracy versus sparsity.",
      "Gate-distribution visualization."
    ],
    evidence: [
      "The source includes model, train, evaluation, and visualization scripts.",
      "The project is research-style and does not ship an app or API."
    ],
    tradeoffs: [
      "No test suite or seeded experiment harness is present.",
      "Results should be framed as exploratory unless rerun with controlled metrics."
    ],
    githubUrl: "https://github.com/Harshpreet1729/self-pruning-neural-network",
  },
  {
    id: "vaani",
    name: "Vaani Personal Assistant",
    category: "Authenticated AI chat",
    rarity: "rare",
    icon: "amethystShard",
    summary:
      "A Django 6 authenticated chat prototype that calls OpenRouter and keeps the browser transcript in localStorage.",
    problem:
      "A personal assistant needs a protected interface and visible conversation continuity, even before deeper tool automation exists.",
    role:
      "Full-stack prototype builder handling Django auth, JSON chat endpoint, OpenRouter calls, Tailwind styling, and local transcript behavior.",
    analogy:
      "An amethyst echo chamber. The shelf remembers the transcript locally, but each oracle cart currently carries only the newest page to the model.",
    ingredients: ["Django 6", "OpenRouter", "Tailwind", "JavaScript", "localStorage", "urllib"],
    capabilities: [
      "Login-protected chat page and JSON endpoint.",
      "OpenRouter model calls with fallback model configuration.",
      "Remember-me UI and local browser transcript persistence.",
      "Tailwind-styled authenticated interface."
    ],
    evidence: [
      "The source sends the current prompt to OpenRouter; it does not send the full restored transcript.",
      "The repository name says voice assistant, but the audited implementation is text chat."
    ],
    tradeoffs: [
      "No speech, system automation, or tool execution layer is implemented yet.",
      "Development security settings need hardening before deployment."
    ],
    githubUrl: "https://github.com/Harshpreet1729/PersonalVoiceAssistant",
  },
  {
    id: "emotion-music",
    name: "Emotion Music Recommender",
    category: "Browser ML music app",
    rarity: "rare",
    icon: "glowstoneDust",
    summary:
      "A client-side webcam emotion detector using face-api.js/TensorFlow.js model shards and YouTube search integration.",
    problem:
      "Mood can be a faster path into music discovery than typing a query. This turns detected expression into a YouTube recommendation flow.",
    role:
      "Frontend builder wiring webcam access, face-api models, emotion state, responsive UI, and YouTube API calls.",
    analogy:
      "A glowstone jukebox cave. The player face lights a mood lamp, and the jukebox opens tracks that match the expression.",
    ingredients: ["HTML", "CSS", "JavaScript", "face-api.js", "TensorFlow.js", "YouTube API"],
    capabilities: [
      "Webcam-based emotion detection in the browser.",
      "Bundled face-api model shards.",
      "Emotion-to-search mapping for music discovery.",
      "Client-only responsive UI."
    ],
    evidence: [
      "The repository includes model files, scripts, styles, and direct browser integration.",
      "The app requires browser camera permission and API configuration to be useful."
    ],
    tradeoffs: [
      "The YouTube API key/configuration is client-side and should be handled more carefully for production.",
      "Emotion inference should be treated as playful UX, not a reliable mental-state signal."
    ],
    githubUrl: "https://github.com/Harshpreet1729/EmotionMusicRecommender",
  },
  {
    id: "budget-tracker",
    name: "Budget Tracker",
    category: "Local finance utility",
    rarity: "uncommon",
    icon: "emerald",
    summary:
      "A vanilla HTML/CSS/JavaScript budget tool with localStorage transactions, balance math, month grouping, sorting, and deletion.",
    problem:
      "Small personal budgets need fast local entry before they need accounts, sync, or a backend.",
    role:
      "Frontend developer implementing state, summaries, month grouping, sorting controls, delete behavior, and offline persistence.",
    analogy:
      "An emerald ledger at a village trading post. Income and expenses go into the chest, then sort into month shelves.",
    ingredients: ["HTML", "CSS", "JavaScript", "localStorage"],
    capabilities: [
      "Income and expense entry.",
      "Running balance and transaction list.",
      "Month grouping and amount sorting.",
      "Delete action with local persistence."
    ],
    evidence: [
      "The repository is a compact four-file browser app.",
      "All state is stored locally in the browser."
    ],
    tradeoffs: [
      "No backend sync, accounts, import/export, or shared budgeting flows are included."
    ],
    githubUrl: "https://github.com/Harshpreet1729/BudgetTracker",
  },
  {
    id: "world-archive",
    name: "Minecraft World Archive",
    category: "Portfolio experience",
    rarity: "epic",
    icon: "compass",
    summary:
      "This redesigned React/Vite portfolio: a route-based Minecraft archive with generated voxel environments, item-frame projects, chests, crafting, rail, and portal rooms.",
    problem:
      "A portfolio can show taste and technical judgement by presenting projects as explorable systems instead of plain cards.",
    role:
      "Frontend architect translating repo audits into source-backed data, responsive UI, animations, generated assets, and local progress state.",
    analogy:
      "The whole portfolio is a mountain base: item frames open project chests, skills combine on a crafting table, milestones ride a rail, and links leave through a portal.",
    ingredients: ["React", "TypeScript", "Vite", "Framer Motion", "Minecraft textures", "Generated bitmap art"],
    capabilities: [
      "Route-based room navigation with locally persisted project-chest progress.",
      "Project chest tabs with source-backed implementation details.",
      "Crafting grid that maps skills to matching projects.",
      "Minecart milestone track and portal contact surface."
    ],
    evidence: [
      "The app uses local assets from the repository plus generated environment plates.",
      "Older route files are preserved in the tree while the new archive becomes the active surface."
    ],
    tradeoffs: [
      "Legacy portfolio pages remain in the source tree, while the World Archive is the active routed experience."
    ],
    githubUrl: "https://github.com/Harshpreet1729/Minecraft-based-Portfolio",
  },
];

export const craftIngredients: CraftIngredient[] = [
  { id: "python", name: "Python", icon: "potion", projectIds: ["leetmentor", "prescription", "self-pruning", "vaani"] },
  { id: "typescript", name: "TypeScript", icon: "writtenBook", projectIds: ["leetmentor", "blindcoder", "world-archive"] },
  { id: "django", name: "Django", icon: "diamondPickaxe", projectIds: ["leetmentor", "writeyourown", "vaani"] },
  { id: "accessibility", name: "Accessibility", icon: "diamondSword", projectIds: ["blindcoder"] },
  { id: "machine-learning", name: "ML", icon: "experienceBottle", projectIds: ["prescription", "self-pruning", "emotion-music"] },
  { id: "cpp", name: "C++", icon: "ironSword", projectIds: ["textforge"] },
  { id: "browser", name: "Browser UI", icon: "map", projectIds: ["emotion-music", "budget-tracker", "world-archive"] },
  { id: "systems", name: "Systems", icon: "redstone", projectIds: ["textforge", "self-pruning"] },
  { id: "deployment", name: "Deploy", icon: "chestMinecart", projectIds: ["leetmentor", "writeyourown", "world-archive"] },
];

export const milestones: Milestone[] = [
  {
    id: "browser-utility",
    title: "Browser Utility Builds",
    biome: "Village trading post",
    detail: "Local-first apps for money tracking and mood-based music discovery.",
    projectIds: ["budget-tracker", "emotion-music"],
  },
  {
    id: "systems-core",
    title: "Systems Core",
    biome: "Deep slate mine",
    detail: "TextForge proves data structures, cursor movement, undo/redo, tests, and CLI thinking.",
    projectIds: ["textforge"],
  },
  {
    id: "django-products",
    title: "Django Product Work",
    biome: "Enchanted library",
    detail: "Authenticated web workspaces with ownership, search, templates, deployment config, and API boundaries.",
    projectIds: ["writeyourown", "leetmentor", "vaani"],
  },
  {
    id: "applied-ai",
    title: "Applied AI Experiments",
    biome: "Potion lab",
    detail: "Computer vision, pruning, and LLM interfaces, framed carefully around what the source can actually support.",
    projectIds: ["prescription", "self-pruning", "vaani", "leetmentor"],
  },
  {
    id: "accessibility-tools",
    title: "Accessibility Tooling",
    biome: "Amethyst sound chamber",
    detail: "Audio-first editor feedback, diagnostics, training, and command design for non-visual coding workflows.",
    projectIds: ["blindcoder"],
  },
  {
    id: "world-archive",
    title: "World Archive",
    biome: "Mountain base",
    detail: "A source-backed portfolio that turns every repository into a Minecraft-style object with a usable chest of details.",
    projectIds: ["world-archive"],
  },
];

export const chestTabs: { id: ChestTabId; label: string }[] = [
  { id: "blueprint", label: "Blueprint" },
  { id: "recipe", label: "Recipe" },
  { id: "capabilities", label: "Can Do" },
  { id: "source", label: "Source" },
];

export const profile = {
  name: "Harshpreet",
  title: "Software Developer",
  education: "Thapar Institute of Engineering & Technology, Patiala",
  summary: "Building useful software, block by block.",
  detail:
    "I’m Harshpreet, a student at Thapar Institute of Engineering & Technology, Patiala. I build accessible developer tools, Django products, C++ systems, and applied-AI prototypes.",
  githubUrl: "https://github.com/Harshpreet1729",
  linkedinUrl: "https://www.linkedin.com/in/harshpreet1729",
};
