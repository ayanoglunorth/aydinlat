import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { parseSelection, parseArgs, install, installed, onPath, withNpmCompat, detected, doctor } from './install.mjs';

const base = { has: () => true };

test('multi-selection accepts several entries and an empty optional selection', () => {
  assert.deepEqual(parseSelection('1, 3', 4), [0, 2]);
  assert.deepEqual(parseSelection('', 3), []);
  assert.throws(() => parseSelection('1; rm -rf /', 3));
});

test('arguments are validated against known agents and companions', () => {
  assert.deepEqual(parseArgs(['--agent=codex,claude-code', '--with', 'caveman', '--yes']), { agent: ['codex', 'claude-code'], with: ['caveman'], yes: true });
  assert.throws(() => parseArgs(['--agent', 'vim']), /Unknown agent/);
  assert.throws(() => parseArgs(['--bogus']), /Unknown option/);
  assert.throws(() => parseArgs(['--with']), /needs a value/);
});

test('skips existing installs, keeps going after a failure, verifies results', async () => {
  const calls = [];
  const done = new Set(['aydinlat/codex']);
  const results = await install({
    ...base,
    agents: ['codex', 'claude-code'],
    companions: ['ponytail', 'superpowers'],
    exists: (name, agent) => done.has(`${name}/${agent}`),
    run: async (command, args) => {
      calls.push([command, args]);
      if (args.includes('ponytail@ponytail') && command === 'codex') throw new Error('failed');
      if (command === 'claude' && args.includes('superpowers@claude-plugins-official')) done.add('superpowers/claude-code');
    },
  });
  const status = (name, agent) => results.find(x => x.name === name && x.agent === agent).status;
  assert.equal(status('aydinlat', 'codex'), 'already installed');
  assert.equal(status('ponytail', 'codex'), 'failed');
  assert.equal(status('superpowers', 'claude-code'), 'installed');
  assert.equal(status('aydinlat', 'claude-code'), 'unverified');
  assert.ok(calls.some(([command, args]) => command === 'npx' && args.includes('ayanoglunorth/aydinlat') && args.includes('--copy')));
  assert.ok(calls.every(([, args]) => args.every(x => typeof x === 'string')));
});

test('--update reinstalls the skill but never touches existing companions', async () => {
  const calls = [];
  await install({ ...base, agents: ['codex'], companions: ['ponytail'], update: true, exists: () => true, run: async (...call) => calls.push(call) });
  assert.equal(calls.length, 1);
  assert.ok(calls[0][1].includes('ayanoglunorth/aydinlat'));
});

test('a missing agent CLI is reported instead of crashing mid-run', async () => {
  const calls = [];
  const results = await install({ agents: ['claude-code'], companions: ['ponytail'], exists: () => false, has: command => command === 'npx', run: async (...call) => calls.push(call) });
  assert.equal(results.find(x => x.name === 'ponytail').status, 'cli not found');
  assert.equal(calls.length, 1);
});

test('unsupported native integration is reported without running a fallback', async () => {
  const calls = [];
  const results = await install({ ...base, agents: ['cursor'], companions: ['superpowers'], exists: () => false, run: async (...call) => calls.push(call) });
  assert.equal(results.find(x => x.name === 'superpowers').status, 'manual step');
  assert.equal(calls.length, 1);
});

test('Antigravity CLI uses native plugins while the IDE remains a separate target', async () => {
  const calls = [];
  const results = await install({ ...base, agents: ['antigravity', 'antigravity-cli'], companions: ['superpowers', 'caveman'], exists: () => false, run: async (...call) => calls.push(call) });
  assert.equal(results.find(x => x.agent === 'antigravity' && x.name === 'superpowers').status, 'manual step');
  assert.ok(calls.some(([command, args]) => command === 'agy' && args.includes('https://github.com/obra/superpowers')));
  assert.ok(calls.some(([, args]) => args.includes('antigravity-cli') && args.includes('--only')));
  assert.ok(calls.some(([, args]) => args.includes('antigravity') && args.includes('ayanoglunorth/aydinlat')));
});

test('existing check uses each agent’s global skill directory', () => {
  const paths = [];
  installed('aydinlat', 'antigravity', path => { paths.push(path); return false; }, '/home/test');
  assert.ok(paths.includes(join('/home/test', '.gemini', 'antigravity', 'skills', 'aydinlat')));
});

test('Claude Code plugins are found in the plugin registry, not only the skills folder', () => {
  const registry = JSON.stringify({ plugins: { 'ponytail@ponytail': [{}], 'superpowers@claude-plugins-official': [{}] } });
  const check = name => installed(name, 'claude-code', () => false, '/h', () => registry);
  assert.equal(check('ponytail'), true);
  assert.equal(check('superpowers'), true);
  assert.equal(check('caveman'), false);
  assert.equal(installed('caveman', 'claude-code', () => false, '/h', () => { throw new Error('missing'); }), false);
});

test('Codex plugins come from the codex plugin list', () => {
  assert.equal(installed('caveman', 'codex', () => false, '/h', undefined, () => ['caveman']), true);
  assert.equal(installed('ponytail', 'codex', () => false, '/h', undefined, () => []), false);
});

test('npm 12 gets --allow-git=root only for GitHub packages', () => {
  assert.deepEqual(withNpmCompat('npx', ['-y', 'github:a/b'], 12), ['--allow-git=root', '-y', 'github:a/b']);
  assert.deepEqual(withNpmCompat('npx', ['-y', 'github:a/b'], 11), ['-y', 'github:a/b']);
  assert.deepEqual(withNpmCompat('npx', ['-y', 'skills@latest'], 12), ['-y', 'skills@latest']);
  assert.deepEqual(withNpmCompat('codex', ['plugin'], 12), ['plugin']);
});

test('PATH lookup honours PATHEXT on Windows', () => {
  const env = { PATH: 'C:\\bin;C:\\tools', PATHEXT: '.EXE;.CMD' };
  const exists = path => path === 'C:\\tools\\claude.cmd' || path === join('C:\\bin', 'x');
  assert.equal(onPath('claude', env, exists, true), true);
  assert.equal(onPath('gemini', env, exists, true), false);
});

test('agents are detected by CLI or config folder; doctor reports each pair', () => {
  assert.equal(detected('codex', () => true, () => false, '/h'), true);
  assert.equal(detected('cursor', () => false, p => p === join('/h', '.cursor'), '/h'), true);
  assert.equal(detected('gemini-cli', () => false, () => false, '/h'), false);
  const rows = doctor(['codex'], ['caveman'], name => name === 'aydinlat');
  assert.deepEqual(rows.map(r => r.status), ['installed', 'missing']);
});

test('a failing marketplace add does not block the plugin install', async () => {
  const done = new Set();
  const results = await install({ ...base, agents: ['claude-code'], companions: ['ponytail'], exists: (n, a) => done.has(n),
    run: async (command, args) => { if (args.includes('marketplace')) throw new Error('already added'); done.add(args.includes('ponytail@ponytail') ? 'ponytail' : 'x'); } });
  assert.equal(results.find(x => x.name === 'ponytail').status, 'installed');
});
