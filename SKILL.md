---
name: aydinlat
description: Dynamically route complex tasks to the smallest compatible set of skills, plugins, apps, and tools currently available in the session. When Caveman is installed, activate its full mode for concise chat. Use when explicitly invoked as $aydinlat or when a request spans multiple possible workflows such as design, coding, presentations, documents, spreadsheets, media, browser, or app work. Do not use for simple tasks with one obvious capability.
---

# Aydinlat

Route work from the live capability catalog. Do not keep a static inventory of
skill names, plugin names, paths, or versions in this file.

## Activation and communication

- Treat selection through the skill UI, `$aydinlat`, or a direct request to use
  Aydinlat as explicit activation. Keep Aydinlat active for the rest of that
  chat until the user says `stop aydinlat`, `Aydinlat'i kapat`, or asks for
  normal mode.
- Treat model-selected invocation as implicit activation. Apply Aydinlat only
  to the current task; do not change later turns unless it is selected again.
- If a `caveman` skill is available, read its complete `SKILL.md` and activate
  `full` mode for the rest of the chat, whether Aydinlat activation was explicit
  or implicit. Keep Caveman active until the user disables Caveman or requests
  normal mode. Apply Caveman to every user-visible assistant message, including
  commentary, progress updates, status notes, and text around tool calls; do not
  limit it to the final answer.
- If `caveman` is unavailable, do not imitate, embed, or reconstruct it. Continue
  with Aydinlat's routing behavior and the host's normal communication style.
- Do not override a mode that is already active or infer a state change from its
  name. A mode, persona, cost, or process skill is otherwise eligible whenever
  its live description directly matches the task; follow its own persistence
  rules after selecting it.
- Before work, report the selected skills in exactly one short line, localized
  to the user's language. Keep it to names plus mode, at most 12 words. Omit
  unavailable candidates. If no extra skill is needed, name Aydinlat and the
  native tool or capability instead.
- That selection line is the only routine pre-tool commentary. Do not narrate
  plans, searches, file reads, tool choice, constraints, or the next action.
  After each tool result, call the next tool directly or give the final answer.
- Emit another progress line only when the host requires an update during long
  work or when the user needs a new blocker, risk, result, or decision. Use one
  sentence of at most 20 words. State only new information; never restate the
  plan, selected skills, known constraints, or completed tool calls.

## Setup and companion installation

Run this flow only when the user explicitly asks to install, set up, or check
Aydinlat or its companions. Do not recommend installations during ordinary
task routing.

1. Use an exposed skill or plugin manager to inspect what it can verify about
   the local setup. A task catalog alone is not proof that an unlisted skill is
   absent.
2. When the manager can verify a companion is missing, offer only the relevant
   optional foundations: Ponytail for minimal coding, Superpowers for software
   workflow, and Caveman for concise communication. Say what each changes and
   that none is required for Aydinlat itself. Mark an unverifiable companion as
   unknown, not missing; provide its official link and wait for a separate,
   named installation request.
3. Ask for explicit consent before any installation. List the exact companions
   to be installed and their official source. Consent to one companion does not
   authorize the others, an update, a permission change, or a marketplace
   connection.
4. After consent, use the host's native plugin marketplace or skill installer.
   Prefer the maintainer's documented install path over copying files or piping
   a remote script into a shell. Report each result, any permission review, and
   any restart or new-chat requirement reported by the installer.
5. If no manager can inspect or install, do not claim a companion is missing or
   installed. Offer its official installation link instead.

## Dynamic routing

1. Identify the requested deliverable, action, constraints, existing project or
   brand context, and whether live external data or UI control is required.
2. Use the current session's available skill names, descriptions, paths, enabled
   plugin capabilities, apps, and tools as the source of truth. Search that live
   catalog by the task's verbs, deliverable, constraints, named services, and
   failure symptoms. When the catalog is present, do not scan plugin caches or
   assume machine-specific paths.
3. Shortlist direct matches by responsibility, not by a fixed list of names:
   specialized deliverable owner, task workflow, process or safety guard,
   constraint or mode, and live-service connector. Read the complete `SKILL.md`
   for each selected skill before acting; do not load a candidate that adds no
   distinct responsibility.
4. Select the smallest compatible set that covers those responsibilities:
   - Use the skill that owns a specialized output format when one exists.
   - Keep a directly relevant process, constraint, or active-mode skill when it
     changes the work; a narrower task owner does not replace it merely by being
     narrower.
   - If a selected skill requires another available skill or workflow, include
     that requirement in its stated order.
   - Add at most one visual direction. Add motion, accessibility, or performance
     guidance only when the request needs it.
   - Use a connected app, plugin tool, browser, or computer-control capability
     only when the request needs its live data, named service, or interface. If
     a plugin supplies both guidance and a tool, use each only for the role it
     adds.
   - Prefer a narrow exact match over a general umbrella skill only when both
     cover the same responsibility.
5. Follow the selected instructions without expanding the user's authorization.
   Never install a skill or plugin unless the user asks for installation.
6. If a selected capability is missing or inaccessible, state the decisive
   limitation briefly. Use the closest visible capability only when it can
   satisfy the request without inventing data or bypassing authorization.

## Selection cues

- For presentations, documents, PDFs, spreadsheets, and other files, choose the
  capability whose description explicitly owns that format. Do not substitute
  a visually similar format.
- For design work, preserve an existing brand and design system first. For a
  blank-slate request, choose one direction that fits audience, content, and
  platform. Do not blend conflicting aesthetic styles.
- For web or mobile work, separate the production workflow from the visual
  direction. Add image generation or motion guidance only when the requested
  result materially needs it.
- For code work, route unknown failures to diagnosis, small fixes to a focused
  patch workflow, structural changes to refactoring, compatibility transitions
  to migration, and completion checks to verification. Also retain any direct
  coding constraint, process, or active mode from the live catalog; do not let
  the focused patch workflow suppress it.
- For websites, use browser automation only when a real browser interaction is
  required. Use computer control only for a native application. Prefer direct
  APIs, connectors, or local tools when they already cover the task.
- For images or other media, use the matching generation or editing capability.
  Inspect supplied media before editing when the selected skill requires it.
- Use discovery or installation capabilities only when the user asks to find,
  add, connect, remove, or manage capabilities.
- Delegate or spawn agents only when the user or higher-priority instructions
  authorize delegation.

## Conflict rules

- Current explicit user instructions override Aydinlat defaults where permitted.
- Existing repository instructions, brand rules, and established patterns beat
  a speculative new style.
- When selected skills overlap, keep the narrower owner only for their shared
  responsibility. Preserve complementary guidance; drop a capability only when
  it is redundant or conflicts. Ask only when the remaining choice changes
  product intent.
- Capability selection never grants new permissions or authorizes external
  writes, publication, messages, purchases, or installation.
