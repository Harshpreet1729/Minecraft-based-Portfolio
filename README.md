# Harshpreet — Minecraft World Archive

A Minecraft-inspired developer portfolio for Harshpreet, a student at Thapar Institute of Engineering & Technology, Patiala. Projects, skills, milestones, and contact links are presented as explorable sections of a single-player world archive.

**Live site:** [harshpreet-minecraft-portfolio.netlify.app](https://harshpreet-minecraft-portfolio.netlify.app/)

## Pages

- `/` — Home / spawn point
- `/archive` — Project archive
- `/craft` — Skills and crafting recipes
- `/journey` — Education and milestones
- `/portal` — Contact links

## Stack

React 18, TypeScript, Vite, React Router, Framer Motion, and Lucide React. The interface uses a small, curated set of local Minecraft-style textures and compressed environment artwork.

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Production build

```bash
npm run build
npm run preview
```

The production bundle is written to `dist/`.

## Deployment

The repository is configured for Netlify in `netlify.toml`: Node.js 20, `npm run build`, the `dist` publish directory, and an SPA fallback for direct page visits.
