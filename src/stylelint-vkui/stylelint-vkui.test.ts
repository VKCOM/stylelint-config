import { getTestRule } from "jest-preset-stylelint";
import { ruleName } from ".";

const testRule = getTestRule();

testRule({
  plugins: ["./src/stylelint-vkui"],
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
      message: `НЕ ЗАВЯЗЫВАЙТЕСЬ НА ВНУТРЕННЮЮ РЕАЛИЗАЦИЮ КОМПОНЕНТОВ, ИНАЧЕ ПОТЕРЯЕТЕ ВОЗМОЖНОСТЬ ОБНОВЛЕНИЯ VKUI!`,
    },
    {
      code: `.class .vkuiClass{margin: 0 calc(var(--some-var) * -1)}`,
      message: `НЕ ЗАВЯЗЫВАЙТЕСЬ НА ВНУТРЕННЮЮ РЕАЛИЗАЦИЮ КОМПОНЕНТОВ, ИНАЧЕ ПОТЕРЯЕТЕ ВОЗМОЖНОСТЬ ОБНОВЛЕНИЯ VKUI!`,
    },
    {
      code: `.class{margin: 0 calc(var(--vkui_internal)*-1)}`,
      message: `Don't use \`--vkui_internal\``,
    },
    {
      code: `.class{--vkui_internal: 123}`,
      message: `Don't use \`--vkui_internal\``,
    },
  ],
});
