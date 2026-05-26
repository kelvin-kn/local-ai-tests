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

## Test machine specifications

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
│   │   ├── Quiz.jsx          ← 10-question trivia
│   │   ├── Snake.jsx         ← classic snake game
│   │   ├── Weather.jsx       ← live weather app
│   │   ├── ArtGallery.jsx    ← generative art gallery (model's choice)
│   │   └── Clock.jsx         ← analogue clock (bonus)
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
| `/art` | Art Gallery | ✅ |
| `/clock` | Clock | ✅ |

## How to Run

```bash
npm install
npm run dev      # Start dev server at localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
```

## Hosting

Deployed via Vercel. Connect the Vercel project to this GitHub repository for automatic deployments.

---

## Evaluation Report

### Technical Specifications

- **Model**: [qwen/qwen3.6-35b-a3b](https://lmstudio.ai/models/qwen/qwen3.6-35b-a3b)
- **Context Length**: 65,536 tokens
- **Temperature**: 0.6
- **Framework**: React + Vite + Tailwind CSS
- **Tool**: opencode (AI coding assistant)

### Hardware Constraints

The hardware used fell short of the recommended specifications.

Despite these limitations, the model was able to generate output, though at a slower pace:

- Each project took roughly **1 - 2 hours** to generate
- Bug fixes and adjustments took approximately **20-30 minutes** for each project.

Due to the heavy memory requirements and hardware limitations, all other programs had to be terminated. Only the following were running during the session:

- VSCode + opencode
- LM Studio server
- Browser with a few tabs (including the project tab)

The projects were mostly created in **one continuous session**.

### Misc

- [**qwen/qwen3.6-27b](https://lmstudio.ai/models/qwen/qwen3.6-27b) could not run on the test machine. 

### Errors Encountered

Only **2 notable errors** occurred during the session, both fixed with ease:

#### 1. SchemaError (Missing key at "content")

**Error message:**

```
The write tool was called with invalid arguments: SchemaError (Missing key at ["content"])
```

**Cause:** The model generates a write tool call missing the required `content` field. This happens when:

- Context window mismatch — opencode sends a prompt exceeding the model's actual context limit, truncating tool definitions from the system prompt
- Temperature too high — model gets creative and omits required parameters
- No thinking flag on Qwen3 models — they produce unreliable tool calls without it

**Fix:**

- Set `limit.context` and `limit.output` in `opencode.json` to match what LM Studio actually serves (prevents truncation)
- Lower temperature to `0.3` and `top_p` to `0.9` for deterministic tool calls
- Add `"thinking": true` for Qwen3 models
- In LM Studio, set repeat penalty to `1.0` (off) and flash attention on

#### 2. Jinja Template Error (No user query found in messages)

**Error message:**

```
Error rendering prompt with jinja template: "No user query found in messages."
```

**Cause:** The official Qwen 3.5/3.6 chat template has a flawed `multi_step_tool` loop that scans all user messages in reverse, skipping those wrapped in `<round>`/`<result>` tags. In long opencode sessions with many tool call/result rounds (especially after `/compact`), it finds no "real" user message and raises the error.

**Fix:**

- Replace the chat template in LM Studio (My Models → model → Prompt Template) with the fixed community template from [froggeric/Qwen-Fixed-Chat-Templates v19](https://huggingface.co/froggeric/Qwen-Fixed-Chat-Templates/tree/main), which removes the broken `multi_step_tool` check and handles tool-calling loops properly.

### Possible Issues When Using This Model

1. **Out of Memory** — The system does not have enough memory to handle the model's workload. **Fix**: Close other applications, change guardrail settings in LM Studio to either "off" or "relaxed", and upgrade to better hardware.

2. **SchemaError** — Model omits required tool call parameters (see fix above).

3. **Jinja Template Error** — Broken multi-step tool loop in long sessions (see fix above).



### Final Verdict and Conclusion
This model mosty passed the evaluation and is good for coding tasks, but still requires:

- Human in the loop / human guidance and references.

- Better hardware for maximum capacity and performance.