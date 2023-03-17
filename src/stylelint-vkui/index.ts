import stylelint, { Rule } from "stylelint";

export const ruleName = "plugin/vkui";
const messages = stylelint.utils.ruleMessages(ruleName, {});
const meta = {
  url: "https://github.com/VKCOM/stylelint-config/tree/master/src/stylelint-vkui",
};

const ruleFunction: Rule = () => {
  return (root, result) => {
    root.walkRules(/\.vkui/, (node) => {
      stylelint.utils.report({
        ruleName,
        node,
        result,
        message: `НЕ ЗАВЯЗЫВАЙТЕСЬ НА ВНУТРЕННЮЮ РЕАЛИЗАЦИЮ КОМПОНЕНТОВ, ИНАЧЕ ПОТЕРЯЕТЕ ВОЗМОЖНОСТЬ ОБНОВЛЕНИЯ VKUI!`,
      });
    });

    root.walkDecls(/^--vkui_internal/, (node) => {
      stylelint.utils.report({
        ruleName,
        node,
        result,
        message: `Don't use \`--vkui_internal\``,
      });
    });

    root.walkDecls((node) => {
      if (node.value.indexOf("--vkui_internal") > -1) {
        stylelint.utils.report({
          ruleName,
          node,
          result,
          message: `Don't use \`--vkui_internal\``,
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
