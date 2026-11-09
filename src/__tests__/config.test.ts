import path from 'node:path';
import stylelint from 'stylelint';

const configFile = path.resolve('index.js');

test('loads the built config and its plugins', async () => {
  const result = await stylelint.lint({
    code: '.Component { color: #fff; }',
    configFile,
  });

  expect(result.errored).toBe(false);
  expect(result.results[0].warnings).toEqual([]);
});

test('fixes logical shorthands with the built plugin', async () => {
  const result = await stylelint.lint({
    code: '.Component { padding: 1px 2px; }',
    config: { extends: [configFile], rules: { 'plugin/logical-shorthands': true } },
    fix: true,
  });

  expect(result.errored).toBe(false);
  expect(result.code).toBe('.Component { padding-block: 1px; padding-inline: 2px; }');
  expect(result.results[0].warnings).toEqual([]);
});

test('preserves logical shorthands disabled by a configuration comment', async () => {
  const code = '/* stylelint-disable plugin/logical-shorthands */\n.Component { padding: 1px 2px; }';
  const result = await stylelint.lint({
    code,
    config: { extends: [configFile], rules: { 'plugin/logical-shorthands': true } },
    fix: true,
  });

  expect(result.errored).toBe(false);
  expect(result.code).toBe(code);
  expect(result.results[0].warnings).toEqual([]);
});
