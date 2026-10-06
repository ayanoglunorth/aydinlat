# Aydınlat

Aydınlat is a dynamic skill router for Codex. It checks the skills, plugins,
apps, and tools available in the current session, then picks the smallest set
that fits the task.

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

For Codex, run one command:

```bash
npx skills add ayanoglunorth/aydinlat -a codex
```

Restart Codex, then open a new chat. For another supported agent, omit `-a
codex` and let the installer choose the target:

```bash
npx skills add ayanoglunorth/aydinlat
```

The installer runs through `npx`, so Node.js is the only prerequisite. If your
agent has a skill manager instead, add this repository there:
`https://github.com/ayanoglunorth/aydinlat`.

Run the same command again to refresh the installed skill.

## Optional companions

After installing Aydınlat, start a new chat and write:

```text
$aydinlat setup
```

It checks the setup only through the skill or plugin manager available on that
host. If it can verify that one of these optional companions is missing, it
explains the choice and asks before installing anything. If it cannot verify a
companion, it marks it as unknown and links to its official installer.

| Companion | What it adds |
| --- | --- |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Keeps coding changes small and avoids unnecessary dependencies. |
| [Superpowers](https://github.com/obra/superpowers) | Adds a structured workflow for software changes. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Keeps chat output concise. |

Each is optional. Aydınlat does not depend on them. On approval, it uses the
host's native marketplace or installer and reports a restart requirement when
the installer provides one. If the host cannot manage installations, it links
to the official source.

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
- It installs an optional companion only after it can inspect the setup and the
  user confirms that exact installation.
- It cannot override system policy, repository instructions, authorization
  requirements, or tool availability.

## Project structure

```text
aydinlat/
├── SKILL.md
├── agents/
│   └── openai.yaml
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
