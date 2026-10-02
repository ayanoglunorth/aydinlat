# Aydınlat

Aydınlat is a dynamic skill router for Codex. It inspects the skills, plugins,
apps, and tools available in the current session, then selects the smallest
compatible set for the task.

Instead of hard-coding one person's setup, Aydınlat adapts to each installation.
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
- Leaves Ponytail's current state unchanged.
- Supports explicit and implicit invocation.

## Requirements

- A Codex surface with local skill support, such as the ChatGPT desktop app,
  Codex CLI, or Codex IDE extension.
- Git only if you choose the clone-based installation.
- No runtime dependencies.

## Installation

### Clone with Git

This is the recommended method because updates only require `git pull`.

#### Windows PowerShell (install or update)

```powershell
$skillPath = Join-Path $HOME ".agents\skills\aydinlat"

if (Test-Path (Join-Path $skillPath ".git")) {
    git -C $skillPath pull --ff-only
} elseif (Test-Path $skillPath) {
    throw "The target exists but is not a Git clone: $skillPath"
} else {
    New-Item -ItemType Directory -Force (Split-Path $skillPath) | Out-Null
    git clone https://github.com/ayanoglunorth/aydinlat.git $skillPath
}
```

Run the same block again whenever you want to update Aydınlat.

#### macOS or Linux

```bash
mkdir -p ~/.agents/skills
git clone https://github.com/ayanoglunorth/aydinlat.git ~/.agents/skills/aydinlat
```

### Download as ZIP

1. Open the repository on GitHub.
2. Select **Code**, then **Download ZIP**.
3. Extract the archive.
4. Rename the extracted folder to `aydinlat` if necessary.
5. Move the folder into your user skill directory:

   - Windows: `%USERPROFILE%\.agents\skills\aydinlat`
   - macOS/Linux: `~/.agents/skills/aydinlat`

The installed folder must contain `SKILL.md` directly at its root.

Restart Codex if Aydınlat does not appear immediately.

## Updating

For an existing Git installation on macOS or Linux:

```bash
git -C ~/.agents/skills/aydinlat pull --ff-only
```

On Windows, rerun the PowerShell block under **Installation**. It installs the
skill when the folder is missing and updates it when the Git clone already
exists.

ZIP installations can be updated by replacing the existing folder with the
contents of a newer archive.

## Usage

Invoke Aydınlat explicitly:

```text
$aydinlat Create a polished PowerPoint for this quarterly review.
```

You can also select **Aydınlat** from the skill or slash menu. Implicit
invocation is enabled, so Codex may select it when a request spans several
possible workflows.

Explicit activation keeps Aydınlat active for the rest of the chat. Implicit
activation applies Aydınlat routing to the current task. When Caveman is
installed, Aydınlat activates Caveman `full` mode for the rest of the chat in
either case.

To stop the persistent mode, say `stop aydinlat`, `Aydınlat'ı kapat`, or request
normal mode. Caveman can also be disabled through its own controls.

## How routing works

1. Aydınlat identifies the requested output, action, constraints, and project
   context.
2. It reads the live names and descriptions of available capabilities.
3. It opens only the full instructions for direct matches.
4. It selects the minimum compatible combination and reports that selection in
   one short line.
5. It performs the task without granting itself extra permissions or installing
   missing capabilities.

User choices always take priority over Aydınlat's defaults. Existing repository
and brand rules take priority over speculative new styles.

## Limitations

- Aydınlat can route only capabilities exposed by the current host and session.
- It does not install missing skills or plugins unless the user requests that
  separate action.
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

- no static inventory of machine-specific capabilities;
- no hard-coded user paths;
- no embedded copy of Caveman;
- no automatic Ponytail state changes; and
- minimum compatible skill selection.

## Contributing

Issues and focused pull requests are welcome. Keep the router dynamic and avoid
adding machine-specific skill catalogs or permissions that the user did not
grant.

## License

Released under the [MIT License](LICENSE).
