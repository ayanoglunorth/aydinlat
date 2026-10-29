# Aydınlat

Aydınlat helps Codex choose the skills, plugins, apps, and tools a task needs.
It reads the capabilities available in the current session and uses only the
ones that add something to the work.

Aydınlat adapts to each installation instead of hard-coding one person's setup.
Newly installed capabilities can be considered without updating Aydınlat's own
catalog.

## Highlights

- Routes design, coding, presentation, document, spreadsheet, media, browser,
  and app tasks through the live capability catalog.
- Loads only the selected skills instead of filling context with every installed
  instruction file.
- Prefers exact, specialized matches over broad umbrella skills.
- Uses at most one visual direction and avoids incompatible style combinations.
- Preserves existing project conventions, brand rules, and authorization limits.
- Activates Caveman `full` mode for the rest of the chat when Caveman is
  installed. Caveman is optional and is not bundled.
- Applies Caveman to progress and tool-adjacent commentary, not only final
  answers, and suppresses routine plan narration between tool calls.
- Honors active modes, while selecting any matching installed mode or process
  skill when it adds a distinct responsibility.
- Supports explicit and implicit use.

## Installation

Start the interactive installer in a terminal (Node.js 22.20 or later):

```bash
npx -y github:ayanoglunorth/aydinlat
```

Choose one or more agents: Codex, Claude Code, Cursor, Gemini CLI, Antigravity
IDE, or Antigravity CLI (`agy`). Gemini CLI and Antigravity are separate
targets. Then choose any companions you want. None are selected by default.
The installer uses user scope, skips skill folders it finds, and reports the
result for each choice. Restart the agent or open a new chat afterward.
Use `--dry-run` to preview the commands and `--help` for usage.
On npm 12 or newer, add `--allow-git=root` after `npx` if npm blocks a GitHub
package with `EALLOWGIT`.

For a standard skill-only install without the companion selection screen:

```bash
npx skills@latest add ayanoglunorth/aydinlat --skill aydinlat -a codex -g
```

Change `codex` to another agent supported by the [Skills CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md).
The skill itself has no runtime dependencies. To update an existing skill, use
`npx skills@latest update aydinlat -g`; the interactive installer skips existing
copies rather than overwriting them.

## Optional companions

The terminal installer offers Ponytail, Superpowers, and Caveman. Select any
combination or skip them all. Where a companion has a verified terminal
installer for your agent, Aydınlat uses it. Other selections receive the
project's manual setup instructions. Plugins and hooks may still need review
inside the agent.

After installation, you can also start a new chat and write:

```text
$aydinlat setup
```

This chat command checks the host's skill or plugin manager. When it can verify
that a companion is missing, it explains the option and asks before installing.
When it cannot verify the installation state, it says so and links to the
official source.

| Companion | What it adds |
| --- | --- |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Keeps coding changes small and avoids unnecessary dependencies. |
| [Superpowers](https://github.com/obra/superpowers) | Adds a structured workflow for software changes. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Keeps chat output concise. |

Each is optional. Aydınlat does not depend on them. Chat-based setup asks
before installing. The terminal installer acts only on the boxes you select.

Ponytail, Superpowers, and Caveman are separate projects. Their names and links
identify compatible options only; Aydınlat does not include or redistribute
their code or documentation, and their own licenses apply when installed.

## Usage

Invoke Aydınlat explicitly:

```text
$aydinlat Create a polished PowerPoint for this quarterly review.
```

You can also select **Aydınlat** from the skill or slash menu. Implicit use is
enabled, so Codex may select it when a request spans several possible workflows.

Explicit activation keeps Aydınlat active for the rest of the chat. Implicit
activation applies Aydınlat routing to the current task. When Caveman is
installed, Aydınlat activates Caveman `full` mode for the rest of the chat in
either case.

Use `$aydinlat setup` when you want the optional companion check. Aydınlat
never installs, updates, or changes permissions without a clear confirmation.

To stop the persistent mode, say `stop aydinlat`, `Aydınlat'ı kapat`, or request
normal mode. Caveman can also be disabled through its own controls.

## How routing works

1. Aydınlat identifies the requested output, action, constraints, and project
   context.
2. It searches the live catalog by task verbs, constraints, symptoms, and named
   services.
3. It combines only direct matches with distinct roles: format owner, workflow,
   guard or mode, and live connector when needed.
4. It opens only the full instructions for that compatible combination and
   reports the selection in
   one short line.
5. It performs the task without granting itself extra permissions or installing
   missing capabilities. Routine plan and tool narration stay suppressed;
   progress appears only for a new blocker, risk, result, decision, or a
   host-required update during long work.

User choices take priority over Aydınlat's defaults. Existing repository and
brand rules take priority over speculative new styles.

## Limitations

- Aydınlat can route only capabilities exposed by the current host and session.
- Chat-based setup installs a companion only after inspection and confirmation.
- The terminal installer installs only companions explicitly selected there.
- It cannot override system policy, repository instructions, authorization
  requirements, or tool availability.

## Project structure

```text
aydinlat/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── install.mjs
├── install.test.mjs
├── package.json
├── LICENSE
└── README.md
```

`SKILL.md` contains the routing behavior. `agents/openai.yaml` provides the
display name, default prompt, and implicit invocation policy.

## Validation

The skill passes the validator bundled with Codex's Skill Creator. Changes
should preserve these invariants:

- no static routing inventory of machine-specific capabilities;
- no hard-coded user paths;
- no embedded copy of Caveman;
- no unrequested mode-state overrides; and
- minimum compatible skill selection; and
- no routine plan or tool narration after the one-line skill selection.

## Contributing

Issues and focused pull requests are welcome. Keep the router dynamic, and avoid
adding machine-specific skill catalogs or permissions that the user did not
grant.

## License

Released under the [MIT License](LICENSE).
