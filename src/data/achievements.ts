import type { Achievement } from "../types";

export const achievements: Achievement[] = [
  {
    id: "entered-world",
    title: "Entered Developer World",
    description: "Created a portfolio that feels like an explorable Minecraft survival world.",
    unlock: "Portfolio world loaded",
    rarity: "legendary",
  },
  {
    id: "leetmentor",
    title: "LeetMentor",
    description: "Built LeetMentor across Django, extension UI, Express, and AI response flow.",
    unlock: "Public repository",
    rarity: "legendary",
  },
  {
    id: "blindcoder",
    title: "BlindCoder Extension",
    description: "Improved a VS Code extension for audio-augmented Python editing.",
    unlock: "Public repository",
    rarity: "legendary",
  },
  {
    id: "ocr",
    title: "Prescription Scanner",
    description: "Trained a CNN prototype to classify handwritten medicine names.",
    unlock: "Experimental model",
    rarity: "epic",
  },
  {
    id: "textforge",
    title: "TextForge Engine",
    description: "Built a C++ editor engine with gap buffer storage and undo/redo command history.",
    unlock: "Public repository",
    rarity: "epic",
  },
  {
    id: "backend",
    title: "WriteYourOwn",
    description: "Shipped auth, ownership, search, metrics, and deployment-aware Django flows.",
    unlock: "Public repository",
    rarity: "rare",
  },
];
