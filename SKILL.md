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
  normal mode.
- If `caveman` is unavailable, do not imitate, embed, or reconstruct it. Continue
  with Aydinlat's routing behavior and the host's normal communication style.
- Do not enable, disable, or change Ponytail. Respect its existing state and any
  separate user instruction about it.
- Before work, report the selected skills in exactly one short line, localized
  to the user's language. Omit unavailable candidates. If no extra skill is
  needed, name Aydinlat and the native tool or capability instead.

## Dynamic routing

1. Identify the requested deliverable, action, constraints, existing project or
   brand context, and whether live external data or UI control is required.
2. Use the current session's available skill names, descriptions, paths, plugin
   capabilities, apps, and tools as the source of truth. When that catalog is
   present, do not scan plugin caches or assume machine-specific paths.
3. Shortlist only direct matches. Read the complete `SKILL.md` for every selected
   skill before acting. Do not load all available skills.
4. Select the smallest compatible set:
   - Use the skill that owns a specialized output format when one exists.
   - Add one task or domain workflow only when it changes how the work should be
     performed.
   - Add at most one visual direction. Add motion, accessibility, or performance
     guidance only when the request needs it.
   - Use an app, plugin tool, browser, or computer-control capability only when
     the task needs its live data or interface.
   - Prefer a narrow exact match over a general umbrella skill.
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
  to migration, and completion checks to verification.
- For websites, use browser automation only when a real browser interaction is
  required. Use computer control only for a native application. Prefer direct
  APIs, connectors, or local tools when they already cover the task.
- For images or other media, use the matching generation or editing capability.
  Inspect supplied media before editing when the selected skill requires it.
- Use discovery or installation capabilities only when the user asks to find,
  add, connect, remove, or manage capabilities.
- Do not auto-select persistent persona, cost, or communication modes other than
  activating an installed Caveman skill as instructed above.
- Delegate or spawn agents only when the user or higher-priority instructions
  authorize delegation.

## Conflict rules

- Current explicit user instructions override Aydinlat defaults where permitted.
- Existing repository instructions, brand rules, and established patterns beat
  a speculative new style.
- When selected skills conflict, keep the narrower task owner and drop the
  broader skill. Ask only when the remaining choice changes product intent.
- Capability selection never grants new permissions or authorizes external
  writes, publication, messages, purchases, or installation.
