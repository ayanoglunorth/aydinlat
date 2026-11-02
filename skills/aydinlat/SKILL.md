---
name: aydinlat
description: Picks the smallest set of installed skills, plugins, apps and tools for a task, then keeps replies terse to save tokens. Use when the user types $aydinlat or /aydinlat, asks which skill or tool to use, or gives a multi-part task (build, design, document, deploy, debug) that several installed skills could cover. Also handles "aydinlat setup" for the optional companions. Skip trivial one-step requests.
---

# Aydınlat

Route from the live catalog of this session. Never keep a static list of skill
names, plugin names, paths or versions in this file.

## 1. Activation

- Explicit (skill menu, `$aydinlat`, `/aydinlat`, "use aydinlat"): stay active
  for the whole chat. Stop on `stop aydinlat`, `Aydınlat'ı kapat`, or "normal mode".
- Implicit (you chose it): apply to the current task only.
- Skip routing entirely for trivial work: a question, a one-line edit, a
  single command. Answer directly. Routing must cost less than it saves.

## 2. Output economy

1. If a `caveman` skill is available, read its full `SKILL.md` and activate
   `full` for explicit activation. On implicit activation use it for the
   current task only. The user can ask for `lite` or `ultra`; keep that level.
2. If a caveman mode is already active, keep it and its level. Never infer a
   mode change from a skill name.
3. Apply it to every user-visible message, including text around tool calls.
4. Write normally, not terse, for: security or data-loss warnings,
   confirmations of destructive or irreversible actions, error text quoted
   verbatim, code, commit messages and PR text, and any moment the user seems
   confused. Resume terse style afterwards.
5. If caveman is unavailable, do not imitate or embed it. Just skip preamble,
   recaps and filler.
6. Before the first tool call, send one line naming the selection, max 12
   words, in the user's language, names only (example: `Aydınlat: ponytail,
   verification-before-completion`). If no extra skill is needed, name Aydınlat
   and the native tool. Send it once per task, not once per turn.
7. No other routine narration: no plans, searches, file reads or tool-choice
   talk. After a tool result, call the next tool or answer. Speak mid-task
   only for a new blocker, risk, decision, or a host-required update: one
   sentence, max 20 words, new information only.

## 3. Routing procedure

1. Extract the deliverable, the action, constraints, existing project or brand
   context, and whether live data or UI control is needed.
2. Read only the name and description of each catalog entry. Do not open a
   `SKILL.md` until it is shortlisted. Use the tool or skill list already in
   context. If none is exposed, list the standard skill folders of the current
   host (project `.agents/skills`, `.claude/skills`, then the user-level
   equivalents), never a guessed machine-specific path.
3. A skill the user names and that is available wins. Use it as asked.
4. Fill these slots from direct matches only, leaving a slot empty when
   nothing fits:

   | Slot | Picks | Example trigger |
   | --- | --- | --- |
   | Mode | persona, cost or communication mode already relevant | active caveman |
   | Process | method that guards correctness | unknown bug, refactor, migration, "done" check |
   | Owner | skill that owns the output format or domain | pptx, docx, xlsx, pdf, UI, video, API |
   | Direction | exactly one visual or style direction | blank-slate design |
   | Connector | app, plugin tool, browser, computer control | live data, named service, native app |

5. Open the full `SKILL.md` of each pick, in this order: Mode, Process, Owner,
   Direction. Keep the set at 4 or fewer; if more qualify, drop the one whose
   responsibility is already covered.
6. Follow the opened instructions. If one requires another available skill,
   load it in the stated order.
7. If a pick is missing or blocked, say the decisive limitation in one line and
   use the closest visible capability only when it needs no invented data and
   no bypassed authorization.

## 4. Tie-breakers

- Same responsibility: the narrower, exact match beats an umbrella skill. A
  different responsibility: keep both. Narrow never cancels a process or mode.
- A named skill owns its method; do not substitute a general summary of it.
- Existing repository rules, brand and design system beat any new style.
  Never mix conflicting aesthetics; choose one.
- Files: pick the skill whose description names that exact format. Do not
  substitute a similar format.
- Code: unknown failure goes to diagnosis; small fix to a focused patch;
  structural change to refactor; compatibility change to migration; finish with
  verification. Keep any coding-constraint skill (for example minimal-change)
  alongside the workflow.
- Web: use direct APIs, connectors and local tools first. Browser automation
  only for real page interaction; computer control only for native apps.
- Media: use the matching generate or edit capability; inspect supplied media
  first when that skill says so. Add motion, accessibility or performance
  guidance only when the request needs it.
- Spawn agents only when the user or a higher-priority instruction allows it.

## 5. Setup and companions

Run only when the user asks to install, set up or check Aydınlat or its
companions. Never suggest installs during ordinary routing.

- Companions are optional: Ponytail (minimal code changes), Superpowers
  (software workflow), Caveman (terse replies). Aydınlat works without them.
- Check with the host's skill or plugin manager. Missing from the task catalog
  is not proof of absence: report `unknown`, give the official link, and stop.
- Official sources: github.com/DietrichGebert/ponytail,
  github.com/obra/superpowers, github.com/JuliusBrussee/caveman.
- Preferred path is the terminal installer, which verifies results:
  `npx -y github:ayanoglunorth/aydinlat --doctor` to check,
  `npx -y github:ayanoglunorth/aydinlat` to install. Offer it before anything else.
- Install only after explicit consent that names each companion and its source.
  One consent does not cover another companion, an update, a permission change
  or a marketplace connection. Prefer the maintainer's documented install path;
  never pipe a remote script into a shell. Report each result, permission
  review and restart or new-chat requirement.

## 6. Guardrails

- Explicit user instructions override these defaults where permitted.
- Selecting a capability grants no permission: no external writes, publishing,
  messages, purchases or installs unless the user asked.
