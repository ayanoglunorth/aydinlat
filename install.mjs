#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join } from 'node:path';
import { spawnSync, execSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';

const project = 'aydinlat';
const repo = `ayanoglunorth/${project}`;
// [id, label, cli binaries, home folder that proves the agent is used]
export const agents = [
  ['codex', 'Codex', ['codex'], ['.codex']],
  ['claude-code', 'Claude Code', ['claude'], ['.claude']],
  ['cursor', 'Cursor', ['cursor', 'cursor-agent'], ['.cursor']],
  ['gemini-cli', 'Gemini CLI', ['gemini'], ['.gemini', 'settings.json']],
  ['antigravity', 'Antigravity (IDE)', [], ['.gemini', 'antigravity']],
  ['antigravity-cli', 'Antigravity CLI (agy)', ['agy'], ['.gemini', 'antigravity-cli']],
];
export const companions = [
  ['ponytail', 'Ponytail', 'Small, focused coding changes', 'https://github.com/DietrichGebert/ponytail'],
  ['superpowers', 'Superpowers', 'Structured software workflows', 'https://github.com/obra/superpowers'],
  ['caveman', 'Caveman', 'Concise communication', 'https://github.com/JuliusBrussee/caveman'],
];
const safeArg = /^[\w@.\/:=#,*-]+$/;

export function parseSelection(value, length) {
  if (!value.trim()) return [];
  const parts = value.trim().split(/[ ,]+/);
  if (parts.some(part => !/^[1-9]\d*$/.test(part) || Number(part) > length)) {
    throw new Error(`Enter numbers from 1 to ${length}, separated by commas.`);
  }
  return [...new Set(parts.map(part => Number(part) - 1))];
}

export function parseArgs(argv) {
  const options = {};
  const flags = new Set(['help', 'dry-run', 'yes', 'update', 'doctor']);
  const lists = { agent: agents.map(a => a[0]), with: companions.map(c => c[0]) };
  for (let i = 0; i < argv.length; i++) {
    const [, key, inline] = /^--([\w-]+)(?:=(.*))?$/.exec(argv[i]) ?? [];
    if (!key) throw new Error(`Unknown argument ${argv[i]}. Use --help.`);
    if (flags.has(key)) { options[key] = true; continue; }
    if (!lists[key]) throw new Error(`Unknown option --${key}. Use --help.`);
    const raw = inline ?? argv[++i];
    if (!raw) throw new Error(`--${key} needs a value.`);
    const values = raw.split(',').map(v => v.trim()).filter(Boolean);
    const bad = values.find(v => !lists[key].includes(v));
    if (bad) throw new Error(`Unknown ${key} "${bad}". Choose from: ${lists[key].join(', ')}.`);
    options[key] = [...new Set(values)];
  }
  return options;
}

export function onPath(command, env = process.env, pathExists = existsSync, windows = process.platform === 'win32') {
  const extensions = windows ? ['', ...(env.PATHEXT ?? '.EXE;.CMD;.BAT').toLowerCase().split(';')] : [''];
  return (env.PATH ?? env.Path ?? '').split(delimiter).filter(Boolean)
    .some(dir => extensions.some(ext => pathExists(join(dir, command + ext))));
}

export function detected(agent, has = onPath, pathExists = existsSync, home = homedir()) {
  const [, , binaries, folder] = agents.find(item => item[0] === agent);
  return binaries.some(has) || pathExists(join(home, ...folder));
}

// Native steps use the agent's own plugin manager; the rest go through each project's documented npx installer.
function steps(name, agent) {
  const npx = (pkg, ...args) => ['npx', ['-y', pkg, ...args]];
  const caveman = id => npx('github:JuliusBrussee/caveman', '--', '--only', id);
  const native = {
    ponytail: {
      codex: [['codex', ['plugin', 'marketplace', 'add', 'DietrichGebert/ponytail'], 'soft'], ['codex', ['plugin', 'add', 'ponytail@ponytail']]],
      'claude-code': [['claude', ['plugin', 'marketplace', 'add', 'DietrichGebert/ponytail'], 'soft'], ['claude', ['plugin', 'install', 'ponytail@ponytail', '--scope', 'user']]],
      'gemini-cli': [['gemini', ['extensions', 'install', 'https://github.com/DietrichGebert/ponytail']]],
      'antigravity-cli': [['agy', ['plugin', 'install', 'https://github.com/DietrichGebert/ponytail']]],
    },
    superpowers: {
      codex: [['codex', ['plugin', 'marketplace', 'add', 'obra/superpowers'], 'soft'], ['codex', ['plugin', 'add', 'superpowers@superpowers-dev']]],
      'claude-code': [['claude', ['plugin', 'install', 'superpowers@claude-plugins-official', '--scope', 'user']]],
      'gemini-cli': [['gemini', ['extensions', 'install', 'https://github.com/obra/superpowers']]],
      'antigravity-cli': [['agy', ['plugin', 'install', 'https://github.com/obra/superpowers']]],
    },
    caveman: {
      codex: [caveman('codex')],
      'claude-code': [caveman('claude')],
      cursor: [caveman('cursor')],
      'gemini-cli': [['gemini', ['extensions', 'install', 'https://github.com/JuliusBrussee/caveman']]],
      antigravity: [caveman('antigravity')],
      'antigravity-cli': [caveman('antigravity-cli')],
    },
  };
  return native[name]?.[agent] ?? null;
}

// --copy: the Skills CLI symlinks by default, which needs elevated rights on Windows and breaks when the cache is cleaned.
const projectSteps = agent => [['npx', ['-y', 'skills@latest', 'add', repo, '--skill', project, '-a', agent, '-g', '-y', '--copy']]];

export function installed(name, agent, pathExists = existsSync, home = homedir(), read = file => readFileSync(file, 'utf8'), codexPlugins = defaultCodexPlugins) {
  const folders = {
    codex: [['.agents', 'skills'], ['.codex', 'skills']],
    'claude-code': [['.claude', 'skills']],
    cursor: [['.cursor', 'skills']],
    'gemini-cli': [['.gemini', 'skills'], ['.gemini', 'extensions']],
    antigravity: [['.gemini', 'antigravity', 'skills']],
    'antigravity-cli': [['.gemini', 'antigravity-cli', 'skills']],
  }[agent] ?? [];
  if (folders.some(folder => pathExists(join(home, ...folder, name)))) return true;
  if (agent === 'claude-code') {
    try { return Object.keys(JSON.parse(read(join(home, '.claude', 'plugins', 'installed_plugins.json'))).plugins ?? {}).some(key => key.split('@')[0] === name); }
    catch { return false; }
  }
  if (agent === 'codex' && name !== project) return codexPlugins().includes(name);
  return false;
}

// execSync takes one fixed string, so Windows .cmd shims resolve without the shell-with-args deprecation.
const capture = command => execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 });

function defaultCodexPlugins() {
  try {
    const list = JSON.parse(capture('codex plugin list --json'));
    return (list.installed ?? []).filter(plugin => plugin.installed).map(plugin => plugin.name);
  } catch { return []; }
}

const manualNotes = {
  'antigravity/ponytail': 'The IDE has no terminal installer. Install it through the Antigravity CLI target (agy), or copy AGENTS.md from the repo into your project.',
  'antigravity/superpowers': 'The IDE has no terminal installer. Select the Antigravity CLI target (agy) to install the plugin.',
  'cursor/superpowers': 'In Cursor Agent chat, run /add-plugin superpowers.',
  'cursor/ponytail': 'Follow the Cursor hooks instructions at https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md#cursor',
};
const afterNotes = {
  'codex/ponytail': 'Run codex, open /hooks and trust the plugin hooks, then start a new thread.',
  'codex/caveman': 'Run codex, open /hooks and trust the caveman hook, then start a new thread.',
};

export function manualStep(name, agent) {
  const source = companions.find(item => item[0] === name)?.[3];
  return manualNotes[`${agent}/${name}`] ?? `No verified native terminal install for ${agent}; see ${source}.`;
}

let npmMajorCache;
function npmMajor() {
  npmMajorCache ??= (() => {
    try { return Number.parseInt(capture('npm --version'), 10) || 0; }
    catch { return 0; }
  })();
  return npmMajorCache;
}

// npm 12 blocks git packages (EALLOWGIT) unless the flag is given; older npm would warn about it.
export function withNpmCompat(command, args, major = npmMajor()) {
  return command === 'npx' && major >= 12 && args.some(arg => arg.startsWith('github:')) ? ['--allow-git=root', ...args] : args;
}

function execute(command, args, dryRun) {
  const argv = withNpmCompat(command, args);
  const parts = [command, ...argv];
  if (dryRun) { console.log(`  ${parts.join(' ')}`); return; }
  const unsafe = parts.find(part => !safeArg.test(part));
  if (unsafe) throw new Error(`Refusing unsafe argument: ${unsafe}`);
  // Windows needs a shell to resolve .cmd shims (npx, codex, claude). The line is built from vetted constants only.
  const result = process.platform === 'win32'
    ? spawnSync(parts.join(' '), { stdio: 'inherit', shell: true })
    : spawnSync(command, argv, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`exit ${result.status}: ${parts.join(' ')}`);
}

export async function install({ agents: targets, companions: selected = [], exists = installed, run = execute, has = onPath, update = false, dryRun = false }) {
  const results = [];
  for (const agent of targets) {
    for (const name of [project, ...selected]) {
      const record = (status, detail) => results.push({ name, agent, status, ...(detail && { detail }) });
      const refresh = update && name === project;
      if (!refresh && exists(name, agent)) { record('already installed'); continue; }
      const commands = name === project ? projectSteps(agent) : steps(name, agent);
      if (!commands) { record('manual step'); continue; }
      const missing = commands.map(([command]) => command).find(command => !has(command));
      if (missing) { record('cli not found', `${missing} is not on PATH`); continue; }
      try {
        for (const [command, args, mode] of commands) {
          // Re-adding a known marketplace exits non-zero; the install step after it is what counts.
          try { await run(command, args, dryRun); } catch (error) { if (mode !== 'soft') throw error; }
        }
        record(dryRun ? 'planned' : exists(name, agent) ? 'installed' : 'unverified');
      } catch (error) {
        record('failed', error.message);
      }
    }
  }
  return results;
}

export function doctor(targets, selected = companions.map(c => c[0]), exists = installed) {
  return targets.flatMap(agent => [project, ...selected].map(name => ({
    name, agent, status: exists(name, agent) ? 'installed' : 'missing',
  })));
}

async function choose(reader, title, items, required, preselected = []) {
  while (true) {
    console.log(`\n${title}`);
    items.forEach((item, index) => console.log(`  [${preselected.includes(item[0]) ? 'x' : ' '}] ${index + 1}. ${item[1]}${item[3]?.startsWith('http') ? ` — ${item[2]} (${item[3]})` : ''}`));
    const hint = preselected.length ? 'Enter = keep [x]' : required ? 'required' : 'Enter = none';
    const answer = await reader.question(`Numbers (comma separated; ${hint}): `);
    try {
      const picked = answer.trim() ? parseSelection(answer, items.length).map(index => items[index][0]) : preselected;
      if (required && !picked.length) throw new Error('Select at least one agent.');
      return picked;
    } catch (error) { console.error(error.message); }
  }
}

const usage = `Install ${project} with optional companions.

Usage: npx -y github:${repo} [options]

  (no options)        interactive: pick agents, then companions
  --agent a,b         agents: ${agents.map(a => a[0]).join(', ')}
  --with x,y          companions: ${companions.map(c => c[0]).join(', ')}
  --yes               non-interactive (needs --agent)
  --update            reinstall ${project} even if already present
  --doctor            report what is installed, change nothing
  --dry-run           print commands without running them
  --help

User scope is used. Antigravity IDE and Antigravity CLI are separate targets.
On npm 12+, --allow-git=root is added automatically for GitHub packages.`;

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return console.log(usage);
  let targets = options.agent;
  let selected = options.with;
  if (!targets && options.doctor) {
    targets = agents.map(a => a[0]).filter(id => detected(id));
    if (!targets.length) targets = agents.map(a => a[0]);
  }
  if (!targets || (!selected && !options.yes && !options.doctor)) {
    if (!process.stdin.isTTY) throw new Error('No interactive terminal. Pass --agent <ids> --yes (see --help).');
    const reader = createInterface({ input: process.stdin, output: process.stdout });
    try {
      targets ??= await choose(reader, 'Select target agents (detected ones are pre-checked)', agents, true, agents.map(a => a[0]).filter(id => detected(id)));
      selected ??= await choose(reader, 'Optional companions (none selected by default)', companions, false);
    } finally { reader.close(); }
  }
  selected ??= [];
  const label = id => agents.find(a => a[0] === id)[1];

  if (options.doctor) {
    console.log('Status');
    for (const row of doctor(targets)) console.log(`  ${label(row.agent)} / ${row.name}: ${row.status}`);
    return;
  }
  const results = await install({ agents: targets, companions: selected, update: options.update, dryRun: options['dry-run'] });
  console.log('\nResults');
  for (const result of results) {
    console.log(`  ${label(result.agent)} / ${result.name}: ${result.status}${result.detail ? ` (${result.detail})` : ''}`);
    if (result.status === 'manual step') console.log(`    ${manualStep(result.name, result.agent)}`);
    if (result.status === 'unverified') console.log('    Command succeeded but the install could not be confirmed; run --doctor after restarting the agent.');
    if (['installed', 'unverified'].includes(result.status) && afterNotes[`${result.agent}/${result.name}`]) console.log(`    ${afterNotes[`${result.agent}/${result.name}`]}`);
  }
  console.log('Restart the agent or open a new chat to load installed skills.');
  if (results.some(result => ['failed', 'cli not found'].includes(result.status))) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
