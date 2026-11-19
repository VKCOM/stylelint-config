import { testRule } from 'stylelint-test-rule-node';
import plugin, { message as ruleMessage, ruleName } from '../../dist/stylelint-css-property-memory/index.js';

const message = `${ruleMessage} (${ruleName})`;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,

  accept: [
    {
      code: `.class{--good: green}`,
    },
    {
      code: `div{--good: green}`,
    },
  ],
  reject: [
    {
      code: `*{--bad: red}`,
      message,
    },
    {
      code: `.class > *{--bad: red}`,
      message,
    },
  ],
});
