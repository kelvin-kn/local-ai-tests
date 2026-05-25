# AI Challenge — Project Plan

## Overview
6 projects + 1 bonus clock in a single Vite app with a launcher page.

---

## Project Structure
```
local-ai-tests/
├── src/
│   ├── pages/
│   │   ├── Launcher.jsx      ← unified launcher (grid of project cards)
│   │   ├── Portfolio.jsx     ← professional landing page
│   │   ├── Quiz.jsx          ← 10-question trivia
│   │   ├── Snake.jsx         ← classic snake game
│   │   ├── Weather.jsx       ← live weather app
│   │   ├── ArtGallery.jsx    ← generative art gallery (Project 5)
│   │   └── Clock.jsx         ← analogue clock (bonus)
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.jsx               ← routes
│   ├── main.jsx              ← entry point
│   └── index.css
├── tailwind.config.js
├── postcss.config.cjs
└── package.json
```

## Routes
| Route | Page |
|-------|------|
| `/` | Launcher |
| `/portfolio` | Portfolio |
| `/quiz` | Quiz |
| `/snake` | Snake |
| `/weather` | Weather |
| `/art` | Art Gallery |
| `/clock` | Clock |

---

## Build Order
1. Setup — Tailwind config, routing, shared components ✅
2. Project 1 — Portfolio ✅
3. Project 2 — Quiz ✅
4. Project 3 — Snake ✅
5. Project 4 — Weather ✅
6. Project 5 — Generative Art
7. Bonus — Analog Clock
8. Launcher page ✅

## Notes
- Each project gets its own unique style/aesthetic (modern, retro, minimal, etc.)
- No purple-to-blue gradients (AI cliché)
- Dark mode toggle on Portfolio
- Launcher loads each project as a separate route
