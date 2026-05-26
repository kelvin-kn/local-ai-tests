# Local AI Tests

A collection of web projects built to evaluate the coding capabilities of a local AI model.

## Purpose

This project tests how well a local AI model can:

- Understand and implement detailed specifications
- Build functional, styled web applications
- Work with modern web tooling (Vite, React, Tailwind CSS)
- Structure code professionally with comments
- Adapt to feedback and iterate on designs
- Work within a monorepo and push to GitHub

## Model

**Qwen 3.6 35B A3B**

## Hardware

- GPU: Nvidia P3200 (6GB VRAM)
- RAM: 32GB
- OS: Linux

## Original Prompt

> We'll build 5 projects. The order is as follows. A professional personal portfolio landing page, then a quiz website. 10 random questions of your own choosing with 4 multiple choices. Only one choice will be correct. If a user is right, they get an appropriate message, if they are wrong, they equally get an appropriate message and also get told what the correct answer. Users cannot progress to the next question until they answer the current question. Then we'll do a simple snake game website, then a weather app, and finally, the last project will be for you to decide. I want to gauge how creative you are and see what you can come up with. We'll be using html, js, css, Next/React. I expect a minimum of mid level developer although, the benchmark is senior level developer. Comment your code so I can analyze it as well. I understand you might have issues building the whole project at once so its fine if you build in phases or stages, one at a time, or even one script at a time. Bonus project is a clock app. An analogue clock. The clock is round, with markings, and all three hands.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vite | Build tool & dev server |
| React 19 | UI framework |
| Tailwind CSS v3 | Utility-first styling |
| React Router DOM | Client-side routing |
| PostCSS | CSS processing |
| Autoprefixer | CSS vendor prefixing |

## Project Structure

```
local-ai-tests/
├── src/
│   ├── pages/
│   │   ├── Launcher.jsx      ← unified launcher (grid of project cards)
│   │   ├── Portfolio.jsx     ← professional landing page
│   │   ├── Quiz.jsx          ← 10-question trivia (TBD)
│   │   ├── Snake.jsx         ← classic snake game (TBD)
│   │   ├── Weather.jsx       ← live weather app (TBD)
│   │   ├── ArtGallery.jsx    ← generative art gallery (TBD)
│   │   └── Clock.jsx         ← analogue clock (TBD)
│   ├── components/
│   │   ├── Navbar.jsx        ← sticky navigation
│   │   ├── Hero.jsx          ← animated hero section
│   │   ├── About.jsx         ← bio section
│   │   ├── Skills.jsx        ← skill bars
│   │   ├── Projects.jsx      ← project cards grid
│   │   ├── Contact.jsx       ← contact form
│   │   └── Footer.jsx        ← social links
│   ├── data/                 ← static data (questions, config)
│   ├── utils/                ← helper functions
│   ├── App.jsx               ← route definitions
│   ├── main.jsx              ← entry point
│   └── index.css             ← global styles + Tailwind
├── public/                   ← static assets
├── tailwind.config.js        ← Tailwind configuration
├── postcss.config.cjs        ← PostCSS configuration
├── vite.config.js            ← Vite configuration
├── package.json              ← dependencies & scripts
├── plan.md                   ← project plan
└── README.md                 ← this file
```

## Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Launcher | ✅ |
| `/portfolio` | Portfolio | ✅ |
| `/quiz` | Quiz | ✅ |
| `/snake` | Snake | ✅ |
| `/weather` | Weather | ✅ |
| `/art` | Art Gallery | 🚧 |
| `/clock` | Clock | 🚧 |

## How to Run

```bash
npm install
npm run dev      # Start dev server at localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
```

## Hosting

Deployed via Vercel. Connect the Vercel project to this GitHub repository for automatic deployments.
