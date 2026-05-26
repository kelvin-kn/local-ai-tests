# AI Challenge — Local AI Coding Test

## Overview
This project tests the capabilities of a local LLM (Qwen 3.6-35b-a3b) in generating full React/Vite applications with minimal human guidance. The challenge was to build 6 projects plus a bonus clock component entirely through natural language prompts.

## Projects
| # | Project | Description |
|---|---------|-------------|
| 1 | Portfolio | Professional landing page with dark mode toggle |
| 2 | Quiz | 10-question trivia game |
| 3 | Snake | Classic snake game |
| 4 | Weather | Live weather app |
| 5 | Art Gallery | Generative art gallery |
| 6 | Clock | Analog/digital clock with world time support |
| + | Launcher | Unified launcher page for all projects |

## Technical Specifications
- **Model**: qwen/qwen3.6-35b-a3b (via LM Studio)
- **Context Length**: 65,536 tokens
- **Temperature**: 0.6
- **Framework**: React + Vite + Tailwind CSS
- **Tool**: opencode (AI coding assistant)

## Hardware Constraints
The hardware used fell short of the recommended specifications:
- **Graphics Card**: Below recommended VRAM specs
- **Memory**: Insufficient for heavy workloads

Despite these limitations, the model was able to generate output, though at a slower pace:
- Each project took roughly **1 hour** to generate
- Bug fixes and adjustments took approximately **20-30 minutes** per session

Due to the heavy memory requirements and hardware limitations, all other programs had to be terminated. Only the following were running during the session:
- VSCode + opencode
- LM Studio server
- Browser with a few tabs (including the project tab)

The projects were mostly created in **one continuous session**.

## Conclusion
This model is good for coding tasks, but still requires:
- Human in the loop / human guidance
- Better hardware for maximum capacity and performance

Still, it is a great tool for developers. The model mostly passed its evaluation, but would perform better with human guidance and references.

## Errors Encountered
Only **2 notable errors** occurred during the session, both fixed with ease:

### 1. SchemaError (Missing key at "content")
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

### 2. Jinja Template Error (No user query found in messages)
**Error message:**
```
Error rendering prompt with jinja template: "No user query found in messages."
```

**Cause:** The official Qwen 3.5/3.6 chat template has a flawed `multi_step_tool` loop that scans all user messages in reverse, skipping those wrapped in `<round>``<result>` tags. In long opencode sessions with many tool call/result rounds (especially after `/compact`), it finds no "real" user message and raises the error.

**Fix:**
- Replace the chat template in LM Studio (My Models → model → Prompt Template) with the fixed community template from [froggeric/Qwen-Fixed-Chat-Templates v19](https://github.com/froggeric/Qwen-Fixed-Chat-Templates), which removes the broken `multi_step_tool` check and handles tool-calling loops properly.

## Possible Issues When Using This Model
1. **Out of Memory** — Causes the model to stop. Clear cause and fix: increase available memory or reduce context length.
2. **SchemaError** — Model omits required tool call parameters (see fix above).
3. **Jinja Template Error** — Broken multi-step tool loop in long sessions (see fix above).

## Final Verdict
The model mostly passed its evaluation, but would perform better with human guidance and references. With proper configuration and adequate hardware, it is a powerful tool for developers.
