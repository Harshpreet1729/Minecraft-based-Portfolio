export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type Project = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  rarity: Rarity;
  techStack: string[];
  features: string[];
  githubUrl: string;
  liveDemoUrl: string;
  artifactIcon: keyof typeof import("./assets/minecraft").items;
  minecraftAnalogy: string;
  featured: boolean;
  order: number;
  complexity: number;
  role: string;
  problemSolved: string;
};

export type Skill = {
  name: string;
  category: string;
  description: string;
  usedIn: string[];
  projectIds: string[];
  icon: keyof typeof import("./assets/minecraft").items;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlock: string;
  rarity: Rarity;
};

export type JourneyStation = {
  id: string;
  title: string;
  detail: string;
  biome: string;
  year: string;
};
