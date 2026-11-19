import { testRule } from 'stylelint-test-rule-node';
import plugin, { message as ruleMessage, ruleName } from '../../dist/stylelint-vkui/index.js';

const message = `${ruleMessage} (${ruleName})`;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,

  accept: [
    {
      code: `.class{margin: 0 calc(-1*var(--some-var))}`,
    },
    {
      code: `.class{--abc: calc((-1 * var(--some-var)))}`,
    },
  ],

  reject: [
    {
      code: `.vkuiClass{margin: 0 calc(var(--some-var) * -1)}`,
      message,
    },
    {
      code: `.class .vkuiClass{margin: 0 calc(var(--some-var) * -1)}`,
      message,
    },
    {
      code: `.class{margin: 0 calc(var(--vkui_internal)*-1)}`,
      message,
    },
    {
      code: `.class{--vkui_internal: 123}`,
      message,
    },
    // https://drafts.csswg.org/selectors/#attribute-selectors
    {
      code: `.class[class="vkuiClass"]) {}`,
      message,
    },
    {
      code: `.class[class='vkuiClass']) {}`,
      message,
    },
    {
      code: `.class[class='Abc vkuiClass']) {}`,
      message,
    },
    {
      code: `.class[class~='vkuiClass']) {}`,
      message,
    },
    {
      code: `.class[class|='vkuiClass']) {}`,
      message,
    },
    {
      code: `.class[class^='vkuiClass']) {}`,
      message,
    },
    {
      code: `.class[class$='vkuiClass']) {}`,
      message,
    },
    {
      code: `.class[class*='vkuiClass']) {}`,
      message,
    },
  ],
});
