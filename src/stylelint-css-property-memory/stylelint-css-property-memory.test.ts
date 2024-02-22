import { message, ruleName } from './index';

testRule({
  plugins: ['./src/stylelint-css-property-memory/index.ts'],
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
