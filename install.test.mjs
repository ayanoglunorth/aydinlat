import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { parseSelection, install, installed } from './install.mjs';

test('multi-selection accepts several entries and an empty optional selection', () => {
  assert.deepEqual(parseSelection('1, 3', 4), [0, 2]);
  assert.deepEqual(parseSelection('', 3), []);
  assert.throws(() => parseSelection('1; rm -rf /', 3));
});

test('skips existing installs, keeps going after a failure, and passes literal arguments', async () => {
  const calls = [];
  const results = await install({
    agents: ['codex', 'claude-code'],
    companions: ['ponytail', 'superpowers'],
    exists: (name, agent) => name === 'aydinlat' && agent === 'codex',
    run: async (command, args) => {
      calls.push([command, args]);
      if (args.includes('ponytail@ponytail')) throw new Error('failed');
    },
  });
  assert.equal(results.find(x => x.name === 'aydinlat' && x.agent === 'codex').status, 'already installed');
  assert.equal(results.find(x => x.name === 'ponytail' && x.agent === 'codex').status, 'failed');
  assert.equal(results.find(x => x.name === 'superpowers' && x.agent === 'claude-code').status, 'installed');
  assert.ok(calls.some(([command, args]) => command === 'npx' && args.includes('ayanoglunorth/aydinlat')));
  assert.ok(calls.every(([, args]) => args.every(x => typeof x === 'string')));
});

test('unsupported native integration is reported without running a fallback', async () => {
  const calls = [];
  const results = await install({ agents: ['cursor'], companions: ['superpowers'], exists: () => false, run: async (...call) => calls.push(call) });
  assert.equal(results.find(x => x.name === 'superpowers').status, 'manual step');
  assert.equal(calls.length, 1);
});

test('Antigravity CLI uses native plugins while the IDE remains a separate target', async () => {
  const calls = [];
  const results = await install({ agents: ['antigravity', 'antigravity-cli'], companions: ['superpowers', 'caveman'], exists: () => false, run: async (...call) => calls.push(call) });
  assert.equal(results.find(x => x.agent === 'antigravity' && x.name === 'superpowers').status, 'manual step');
  assert.ok(calls.some(([command, args]) => command === 'agy' && args.includes('https://github.com/obra/superpowers')));
  assert.ok(calls.some(([, args]) => args.includes('antigravity-cli')));
  assert.ok(calls.some(([, args]) => args.includes('antigravity') && args.includes('ayanoglunorth/aydinlat')));
});

test('existing check uses each agent’s global skill directory', () => {
  const paths = [];
  installed('aydinlat', 'antigravity', path => { paths.push(path); return false; }, '/home/test');
  assert.ok(paths.includes(join('/home/test', '.gemini', 'antigravity', 'skills', 'aydinlat')));
});
