import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const file = new URL('./skills/aydinlat/SKILL.md', import.meta.url);
const text = readFileSync(file, 'utf8');
const [, front, body] = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text) ?? [];

test('frontmatter has a matching name and a trigger-rich description', () => {
  assert.ok(front, 'frontmatter missing');
  assert.match(front, /^name: aydinlat$/m);
  const description = /^description: (.+)$/m.exec(front)?.[1] ?? '';
  assert.ok(description.length > 80 && description.length <= 1024);
  assert.match(description, /\$aydinlat/);
  assert.match(description, /Use when/);
});

test('skill stays small so routing costs fewer tokens than it saves', () => {
  assert.ok(body.split('\n').length <= 140, 'body too long');
});

test('README invariants: no machine paths, no static skill inventory, no embedded caveman', () => {
  assert.doesNotMatch(text, /[A-Z]:\\|\/Users\/|\/home\/|\.claude\/plugins/);
  assert.doesNotMatch(text, /\b(gsap|impeccable|remotion|ui-ux-pro-max|brandkit)\b/i);
  assert.doesNotMatch(text, /Me caveman|ooga/i);
});

test('the Codex metadata ships inside the skill folder and the root has no SKILL.md', () => {
  assert.ok(existsSync(new URL('./skills/aydinlat/agents/openai.yaml', import.meta.url)));
  assert.equal(existsSync(new URL('./SKILL.md', import.meta.url)), false);
});
