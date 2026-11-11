import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import stylelint from 'stylelint';

const configFile = path.resolve('index.js');

test('loads the built config and its plugins', async () => {
  const result = await stylelint.lint({
    code: '.Component { color: #fff; }',
    configFile,
  });

  assert.equal(result.errored, false);
  assert.deepEqual(result.results[0].warnings, []);
});

test('fixes logical shorthands with the built plugin', async () => {
  const result = await stylelint.lint({
    code: '.Component { padding: 1px 2px; }',
    config: { extends: [configFile], rules: { 'plugin/logical-shorthands': true } },
    fix: true,
  });

  assert.equal(result.errored, false);
  assert.equal(result.code, '.Component { padding-block: 1px; padding-inline: 2px; }');
  assert.deepEqual(result.results[0].warnings, []);
});

test('preserves logical shorthands disabled by a configuration comment', async () => {
  const code = '/* stylelint-disable plugin/logical-shorthands */\n.Component { padding: 1px 2px; }';
  const result = await stylelint.lint({
    code,
    config: { extends: [configFile], rules: { 'plugin/logical-shorthands': true } },
    fix: true,
  });

  assert.equal(result.errored, false);
  assert.equal(result.code, code);
  assert.deepEqual(result.results[0].warnings, []);
});
