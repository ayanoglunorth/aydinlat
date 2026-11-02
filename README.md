<div align="center">
  <img src="assets/logo.svg" alt="Aydınlat logo" width="96" height="96">

  # Aydınlat

  **Let your agent pick the right tools for the job, and only those.**

  [![License: MIT](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)
  [![Node.js](https://img.shields.io/badge/node-%3E%3D22.20-339933.svg)](package.json)
  [![Agent skill](https://img.shields.io/badge/agent-skill-FB5607.svg)](SKILL.md)

  [Install](#installation) · [Usage](#usage) · [How routing works](#how-routing-works) · [Companions](#optional-companions) · [Troubleshooting](#troubleshooting) · [Türkçe](README.tr.md)
</div>

Aydınlat helps your coding agent (Codex, Claude Code, Cursor, Gemini CLI, Antigravity) pick the few installed skills, plugins, apps, and tools a task needs, and keeps replies short to save output tokens. It reads the live catalog of the current session, so new capabilities are considered without editing Aydınlat.

## Highlights

- 🧭 **Live routing.** Reads names and descriptions only, opens the full instructions of the 4 best matches at most.
- 🧩 **Slot-based selection.** One pick per responsibility: mode, process, format owner, visual direction, connector.
- ⚡ **Skips trivial work.** A one-line question never pays the routing cost.
- 🪶 **Token savings.** With [Caveman](https://github.com/JuliusBrussee/caveman) installed, replies stay terse; safety warnings, code, commits, and destructive confirmations stay in full sentences.
- 🛡️ **Respects your rules.** Repository and brand rules win; selecting a skill never grants new permissions or installs anything.
- 🔀 **Explicit or implicit.** `$aydinlat` stays on for the chat. When the agent picks it, it applies to that task only.

## Installation

Requires Node.js 18 or later. Interactive installer (detected agents are pre-checked):

```bash
npx -y github:ayanoglunorth/aydinlat
```

Non-interactive, for scripts and CI:

```bash
npx -y github:ayanoglunorth/aydinlat --agent claude-code,codex --with ponytail --yes
```

| Option | Meaning |
| --- | --- |
| `--agent a,b` | `codex`, `claude-code`, `cursor`, `gemini-cli`, `antigravity`, `antigravity-cli` |
| `--with x,y` | optional companions: `ponytail`, `superpowers`, `caveman` |
| `--yes` | no prompts (needs `--agent`) |
| `--update` | reinstall Aydınlat even if present |
| `--doctor` | show what is installed, change nothing |
| `--dry-run` | print the commands only |

The installer works at user scope, copies files instead of symlinking (symlinks fail on Windows without admin rights), checks that each agent CLI exists, adds `--allow-git=root` on npm 12+, and confirms every install afterwards. Only the `skills/aydinlat` folder is copied into your agent, not the installer or tests.

Skill only, without the installer:

```bash
npx skills@latest add ayanoglunorth/aydinlat --skill aydinlat -a claude-code -g --copy
```

Update with `npx -y github:ayanoglunorth/aydinlat --agent <id> --update --yes`. Check state with `--doctor`.

## Usage

```text
$aydinlat Create a polished PowerPoint for this quarterly review.
```

Select **Aydınlat** from the skill menu or type `/aydinlat` where the host supports it. Stop with `stop aydinlat` or `Aydınlat'ı kapat`. Ask for `lite` or `ultra` to change the Caveman level.

## Optional companions

| Companion | What it adds |
| --- | --- |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Keeps coding changes small and avoids unnecessary dependencies. |
| [Superpowers](https://github.com/obra/superpowers) | Adds a structured workflow for software changes. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Keeps chat output concise. |

Each runs the maintainer's own install path (plugin manager or their installer). Where no verified terminal path exists for your agent, you get the manual instructions. Codex asks you to trust plugin hooks via `/hooks`. In a chat, `$aydinlat setup` checks what the host can verify and asks before installing anything.

> [!NOTE]
> These are separate projects with their own licenses. Aydınlat does not include or redistribute their code.

## How routing works

1. Extract deliverable, action, constraints, and project context.
2. Honor a skill the user names; otherwise scan live names and descriptions.
3. Fill the slots (mode, process, owner, direction, connector) from direct matches only.
4. Open the full instructions of the picks in that order, state them in one line, and work.
5. Never expand permissions or install anything unasked.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `EALLOWGIT` from npx | npm 12 blocks git packages: `npx --allow-git=root -y github:ayanoglunorth/aydinlat` |
| `cli not found` | the agent's command is not on PATH; open a new terminal or install that CLI |
| `unverified` | command succeeded but state could not be detected; restart the agent, run `--doctor` |
| Skill not visible | restart the agent or start a new chat |
| Codex hooks silent | run `codex`, open `/hooks`, trust them |

## Limitations

- Routes only capabilities the current host and session expose.
- Cannot override system policy, repository instructions, or tool availability.
- Without Caveman it only trims preamble and recaps; it does not imitate Caveman.

## Project structure

```text
aydinlat/
├── skills/aydinlat/        # what gets installed into agents
│   ├── SKILL.md
│   └── agents/openai.yaml
├── evals/routing.md        # manual routing scenarios
├── install.mjs             # installer / doctor
├── install.test.mjs
├── skill.test.mjs          # lints the skill
├── assets/logo.svg
└── package.json
```

## Development

`npm test` checks the installer and lints the skill (valid frontmatter, size cap, no machine paths, no static skill inventory, no embedded Caveman). Keep the router dynamic; do not add machine-specific catalogs.

## License

Released under the [MIT License](LICENSE).
